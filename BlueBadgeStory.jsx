import React, { useState, useEffect, useRef } from "react";

// ─── Journey steps with GDS pattern mapping ─────────────────────────────────
const JOURNEY = [
  {
    phase: "Understand",
    title: "Who are you applying for?",
    description: "The very first thing Sarah needs to know is who's filling in the form. Is it the person themselves, a carer, or an organisation? One question, one page — no clutter.",
    patterns: [
      { name: "Question pages", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/question-pages/", why: "One thing per page reduces cognitive load. Each screen asks a single question so users never feel overwhelmed." },
      { name: "Radios", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/radios/", why: "When there's a small list of mutually exclusive options, radios make the choice visible and tappable — no hidden dropdowns." },
    ],
  },
  {
    phase: "Understand",
    title: "Check eligibility",
    description: "Before collecting any personal details, Sarah's service checks whether the applicant qualifies. Do they receive PIP, DLA, or are they registered blind? This saves people from filling in a long form only to be told they don't qualify.",
    patterns: [
      { name: "Radios", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/radios/", why: "Conditional reveals let Sarah show follow-up questions only when relevant — like asking for a PIP reference number only if someone selects PIP." },
      { name: "Details", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/details/", why: "Expandable sections like 'What counts as automatic eligibility' give extra help without cluttering the page for people who don't need it." },
      { name: "Inset text", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/inset-text/", why: "Draws attention to important information — like telling someone they're automatically eligible based on their benefits." },
    ],
  },
  {
    phase: "Organise",
    title: "Show the full journey ahead",
    description: "Now the applicant knows they're eligible, Sarah needs to show them everything they'll need to do — without making it feel like a wall of forms. A task list breaks it into manageable chunks they can complete in any order.",
    patterns: [
      { name: "Task list", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/task-list-pages/", why: "Lets users see all sections at a glance, complete them in any order, and come back later. Each task shows its status: not started, in progress, or completed." },
      { name: "Tag", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/tag/", why: "Colour-coded status labels make it instantly clear what's done and what's left. Grey for not started, blue for completed." },
    ],
  },
  {
    phase: "Collect",
    title: "Collect their name",
    description: "Sarah needs the applicant's full legal name for the badge. Research shows a single 'Full name' field works for most people — but Blue Badges are legal documents, so she uses separate fields for first name and surname.",
    patterns: [
      { name: "Ask users for names", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/names/", why: "GDS research found that separate fields work better when the service needs to use parts of the name independently — like printing 'J. Smith' on a badge." },
      { name: "Text input", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/text-input/", why: "Simple, accessible single-line fields. The width is set to match the expected input length so users know roughly how much to type." },
      { name: "Fieldset", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/fieldset/", why: "Groups the name fields together with a legend, so screen readers announce them as a related set." },
    ],
  },
  {
    phase: "Collect",
    title: "Ask for their date of birth",
    description: "The badge needs a date of birth for identity verification. Three separate fields for day, month and year — because date pickers are a nightmare for dates you know from memory.",
    patterns: [
      { name: "Date input", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/date-input/", why: "Three numeric inputs are faster and more accessible than a calendar date picker for memorable dates. The hint text shows the exact format expected." },
    ],
  },
  {
    phase: "Collect",
    title: "Get their address",
    description: "Sarah needs the applicant's home address to post the badge and verify they live in the borough. A postcode lookup makes this fast — but there's always a manual entry fallback for addresses the lookup can't find.",
    patterns: [
      { name: "Addresses", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/addresses/", why: "Postcode lookup reduces errors and saves time. The manual fallback ensures nobody gets stuck — some new builds or rural addresses aren't in lookup databases." },
    ],
  },
  {
    phase: "Collect",
    title: "Understand their mobility",
    description: "For applicants who aren't automatically eligible, Sarah needs to understand how their condition affects their daily life. This is sensitive — the questions need to be clear without being clinical or intrusive.",
    patterns: [
      { name: "Textarea", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/textarea/", why: "Open text fields let people describe their condition in their own words — medical jargon isn't required." },
      { name: "Character count", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/character-count/", why: "Shows how much space is left as people type, so they know they can write enough detail without worrying about hitting a limit." },
      { name: "Checkboxes", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/checkboxes/", why: "People often use multiple mobility aids — checkboxes let them select all that apply, unlike radios which force a single choice." },
    ],
  },
  {
    phase: "Evidence",
    title: "Upload their photo and documents",
    description: "The badge needs a passport-style photo, proof of identity, proof of address, and possibly medical evidence. That's a lot of uploads — Sarah makes sure each one has clear requirements and accepts common file types.",
    patterns: [
      { name: "File upload", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/file-upload/", why: "The native file input is styled consistently and works on every device — including phones where people can take a photo directly from the camera." },
      { name: "Inset text", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/inset-text/", why: "Photo requirements (front-facing, plain background, no hat) are displayed prominently so people don't upload something that gets rejected." },
    ],
  },
  {
    phase: "Protect",
    title: "Handle errors gracefully",
    description: "People will make mistakes — leave a field blank, upload the wrong file type, enter a future date of birth. Sarah's service needs to catch these clearly and help people fix them without frustration.",
    patterns: [
      { name: "Error summary", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/error-summary/", why: "A summary at the top of the page lists every error with links to each field. Screen readers announce it immediately when the page loads." },
      { name: "Error message", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/error-message/", why: "Each field with an error gets a specific message explaining what went wrong and how to fix it — not generic 'invalid input' nonsense." },
      { name: "Warning text", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/warning-text/", why: "For the legal declaration, a warning icon with bold text makes it clear that providing false information has real consequences." },
    ],
  },
  {
    phase: "Confirm",
    title: "Let them check their answers",
    description: "Before submitting, the applicant sees everything they've entered — every name, address, date, and uploaded document — with the ability to change any answer. This is their safety net.",
    patterns: [
      { name: "Check answers", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/check-answers/", why: "Research shows this page catches errors that inline validation misses. People spot their own typos when they see all their answers together." },
      { name: "Summary list", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/summary-list/", why: "Key-value pairs with 'Change' links make it easy to scan and fix individual answers without scrolling through the whole form again." },
    ],
  },
  {
    phase: "Confirm",
    title: "Confirm the application",
    description: "The moment of relief. A big green panel with a reference number tells the applicant it's done. Below that, clear guidance on what happens next — when they'll hear back, what to do if they need to make changes.",
    patterns: [
      { name: "Confirmation pages", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/confirmation-pages/", why: "This pattern is proven to give users confidence that their submission worked. The reference number and 'what happens next' section reduce follow-up calls to the council." },
      { name: "Panel", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/panel/", why: "The large, coloured panel is unmistakable — users instantly know they've completed the transaction. It's the most satisfying moment in the whole journey." },
    ],
  },
];

const PHASE_CONFIG = {
  Understand: { color: "#1d70b8", bg: "#e8f0fe", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" },
  Organise: { color: "#4c2c92", bg: "#f0ebf8", icon: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" },
  Collect: { color: "#00703c", bg: "#e6f3ec", icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9h-2v2H9v-2H7v-2h2V7h2v2h2v2zm-2-8.5L16.5 8H11V3.5z" },
  Evidence: { color: "#d4351c", bg: "#fce4e0", icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" },
  Protect: { color: "#f47738", bg: "#fef3ec", icon: "M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" },
  Confirm: { color: "#00703c", bg: "#e6f3ec", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
};

const SCAFFOLDING_PATTERNS = [
  { name: "Header", why: "Shows the GOV.UK crown and service name on every page", url: "https://design-system.service.gov.uk/components/header/" },
  { name: "Footer", why: "Copyright, accessibility statement, and cookie links", url: "https://design-system.service.gov.uk/components/footer/" },
  { name: "Phase banner", why: "Tells users the service is in beta with a feedback link", url: "https://design-system.service.gov.uk/components/phase-banner/" },
  { name: "Back link", why: "Lets users go back to the previous page at any point", url: "https://design-system.service.gov.uk/components/back-link/" },
  { name: "Skip link", why: "Keyboard users can jump straight to the main content", url: "https://design-system.service.gov.uk/components/skip-link/" },
  { name: "Notification banner", why: "Tells users about important updates or saved progress", url: "https://design-system.service.gov.uk/components/notification-banner/" },
];

// ─── Animated counter ────────────────────────────────────────────────────────
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

// ─── Fade-in on scroll ──────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function BlueBadgeStory() {
  const allPatterns = JOURNEY.flatMap((s) => s.patterns);
  const uniquePatterns = [...new Map(allPatterns.map((p) => [p.name, p])).values()];
  const [patternCount, patternRef] = useCountUp(uniquePatterns.length);
  const [stepCount, stepRef] = useCountUp(JOURNEY.length);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: "#1d1d1f",
      }}
    >
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(165deg, #0b0c0e 0%, #1a1d23 40%, #1d3557 100%)",
          color: "#fff",
          padding: "80px 24px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 70% 20%, rgba(29,112,184,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 28,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
              A design pattern story
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                margin: "0 0 20px",
              }}
            >
              Building an 'Apply for<br />a Blue Badge' service
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(17px, 2.5vw, 20px)", lineHeight: 1.55, color: "rgba(255,255,255,0.65)", margin: "0 0 40px", maxWidth: 560 }}>
              The story of a council service officer and the design patterns
              that help 2.35 million people park where they need to go.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{ display: "flex", gap: 32 }}>
              <div ref={stepRef}>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{stepCount}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>journey steps</div>
              </div>
              <div ref={patternRef}>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{patternCount}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>GDS patterns</div>
              </div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>0</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>built from scratch</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── The Brief ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 0" }}>
        <FadeIn>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1d70b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            The brief
          </p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 20px" }}>
            Meet Sarah
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#424245", margin: "0 0 16px" }}>
            Sarah is a service officer at a local council. She's been asked to build a digital service
            that helps residents apply for a Blue Badge — the disabled parking permit that lets people
            park closer to where they need to go.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div
            style={{
              background: "#f5f5f7",
              borderRadius: 16,
              padding: "24px 28px",
              margin: "28px 0",
              borderLeft: "4px solid #1d70b8",
            }}
          >
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "#1d1d1f", margin: 0, fontStyle: "italic" }}>
              "I need to create a service that helps people in my area who need a Blue Badge
              to park where they need to go."
            </p>
            <p style={{ fontSize: 14, color: "#86868b", margin: "12px 0 0", fontWeight: 500 }}>
              — Sarah, Service Officer
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#424245", margin: "0 0 16px" }}>
            Sarah doesn't need to start from a blank page. The GOV.UK Design System gives her
            a library of tested, accessible patterns that millions of people already know how to use.
            Each one solves a real problem — backed by research with real users.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#424245", margin: "0 0 0" }}>
            Let's follow her journey.
          </p>
        </FadeIn>
      </section>

      {/* ── User Needs ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px 0" }}>
        <FadeIn>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#4c2c92", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            Understanding user needs
          </p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 20px" }}>
            Before writing a line of code
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#424245", margin: "0 0 28px" }}>
            Sarah starts by thinking about what the applicant needs — not what the council's internal systems need.
            She maps out the journey from the user's perspective:
          </p>
        </FadeIn>

        <div style={{ display: "grid", gap: 12 }}>
          {[
            { need: "Know if I'm eligible", detail: "before investing time in an application" },
            { need: "Prove who I am", detail: "with documents I already have" },
            { need: "Explain my condition", detail: "in my own words, not medical jargon" },
            { need: "Track my progress", detail: "and come back to finish later" },
            { need: "Feel confident I've done it right", detail: "before hitting submit" },
            { need: "Know what happens next", detail: "so I'm not left wondering" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div
                style={{
                  background: "#f5f5f7",
                  borderRadius: 12,
                  padding: "16px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "baseline",
                }}
              >
                <span style={{ color: "#1d70b8", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{item.need}</span>
                  <span style={{ color: "#86868b", fontSize: 15 }}> — {item.detail}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Journey Steps ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 740, margin: "0 auto", padding: "80px 24px 0" }}>
        <FadeIn>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#00703c", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            The journey
          </p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 12px" }}>
            Step by step, pattern by pattern
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#424245", margin: "0 0 48px" }}>
            Each step in the applicant's journey uses tested design patterns.
            Here's what Sarah builds — and why each pattern matters.
          </p>
        </FadeIn>

        {JOURNEY.map((step, i) => {
          const phase = PHASE_CONFIG[step.phase];
          return (
            <FadeIn key={i} style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Timeline */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 40, paddingTop: 4 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: phase.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={phase.color}><path d={phase.icon} /></svg>
                  </div>
                  {i < JOURNEY.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 40, background: "linear-gradient(to bottom, #e5e5e5, transparent)", marginTop: 8 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: phase.color, background: phase.bg, padding: "3px 10px", borderRadius: 6 }}>
                      {step.phase}
                    </span>
                    <span style={{ fontSize: 13, color: "#86868b", fontWeight: 500 }}>Step {i + 1} of {JOURNEY.length}</span>
                  </div>

                  <h3 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: 16, lineHeight: 1.6, color: "#515154", margin: "0 0 16px" }}>
                    {step.description}
                  </p>

                  {/* Pattern cards */}
                  <div style={{ display: "grid", gap: 8 }}>
                    {step.patterns.map((pattern, j) => (
                      <a
                        key={j}
                        href={pattern.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          textDecoration: "none",
                          color: "inherit",
                          background: "#fafafa",
                          borderRadius: 12,
                          padding: "14px 18px",
                          border: "1px solid #f0f0f0",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f5f5f7";
                          e.currentTarget.style.borderColor = "#e0e0e0";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fafafa";
                          e.currentTarget.style.borderColor = "#f0f0f0";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#1d1d1f" }}>{pattern.name}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#86868b", background: "#eee", padding: "1px 8px", borderRadius: 4 }}>{pattern.type}</span>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: "#c7c7cc", flexShrink: 0 }}>
                            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.5, color: "#6e6e73", margin: 0 }}>
                          {pattern.why}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </section>

      {/* ── Scaffolding ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 0" }}>
        <FadeIn>
          <div
            style={{
              background: "#f5f5f7",
              borderRadius: 20,
              padding: "36px 32px",
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
              The scaffolding
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
              Patterns on every page
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6e6e73", margin: "0 0 20px" }}>
              These components appear on every single page of Sarah's service — the consistent frame that makes everything feel familiar.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {SCAFFOLDING_PATTERNS.map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    textDecoration: "none",
                    color: "inherit",
                    padding: "6px 0",
                    borderBottom: i < SCAFFOLDING_PATTERNS.length - 1 ? "1px solid #e8e8e8" : "none",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f", flexShrink: 0 }}>{p.name}</span>
                  <span style={{ fontSize: 14, color: "#86868b" }}>— {p.why}</span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Summary stats ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px 0" }}>
        <FadeIn>
          <div
            style={{
              background: "linear-gradient(135deg, #1a1d23 0%, #1d3557 100%)",
              borderRadius: 20,
              padding: "40px 32px",
              color: "#fff",
            }}
          >
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 24px", letterSpacing: "-0.01em" }}>
              What Sarah built
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24 }}>
              {[
                { n: JOURNEY.length, label: "steps in the journey" },
                { n: uniquePatterns.length, label: "GDS patterns used" },
                { n: SCAFFOLDING_PATTERNS.length, label: "on every page" },
                { n: 0, label: "designed from scratch" },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>{stat.n}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Get Started CTA ───────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px 100px" }}>
        <FadeIn>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#00703c", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
              Your turn
            </p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 16px" }}>
              Ready to build your own service?
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "#515154", margin: "0 auto 32px", maxWidth: 520 }}>
              Every pattern Sarah used is open source, fully documented, and tested
              with real users. Start with the Design System — it'll take you further
              than you think.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {[
                { label: "GOV.UK Design System", url: "https://design-system.service.gov.uk/", color: "#1d70b8" },
                { label: "GOV.UK Prototype Kit", url: "https://prototype-kit.service.gov.uk/", color: "#00703c" },
                { label: "Service Manual", url: "https://www.gov.uk/service-manual", color: "#4c2c92" },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "12px 24px",
                    background: link.color,
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${link.color}33`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {link.label}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h8m0 0L7.5 4.5M11 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              ))}
            </div>

            <div
              style={{
                marginTop: 40,
                padding: "24px 28px",
                background: "#f5f5f7",
                borderRadius: 16,
                textAlign: "left",
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Quick start checklist</h4>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  "Install the GOV.UK Prototype Kit to start building in the browser",
                  "Read the Service Standard — 14 criteria your service needs to meet",
                  "Start with user needs, not technology choices",
                  "Use the Design System components — don't reinvent the wheel",
                  "Test with real users early and often",
                  "Book a service assessment when you're ready to go live",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: "2px solid #d2d2d7", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 11, color: "#86868b" }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: 15, lineHeight: 1.5, color: "#515154", margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
