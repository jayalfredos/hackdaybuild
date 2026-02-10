// Vercel Serverless Function — proxies semantic search to Anthropic API
// Set ANTHROPIC_API_KEY in Vercel Environment Variables

const PATTERNS = [
  { idx: 0, name: "Accordion", system: "GOV.UK", category: "Components", desc: "Let users show and hide sections of related content on a page." },
  { idx: 1, name: "Back link", system: "GOV.UK", category: "Components", desc: "Navigation link that takes users back to the previous page." },
  { idx: 2, name: "Breadcrumbs", system: "GOV.UK", category: "Components", desc: "Help users understand where they are in the site hierarchy." },
  { idx: 3, name: "Button", system: "GOV.UK", category: "Components", desc: "Help users carry out an action like starting an application. Primary, secondary and warning variants." },
  { idx: 4, name: "Character count", system: "GOV.UK", category: "Components", desc: "Tells users how many characters or words they have remaining as they type." },
  { idx: 5, name: "Checkboxes", system: "GOV.UK", category: "Components", desc: "Let users select one or more options from a list." },
  { idx: 6, name: "Cookie banner", system: "GOV.UK", category: "Components", desc: "Allow users to accept or reject non-essential cookies." },
  { idx: 7, name: "Date input", system: "GOV.UK", category: "Components", desc: "Help users enter a memorable date using day, month and year fields." },
  { idx: 8, name: "Details", system: "GOV.UK", category: "Components", desc: "Progressive disclosure — let users reveal more information only if needed." },
  { idx: 9, name: "Error message", system: "GOV.UK", category: "Components", desc: "Show error message when there is a validation error. Explains what went wrong." },
  { idx: 10, name: "Error summary", system: "GOV.UK", category: "Components", desc: "Summarise all validation errors at the top of a page, linking to each." },
  { idx: 11, name: "Fieldset", system: "GOV.UK", category: "Components", desc: "Group related form inputs with a legend." },
  { idx: 12, name: "File upload", system: "GOV.UK", category: "Components", desc: "Help users select and upload a file." },
  { idx: 13, name: "Footer", system: "GOV.UK", category: "Components", desc: "Copyright, licensing and related info at the bottom of every page." },
  { idx: 14, name: "Header", system: "GOV.UK", category: "Components", desc: "Shows users they are on GOV.UK. Crown logo and optional service name." },
  { idx: 15, name: "Inset text", system: "GOV.UK", category: "Components", desc: "Differentiate a block of text from surrounding content." },
  { idx: 16, name: "Notification banner", system: "GOV.UK", category: "Components", desc: "Tell users about something they need to know, like a successful action." },
  { idx: 17, name: "Pagination", system: "GOV.UK", category: "Components", desc: "Navigate forwards and backwards through a series of pages." },
  { idx: 18, name: "Panel", system: "GOV.UK", category: "Components", desc: "Large prominent message to confirm a transaction has been completed." },
  { idx: 19, name: "Phase banner", system: "GOV.UK", category: "Components", desc: "Show service is in alpha or beta stage." },
  { idx: 20, name: "Radios", system: "GOV.UK", category: "Components", desc: "Let users select one option from a list. Supports conditional reveals." },
  { idx: 21, name: "Select", system: "GOV.UK", category: "Components", desc: "Dropdown select — last resort, research shows users find it difficult." },
  { idx: 22, name: "Skip link", system: "GOV.UK", category: "Components", desc: "Help keyboard users skip to main content. Visually hidden until focused." },
  { idx: 23, name: "Summary list", system: "GOV.UK", category: "Components", desc: "Summarise information in key-value format with optional change links." },
  { idx: 24, name: "Table", system: "GOV.UK", category: "Components", desc: "Make information easier to compare and scan. For tabular data only." },
  { idx: 25, name: "Tabs", system: "GOV.UK", category: "Components", desc: "Switch between related sections of content. Collapses to accordion on mobile." },
  { idx: 26, name: "Tag", system: "GOV.UK", category: "Components", desc: "Display status of something, like a task. Multiple colour variants." },
  { idx: 27, name: "Text input", system: "GOV.UK", category: "Components", desc: "Single-line input for names, phone numbers, emails." },
  { idx: 28, name: "Textarea", system: "GOV.UK", category: "Components", desc: "Multi-line text input for messages or descriptions." },
  { idx: 29, name: "Warning text", system: "GOV.UK", category: "Components", desc: "Warn users about something important, such as legal consequences." },
  { idx: 30, name: "Addresses", system: "GOV.UK", category: "Patterns", desc: "Help users provide their address using lookup, free text, or multiple fields." },
  { idx: 31, name: "Ask users for names", system: "GOV.UK", category: "Patterns", desc: "Single text input for full name unless separate fields needed." },
  { idx: 32, name: "Check answers", system: "GOV.UK", category: "Patterns", desc: "Let users check and confirm answers before submitting a form." },
  { idx: 33, name: "Confirmation pages", system: "GOV.UK", category: "Patterns", desc: "Confirm transaction completion with reference number and next steps." },
  { idx: 34, name: "Equality information", system: "GOV.UK", category: "Patterns", desc: "Ask about ethnicity, gender, sex, orientation, religion, disability sensitively." },
  { idx: 35, name: "Question pages", system: "GOV.UK", category: "Patterns", desc: "One-thing-per-page approach. Ask one question per page." },
  { idx: 36, name: "Task list", system: "GOV.UK", category: "Patterns", desc: "Help users understand tasks involved in completing a transaction." },
  { idx: 37, name: "Action link", system: "NHS", category: "Components", desc: "Help users get to next stage of a process like finding a GP." },
  { idx: 38, name: "Card", system: "NHS", category: "Components", desc: "Present related content in a visually grouped format with image and link." },
  { idx: 39, name: "Care card", system: "NHS", category: "Components", desc: "Help users identify urgency level: non-urgent, urgent, or emergency." },
  { idx: 40, name: "Contents list", system: "NHS", category: "Components", desc: "Navigate to specific sections within a long page." },
  { idx: 41, name: "Do and Don't list", system: "NHS", category: "Components", desc: "Help users understand what they should and should not do." },
  { idx: 42, name: "Expander", system: "NHS", category: "Components", desc: "Expand and collapse sections of content. Similar to details component." },
  { idx: 43, name: "Review date", system: "NHS", category: "Components", desc: "Reassure users health information is up-to-date with review dates." },
  { idx: 44, name: "Warning callout", system: "NHS", category: "Components", desc: "Help users identify warning content like important safety information." },
  { idx: 45, name: "Banner", system: "MOJ", category: "Components", desc: "Display prominent messages and related actions at top of page." },
  { idx: 46, name: "Filter", system: "MOJ", category: "Components", desc: "Narrow down a large list with removable filter tags." },
  { idx: 47, name: "Identity bar", system: "MOJ", category: "Components", desc: "Display key identifying info about a case or person at page top." },
  { idx: 48, name: "Multi-select", system: "MOJ", category: "Components", desc: "Select multiple items from a long list with search functionality." },
  { idx: 49, name: "Page header actions", system: "MOJ", category: "Components", desc: "Display actions alongside a page heading for case management." },
  { idx: 50, name: "Primary navigation", system: "MOJ", category: "Components", desc: "Navigate between main sections of a service. Horizontal bar." },
  { idx: 51, name: "Side navigation", system: "MOJ", category: "Components", desc: "Navigate between related pages within a section. Vertical list." },
  { idx: 52, name: "Sub navigation", system: "MOJ", category: "Components", desc: "Navigate within a section, like tabs within a case record." },
  { idx: 53, name: "Timeline", system: "MOJ", category: "Components", desc: "Show history of events in chronological order, like case history." },
  { idx: 54, name: "Sortable table", system: "MOJ", category: "Components", desc: "Sort tabular data by clicking column headers." },
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { query } = req.body;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Missing or empty query" });
  }

  const patternSummaries = PATTERNS.map(
    (p) => `[${p.idx}] ${p.name} (${p.system} / ${p.category}): ${p.desc}`
  ).join("\n");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: `You are a UK Government Design System expert. A user is searching for design patterns/components.

Their query: "${query.trim().replace(/"/g, '\\"')}"

Available patterns:
${patternSummaries}

Return ONLY the indices of the top 5 most relevant patterns as a JSON array of numbers, ordered by relevance. Consider semantic meaning, not just keyword matching.

Respond with ONLY a JSON array like [3,7,12,0,5] — no other text.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(502).json({
        error: err?.error?.message || `Anthropic API error: ${response.status}`,
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "[]";
    const match = text.match(/\[[\d,\s]+\]/);

    if (!match) {
      return res.status(502).json({ error: "Unexpected response format from API" });
    }

    const indices = JSON.parse(match[0])
      .filter((i) => i >= 0 && i < PATTERNS.length)
      .slice(0, 5);

    return res.status(200).json({ indices });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
