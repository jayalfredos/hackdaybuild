import React, { useState, useRef, useEffect, useCallback } from "react";

// ─── Embedded Pattern Data ───────────────────────────────────────────────────
const PATTERNS = [
  // GOV.UK Design System — Components
  { name: "Accordion", system: "GOV.UK", category: "Components", description: "Let users show and hide sections of related content on a page. Useful for long pages where users need to find specific information without scrolling through everything.", url: "https://design-system.service.gov.uk/components/accordion/" },
  { name: "Back link", system: "GOV.UK", category: "Components", description: "A navigation link that takes users back to the previous page. Always place at the top of the page, before the main heading.", url: "https://design-system.service.gov.uk/components/back-link/" },
  { name: "Breadcrumbs", system: "GOV.UK", category: "Components", description: "Help users understand where they are in the site hierarchy and navigate back to higher-level pages. Use when the service has a defined structure of more than two levels.", url: "https://design-system.service.gov.uk/components/breadcrumbs/" },
  { name: "Button", system: "GOV.UK", category: "Components", description: "Use the button component to help users carry out an action like starting an application or saving their progress. Includes primary, secondary and warning button variants.", url: "https://design-system.service.gov.uk/components/button/" },
  { name: "Character count", system: "GOV.UK", category: "Components", description: "Tells users how many characters or words they have remaining as they type into a textarea. Helps users know how much content they can enter.", url: "https://design-system.service.gov.uk/components/character-count/" },
  { name: "Checkboxes", system: "GOV.UK", category: "Components", description: "Let users select one or more options by using checkboxes. Use when users need to select multiple answers from a list, or toggle a single option on or off.", url: "https://design-system.service.gov.uk/components/checkboxes/" },
  { name: "Cookie banner", system: "GOV.UK", category: "Components", description: "Allow users to accept or reject cookies which are not essential to making your service work. Displayed at the top of the page on the user's first visit.", url: "https://design-system.service.gov.uk/components/cookie-banner/" },
  { name: "Date input", system: "GOV.UK", category: "Components", description: "Use the date input component to help users enter a memorable date or one they can easily look up, using three separate fields for day, month and year.", url: "https://design-system.service.gov.uk/components/date-input/" },
  { name: "Details", system: "GOV.UK", category: "Components", description: "Make a page easier to scan by letting users reveal more detailed information only if they need it. Uses a progressive disclosure pattern.", url: "https://design-system.service.gov.uk/components/details/" },
  { name: "Error message", system: "GOV.UK", category: "Components", description: "Follow the validation pattern and show an error message when there is a validation error. Error messages explain what went wrong and how to fix it.", url: "https://design-system.service.gov.uk/components/error-message/" },
  { name: "Error summary", system: "GOV.UK", category: "Components", description: "Use this component at the top of a page to summarise any errors a user has made. Always show an error summary when there is a validation error, linking to each error.", url: "https://design-system.service.gov.uk/components/error-summary/" },
  { name: "Fieldset", system: "GOV.UK", category: "Components", description: "Use the fieldset component to group related form inputs. The first element inside a fieldset must be a legend describing the group of inputs.", url: "https://design-system.service.gov.uk/components/fieldset/" },
  { name: "File upload", system: "GOV.UK", category: "Components", description: "Help users select and upload a file. The file upload component uses the native file input, styled to be consistent with the rest of the design system.", url: "https://design-system.service.gov.uk/components/file-upload/" },
  { name: "Footer", system: "GOV.UK", category: "Components", description: "The footer provides copyright, licensing and other related information about your service. It sits at the bottom of every page.", url: "https://design-system.service.gov.uk/components/footer/" },
  { name: "Header", system: "GOV.UK", category: "Components", description: "The GOV.UK header shows users they are on GOV.UK and which service they are using. It includes the crown logo and optional service name and navigation.", url: "https://design-system.service.gov.uk/components/header/" },
  { name: "Inset text", system: "GOV.UK", category: "Components", description: "Use the inset text component to differentiate a block of text from the surrounding content. Useful for quotes, important information, or examples.", url: "https://design-system.service.gov.uk/components/inset-text/" },
  { name: "Notification banner", system: "GOV.UK", category: "Components", description: "Use a notification banner to tell the user about something they need to know, such as a successful action or important update on the current page.", url: "https://design-system.service.gov.uk/components/notification-banner/" },
  { name: "Pagination", system: "GOV.UK", category: "Components", description: "Help users navigate forwards and backwards through a series of pages, such as search results or guidance content split across several pages.", url: "https://design-system.service.gov.uk/components/pagination/" },
  { name: "Panel", system: "GOV.UK", category: "Components", description: "Use the panel component to display a large, prominent message to confirm that a transaction has been completed, such as a submission confirmation.", url: "https://design-system.service.gov.uk/components/panel/" },
  { name: "Phase banner", system: "GOV.UK", category: "Components", description: "Use the phase banner component to show users your service is still being worked on, using alpha or beta labels to indicate the stage.", url: "https://design-system.service.gov.uk/components/phase-banner/" },
  { name: "Radios", system: "GOV.UK", category: "Components", description: "Use the radios component when users can only select one option from a list. Include conditional reveals to show extra questions based on the selected option.", url: "https://design-system.service.gov.uk/components/radios/" },
  { name: "Select", system: "GOV.UK", category: "Components", description: "The select component should only be used as a last resort in government services because research shows that some users find selects very difficult to use.", url: "https://design-system.service.gov.uk/components/select/" },
  { name: "Skip link", system: "GOV.UK", category: "Components", description: "Use the skip link component to help keyboard-only users skip to the main content on a page. It is visually hidden until focused.", url: "https://design-system.service.gov.uk/components/skip-link/" },
  { name: "Summary list", system: "GOV.UK", category: "Components", description: "Use the summary list to summarise information, for example a user's responses at the end of a form, in a key-value format with optional change links.", url: "https://design-system.service.gov.uk/components/summary-list/" },
  { name: "Table", system: "GOV.UK", category: "Components", description: "Use the table component to make information easier to compare and scan for users. Tables should be used for tabular data only, not for layout.", url: "https://design-system.service.gov.uk/components/table/" },
  { name: "Tabs", system: "GOV.UK", category: "Components", description: "Tabs can be a helpful way of letting users quickly switch between related sections of content. On mobile, tabs collapse into an accordion.", url: "https://design-system.service.gov.uk/components/tabs/" },
  { name: "Tag", system: "GOV.UK", category: "Components", description: "Use the tag component to display the status of something, such as an application or a task in a task list. Available in multiple colours.", url: "https://design-system.service.gov.uk/components/tag/" },
  { name: "Text input", system: "GOV.UK", category: "Components", description: "Use the text input component for single-line answers like names, phone numbers and email addresses. Set the width to be appropriate for the expected input.", url: "https://design-system.service.gov.uk/components/text-input/" },
  { name: "Textarea", system: "GOV.UK", category: "Components", description: "Use the textarea component when you need to let users enter an amount of text that's longer than a single line, like a message or description.", url: "https://design-system.service.gov.uk/components/textarea/" },
  { name: "Warning text", system: "GOV.UK", category: "Components", description: "Use the warning text component when you need to warn users about something important, such as legal consequences of an action.", url: "https://design-system.service.gov.uk/components/warning-text/" },

  // GOV.UK Design System — Patterns
  { name: "Addresses", system: "GOV.UK", category: "Patterns", description: "Help users provide their address using lookup, free text, or multiple fields. Use an address lookup if you can to make entry faster.", url: "https://design-system.service.gov.uk/patterns/addresses/" },
  { name: "Ask users for names", system: "GOV.UK", category: "Patterns", description: "Use a single text input for full name unless you have a specific need for separate first and last name fields. Avoid titles unless legally required.", url: "https://design-system.service.gov.uk/patterns/names/" },
  { name: "Check answers", system: "GOV.UK", category: "Patterns", description: "Let users check and confirm their answers before submitting a form. Use a summary list to present all answers with the ability to change each one.", url: "https://design-system.service.gov.uk/patterns/check-answers/" },
  { name: "Confirmation pages", system: "GOV.UK", category: "Patterns", description: "Use a confirmation page to let users know they've completed a transaction. Include the reference number and explain what happens next.", url: "https://design-system.service.gov.uk/patterns/confirmation-pages/" },
  { name: "Equality information", system: "GOV.UK", category: "Patterns", description: "Ask users about their ethnicity, gender, sex, sexual orientation, religion, and disability status in a sensitive and inclusive way.", url: "https://design-system.service.gov.uk/patterns/equality-information/" },
  { name: "Question pages", system: "GOV.UK", category: "Patterns", description: "Follow a one-thing-per-page approach. Ask one question per page and use the page heading as the question label to reduce cognitive load.", url: "https://design-system.service.gov.uk/patterns/question-pages/" },
  { name: "Task list", system: "GOV.UK", category: "Patterns", description: "Help users understand the tasks involved in completing a transaction, the order they should complete them in, and when they have completed tasks.", url: "https://design-system.service.gov.uk/patterns/task-list-pages/" },

  // NHS Design System
  { name: "Action link", system: "NHS", category: "Components", description: "Use action links to help users get to the next stage of a process quickly, such as finding a GP surgery or booking an appointment.", url: "https://service-manual.nhs.uk/design-system/components/action-link" },
  { name: "Card", system: "NHS", category: "Components", description: "Use cards to present related content in a visually grouped format. Cards can contain an image, heading, description and link.", url: "https://service-manual.nhs.uk/design-system/components/card" },
  { name: "Care card", system: "NHS", category: "Components", description: "Use care cards to help users identify and understand the urgency level of their symptoms: non-urgent, urgent, or immediate (emergency).", url: "https://service-manual.nhs.uk/design-system/components/care-card" },
  { name: "Contents list", system: "NHS", category: "Components", description: "Use a contents list at the top of the page to allow users to navigate to specific sections within a long page of content.", url: "https://service-manual.nhs.uk/design-system/components/contents-list" },
  { name: "Do and Don't list", system: "NHS", category: "Components", description: "Use Do and Don't lists to help users understand what they should and should not do, for example health advice like self-care instructions.", url: "https://service-manual.nhs.uk/design-system/components/do-and-dont-list" },
  { name: "Expander", system: "NHS", category: "Components", description: "Make pages easier to scan by letting users expand and collapse sections of content they're interested in. Similar to the details component.", url: "https://service-manual.nhs.uk/design-system/components/expander" },
  { name: "Review date", system: "NHS", category: "Components", description: "Use review dates to reassure users that health information is up-to-date. Shows when the page was last reviewed and when the next review is due.", url: "https://service-manual.nhs.uk/design-system/components/review-date" },
  { name: "Warning callout", system: "NHS", category: "Components", description: "Use a warning callout to help users identify and understand warning content on the page, such as important safety information.", url: "https://service-manual.nhs.uk/design-system/components/warning-callout" },

  // MOJ Design System
  { name: "Banner", system: "MOJ", category: "Components", description: "Use banners to display prominent messages and related actions at the top of a page. Useful for system-wide announcements in justice services.", url: "https://design-patterns.service.justice.gov.uk/components/banner/" },
  { name: "Filter", system: "MOJ", category: "Components", description: "Help users narrow down a large list of items by applying filters. Shows selected filters as removable tags so users can see and adjust what they've selected.", url: "https://design-patterns.service.justice.gov.uk/components/filter/" },
  { name: "Identity bar", system: "MOJ", category: "Components", description: "Display key identifying information about a case or person at the top of the page. Used in case management systems to provide context.", url: "https://design-patterns.service.justice.gov.uk/components/identity-bar/" },
  { name: "Multi-select", system: "MOJ", category: "Components", description: "Let users select multiple items from a long list with search functionality. Combines a text input with a checkbox list for efficient selection.", url: "https://design-patterns.service.justice.gov.uk/components/multi-select/" },
  { name: "Page header actions", system: "MOJ", category: "Components", description: "Display actions alongside a page heading. Used for case management interfaces where multiple actions are available for a record.", url: "https://design-patterns.service.justice.gov.uk/components/page-header-actions/" },
  { name: "Primary navigation", system: "MOJ", category: "Components", description: "Help users navigate between the main sections of a service. Uses a horizontal bar with links to the top-level pages.", url: "https://design-patterns.service.justice.gov.uk/components/primary-navigation/" },
  { name: "Side navigation", system: "MOJ", category: "Components", description: "Allow users to navigate between related pages within a section. Displayed as a vertical list of links on the left side of the page.", url: "https://design-patterns.service.justice.gov.uk/components/side-navigation/" },
  { name: "Sub navigation", system: "MOJ", category: "Components", description: "Help users navigate within a section of a service, such as tabs within a case record. Shows related pages as horizontal links.", url: "https://design-patterns.service.justice.gov.uk/components/sub-navigation/" },
  { name: "Timeline", system: "MOJ", category: "Components", description: "Show a history of events or activity in chronological order, such as case history or audit logs in justice service systems.", url: "https://design-patterns.service.justice.gov.uk/components/timeline/" },
  { name: "Sortable table", system: "MOJ", category: "Components", description: "Allow users to sort tabular data by clicking column headers. Useful for lists of cases, records, or other structured data.", url: "https://design-patterns.service.justice.gov.uk/components/sortable-table/" },
];

