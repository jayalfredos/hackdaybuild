// Vercel Serverless Function — health check for Anthropic API connectivity

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      status: "error",
      message: "ANTHROPIC_API_KEY not configured",
      keyPresent: false,
    });
  }

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
      return res.status(200).json({
        status: "ok",
        message: "API connected",
        keyPresent: true,
        model: data.model,
      });
    }

    const err = await response.json().catch(() => ({}));
    return res.status(200).json({
      status: "error",
      message: err?.error?.message || `API returned ${response.status}`,
      keyPresent: true,
      httpStatus: response.status,
    });
  } catch (err) {
    return res.status(200).json({
      status: "error",
      message: `Network error: ${err.message}`,
      keyPresent: true,
    });
  }
}
