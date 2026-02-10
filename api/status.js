// Vercel Edge Function — health check for Anthropic API connectivity

export const config = { runtime: "edge" };

function json(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return json({
      status: "error",
      message: "ANTHROPIC_API_KEY not configured in Vercel Environment Variables",
      keyPresent: false,
    });
  }

  // Mask the key for diagnostics (show first 10 + last 4 chars)
  const maskedKey = apiKey.length > 14
    ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`
    : "***";

  // Verify the key works with a minimal API call
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return json({
        status: "ok",
        message: "API connected",
        keyPresent: true,
        maskedKey,
        model: data.model,
      });
    }

    // Parse error details
    const errBody = await response.text();
    let errMsg;
    try {
      const parsed = JSON.parse(errBody);
      errMsg = parsed?.error?.message || `HTTP ${response.status}`;
    } catch {
      errMsg = `HTTP ${response.status}: ${errBody.slice(0, 300)}`;
    }

    return json({
      status: "error",
      message: errMsg,
      keyPresent: true,
      maskedKey,
      httpStatus: response.status,
    });
  } catch (err) {
    return json({
      status: "error",
      message: `Network error: ${err.message}`,
      keyPresent: true,
      maskedKey,
    });
  }
}
