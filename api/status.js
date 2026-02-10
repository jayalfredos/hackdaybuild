// Vercel Edge Function — diagnostic health check
// Tests multiple Claude models to find one that works with the API key

export const config = { runtime: "edge" };

// Models to test, from newest to oldest
const MODELS_TO_TEST = [
  "claude-sonnet-4-5-20250929",
  "claude-sonnet-4-20250514",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-haiku-20241022",
  "claude-3-haiku-20240307",
];

function json(data) {
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function testModel(apiKey, model) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { model, status: "ok", returnedModel: data.model };
    }

    const errBody = await response.text();
    let errMsg;
    try {
      const parsed = JSON.parse(errBody);
      errMsg = parsed?.error?.message || `HTTP ${response.status}`;
    } catch {
      errMsg = `HTTP ${response.status}: ${errBody.slice(0, 200)}`;
    }
    return { model, status: "error", httpStatus: response.status, error: errMsg };
  } catch (err) {
    return { model, status: "error", error: `Network: ${err.message}` };
  }
}

export default async function handler() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return json({
      status: "error",
      message: "ANTHROPIC_API_KEY is not set. Go to Vercel → Project Settings → Environment Variables and add it.",
      keyPresent: false,
      keyLength: 0,
    });
  }

  const maskedKey = apiKey.length > 14
    ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`
    : "***";

  // Test all models in parallel
  const results = await Promise.all(
    MODELS_TO_TEST.map((m) => testModel(apiKey, m))
  );

  const working = results.find((r) => r.status === "ok");

  return json({
    status: working ? "ok" : "error",
    message: working
      ? `API connected — ${working.returnedModel} works`
      : `All ${MODELS_TO_TEST.length} models failed — check API key and permissions`,
    keyPresent: true,
    keyLength: apiKey.length,
    maskedKey,
    workingModel: working ? working.returnedModel : null,
    modelTests: results,
  });
}