// ─── System badge config ─────────────────────────────────────────────────────
const SYSTEM_CONFIG = {
  "GOV.UK": { color: "#1d70b8", bg: "#e8f0fe", label: "GOV.UK" },
  "NHS":    { color: "#005eb8", bg: "#e0f0ff", label: "NHS" },
  "MOJ":    { color: "#4e2a84", bg: "#f0ebf8", label: "MOJ" },
};

const CATEGORY_ICONS = {
  Components: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Patterns: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Semantic Search via server-side API route ──────────────────────────────
async function semanticSearch(query) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || `Server error: ${response.status}`);
  }

  const { indices } = await response.json();
  return indices
    .filter((i) => i >= 0 && i < PATTERNS.length)
    .slice(0, 5)
    .map((i) => PATTERNS[i]);
}

// ─── Fuzzy fallback (no API key) ────────────────────────────────────────────
function fallbackSearch(query) {
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  const scored = PATTERNS.map((p) => {
    const haystack = `${p.name} ${p.description} ${p.category} ${p.system}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (p.name.toLowerCase().includes(t)) score += 10;
      if (p.category.toLowerCase().includes(t)) score += 3;
      if (p.system.toLowerCase().includes(t)) score += 3;
      if (p.description.toLowerCase().includes(t)) score += 2;
      if (haystack.includes(t)) score += 1;
    }
    return { pattern: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.pattern);
}

// ─── Main Component ─────────────────────────────────────────────────────────
// ─── API Status Check ───────────────────────────────────────────────────────
// status: "checking" | "ok" | "error"
function useApiStatus() {
  const [status, setStatus] = useState({ state: "checking", message: "Checking API...", model: null, maskedKey: null, details: null });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/status");

        // If we got HTML back instead of JSON, the function isn't deployed
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const body = await res.text();
          if (cancelled) return;
          setStatus({
            state: "error",
            message: `/api/status returned ${contentType || "no content-type"} instead of JSON — Edge function not deployed. Check Vercel build logs.`,
            model: null,
            maskedKey: null,
            details: body.slice(0, 200),
          });
          return;
        }

        const data = await res.json();
        if (cancelled) return;
        if (data.status === "ok") {
          setStatus({
            state: "ok",
            message: `Connected — ${data.workingModel}`,
            model: data.workingModel,
            maskedKey: data.maskedKey,
            details: data.modelTests,
          });
        } else {
          setStatus({
            state: "error",
            message: data.message,
            model: null,
            maskedKey: data.maskedKey || null,
            details: data.modelTests || null,
          });
        }
      } catch (err) {
        if (cancelled) return;
        setStatus({
          state: "error",
          message: `Failed to reach /api/status: ${err.message}`,
          model: null,
          maskedKey: null,
          details: null,
        });
      }
    }
    check();
    return () => { cancelled = true; };
  }, []);

  return status;
}

export default function GDSPatternSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const inputRef = useRef(null);
  const apiStatus = useApiStatus();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback(
    async (e) => {
      e?.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      setLoading(true);
      setError(null);
      setResults(null);

      try {
        const matches = await semanticSearch(trimmed);
        setResults(matches);
      } catch (err) {
        setError(err.message);
        setResults(fallbackSearch(trimmed));
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const filteredResults = results
    ? activeFilter === "All"
      ? results
      : results.filter((r) => r.system === activeFilter)
    : null;

  const systemCounts = results
    ? results.reduce((acc, r) => {
        acc[r.system] = (acc[r.system] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f5f5f7 0%, #ffffff 40%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: "#1d1d1f",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "60px 24px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            borderRadius: 100,
            padding: "6px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
            fontSize: 13,
            fontWeight: 500,
            color: "#6e6e73",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                apiStatus.state === "ok"
                  ? "#34c759"
                  : apiStatus.state === "error"
                    ? "#ff3b30"
                    : "#ffcc00",
              display: "inline-block",
              animation: apiStatus.state === "checking" ? "pulse 1.2s ease infinite" : "none",
            }}
          />
          {apiStatus.state === "checking"
            ? "Checking API..."
            : apiStatus.state === "ok"
              ? `API connected — ${PATTERNS.length} patterns`
              : `API offline — keyword search only`}
        </div>
        {apiStatus.state === "error" && (
          <div style={{ fontSize: 12, color: "#ff3b30", margin: "0 0 12px", lineHeight: 1.6, textAlign: "left", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{apiStatus.message}</p>
            {apiStatus.maskedKey && (
              <p style={{ margin: "4px 0 0", color: "#86868b" }}>Key: {apiStatus.maskedKey}</p>
            )}
            {apiStatus.details && Array.isArray(apiStatus.details) && (
              <div style={{ marginTop: 8, background: "#fafafa", borderRadius: 8, padding: "8px 12px", border: "1px solid #e5e5e5" }}>
                <p style={{ margin: "0 0 4px", color: "#1d1d1f", fontWeight: 600 }}>Model test results:</p>
                {apiStatus.details.map((t, i) => (
                  <p key={i} style={{ margin: "2px 0", color: t.status === "ok" ? "#34c759" : "#86868b" }}>
                    {t.status === "ok" ? "\u2713" : "\u2717"} {t.model}{t.error ? ` — ${t.error}` : ""}
                  </p>
                ))}
              </div>
            )}
            {apiStatus.details && typeof apiStatus.details === "string" && (
              <p style={{ margin: "4px 0 0", color: "#86868b", fontFamily: "monospace", fontSize: 11 }}>
                Response: {apiStatus.details}
              </p>
            )}
          </div>
        )}

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            margin: "0 0 12px",
            background: "linear-gradient(135deg, #1d1d1f 0%, #515154 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Pattern Matcher
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "#86868b",
            lineHeight: 1.5,
            margin: "0 0 36px",
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Semantic search across GOV.UK, NHS and MOJ design systems.
          <br />
          Find the right component or pattern in seconds.
        </p>
      </header>

      {/* ── Search ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 24px" }}>
        <form onSubmit={handleSearch}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 16,
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
              transition: "box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(0,0,0,0.08), 0 0 0 2px rgba(29,112,184,0.3)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)";
            }}
          >
            {/* Search icon */}
            <svg
              style={{
                position: "absolute",
                left: 18,
                pointerEvents: "none",
                color: "#86868b",
              }}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.75" />
              <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patterns — e.g. &quot;collect user address&quot; or &quot;show errors&quot;"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "18px 18px 18px 50px",
                fontSize: 16,
                fontFamily: "inherit",
                background: "transparent",
                color: "#1d1d1f",
                borderRadius: 16,
              }}
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              style={{
                margin: 6,
                padding: "10px 22px",
                background: loading
                  ? "#86868b"
                  : !query.trim()
                    ? "#d2d2d7"
                    : "#1d70b8",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: loading || !query.trim() ? "default" : "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                    <path d="M14 8a6 6 0 0 0-6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  Searching
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#86868b" }}>
          Powered by Claude — semantic search across {PATTERNS.length} patterns
        </p>
      </div>

      {/* ── Results ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Error notice */}
        {error && (
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 14,
              color: "#664d03",
            }}
          >
            API error — showing keyword results instead. {error}
          </div>
        )}

        {/* Filter pills */}
        {results && results.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {["All", ...Object.keys(systemCounts)].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 100,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  background:
                    activeFilter === filter ? "#1d1d1f" : "#f5f5f7",
                  color: activeFilter === filter ? "#fff" : "#6e6e73",
                  transition: "all 0.2s ease",
                }}
              >
                {filter}
                {filter !== "All" && (
                  <span style={{ marginLeft: 4, opacity: 0.6 }}>
                    {systemCounts[filter]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Result cards */}
        {filteredResults && filteredResults.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "#86868b",
            }}
          >
            <p style={{ fontSize: 17, margin: 0 }}>No matching patterns found</p>
            <p style={{ fontSize: 14, margin: "8px 0 0" }}>
              Try different search terms
            </p>
          </div>
        )}

        {filteredResults &&
          filteredResults.map((pattern, i) => {
            const sys = SYSTEM_CONFIG[pattern.system];
            return (
              <a
                key={`${pattern.system}-${pattern.name}`}
                href={pattern.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                  borderRadius: 16,
                  padding: "20px 24px",
                  marginBottom: 12,
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)",
                  transition: "all 0.2s ease",
                  animation: `fadeSlideIn 0.35s ease ${i * 0.06}s both`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: sys.bg,
                        color: sys.color,
                      }}
                    >
                      {sys.label}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: "#86868b",
                        fontWeight: 500,
                      }}
                    >
                      {CATEGORY_ICONS[pattern.category]}
                      {pattern.category}
                    </span>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ color: "#c7c7cc", flexShrink: 0 }}
                  >
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    margin: "0 0 6px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {pattern.name}
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "#6e6e73",
                    margin: 0,
                  }}
                >
                  {pattern.description}
                </p>
              </a>
            );
          })}

        {/* Empty state */}
        {!results && !loading && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div
              style={{
                display: "inline-flex",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {Object.entries(SYSTEM_CONFIG).map(([key, sys]) => (
                <span
                  key={key}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    background: sys.bg,
                    color: sys.color,
                  }}
                >
                  {sys.label}
                </span>
              ))}
            </div>
            <p
              style={{
                fontSize: 15,
                color: "#86868b",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Try searching for concepts like "collect user information",
              <br />
              "navigation", "error handling", or "urgent health warning"
            </p>
          </div>
        )}
      </div>

      {/* ── Keyframe animations ────────────────────────────────────── */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        ::placeholder {
          color: #c7c7cc;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
