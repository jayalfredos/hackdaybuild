import React, { useState, useEffect, useRef } from "react";

// ─── Journey steps with GDS pattern mapping ─────────────────────────────────
const JOURNEY = [
  {
    phase: "Understand",
    title: "Who are you applying for?",
    description: "Is it the person themselves, a carer, or an organisation? One question, one page.",
    mockUI: "radio",
    patterns: [
      { name: "Question pages", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/question-pages/", why: "One thing per page reduces cognitive load." },
      { name: "Radios", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/radios/", why: "Mutually exclusive options — visible and tappable." },
    ],
  },
  {
    phase: "Understand",
    title: "Check eligibility",
    description: "Before collecting details, check if the applicant qualifies — saving time for everyone.",
    mockUI: "eligibility",
    patterns: [
      { name: "Radios", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/radios/", why: "Conditional reveals show follow-ups only when relevant." },
      { name: "Details", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/details/", why: "Expandable help without cluttering the page." },
      { name: "Inset text", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/inset-text/", why: "Highlights important information like eligibility status." },
    ],
  },
  {
    phase: "Organise",
    title: "Show the full journey",
    description: "A task list breaks everything into manageable chunks users can complete in any order.",
    mockUI: "tasklist",
    patterns: [
      { name: "Task list", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/task-list-pages/", why: "See all sections at a glance, complete in any order." },
      { name: "Tag", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/tag/", why: "Colour-coded status labels show what's done." },
    ],
  },
  {
    phase: "Collect",
    title: "Collect their name",
    description: "Blue Badges are legal documents, so separate fields for first name and surname.",
    mockUI: "name",
    patterns: [
      { name: "Ask users for names", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/names/", why: "Separate fields when the service needs name parts independently." },
      { name: "Text input", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/text-input/", why: "Width matches expected input length." },
    ],
  },
  {
    phase: "Collect",
    title: "Date of birth",
    description: "Three fields for day, month and year — because date pickers are terrible for memorable dates.",
    mockUI: "date",
    patterns: [
      { name: "Date input", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/date-input/", why: "Three numeric inputs are faster and more accessible than calendar pickers." },
    ],
  },
  {
    phase: "Collect",
    title: "Get their address",
    description: "Postcode lookup makes this fast, with a manual fallback for addresses the lookup can't find.",
    mockUI: "address",
    patterns: [
      { name: "Addresses", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/addresses/", why: "Postcode lookup reduces errors; manual fallback ensures nobody gets stuck." },
    ],
  },
  {
    phase: "Collect",
    title: "Understand their mobility",
    description: "Sensitive questions need to be clear without being clinical or intrusive.",
    mockUI: "mobility",
    patterns: [
      { name: "Textarea", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/textarea/", why: "Open text lets people describe their condition in their own words." },
      { name: "Character count", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/character-count/", why: "Shows remaining space as people type." },
      { name: "Checkboxes", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/checkboxes/", why: "Select all that apply — people often use multiple mobility aids." },
    ],
  },
  {
    phase: "Evidence",
    title: "Upload photo & documents",
    description: "Photo, ID, proof of address, and possibly medical evidence — with clear requirements for each.",
    mockUI: "upload",
    patterns: [
      { name: "File upload", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/file-upload/", why: "Works on every device, including phone cameras." },
      { name: "Inset text", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/inset-text/", why: "Photo requirements displayed prominently to avoid rejections." },
    ],
  },
  {
    phase: "Protect",
    title: "Handle errors gracefully",
    description: "Catch mistakes clearly and help people fix them without frustration.",
    mockUI: "error",
    patterns: [
      { name: "Error summary", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/error-summary/", why: "Lists every error at page top with links to each field." },
      { name: "Error message", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/error-message/", why: "Specific message per field — not generic 'invalid input'." },
    ],
  },
  {
    phase: "Confirm",
    title: "Check their answers",
    description: "Everything they've entered in one place, with the ability to change any answer.",
    mockUI: "check",
    patterns: [
      { name: "Check answers", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/check-answers/", why: "Catches errors that inline validation misses." },
      { name: "Summary list", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/summary-list/", why: "Key-value pairs with 'Change' links for quick fixes." },
    ],
  },
  {
    phase: "Confirm",
    title: "Application complete",
    description: "A big green panel with a reference number. Done.",
    mockUI: "confirm",
    patterns: [
      { name: "Confirmation pages", system: "GOV.UK", type: "Pattern", url: "https://design-system.service.gov.uk/patterns/confirmation-pages/", why: "Reference number and 'what happens next' reduce follow-up calls." },
      { name: "Panel", system: "GOV.UK", type: "Component", url: "https://design-system.service.gov.uk/components/panel/", why: "Unmistakable confirmation — users instantly know they're done." },
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
  { name: "Header", url: "https://design-system.service.gov.uk/components/header/" },
  { name: "Footer", url: "https://design-system.service.gov.uk/components/footer/" },
  { name: "Phase banner", url: "https://design-system.service.gov.uk/components/phase-banner/" },
  { name: "Back link", url: "https://design-system.service.gov.uk/components/back-link/" },
  { name: "Skip link", url: "https://design-system.service.gov.uk/components/skip-link/" },
  { name: "Notification banner", url: "https://design-system.service.gov.uk/components/notification-banner/" },
];

// ─── Mock UI illustrations ───────────────────────────────────────────────────
function MockUI({ type }) {
  const frame = {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e5e5",
    padding: "16px 18px",
    marginBottom: 16,
    fontFamily: "inherit",
    fontSize: 13,
    color: "#0b0c0e",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    overflow: "hidden",
  };
  const label = { fontSize: 12, fontWeight: 700, color: "#0b0c0e", marginBottom: 6 };
  const hint = { fontSize: 11, color: "#6e6e73", marginBottom: 8 };
  const input = { height: 32, borderRadius: 4, border: "2px solid #0b0c0e", background: "#fff", width: "100%" };
  const smallInput = { ...input, width: 56 };
  const radioLine = (text, checked) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${checked ? "#1d70b8" : "#0b0c0e"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1d70b8" }} />}
      </div>
      <span style={{ fontSize: 12 }}>{text}</span>
    </div>
  );

  const mocks = {
    radio: (
      <div style={frame}>
        <div style={label}>Who are you applying for?</div>
        {radioLine("Myself", true)}
        {radioLine("Someone else", false)}
        {radioLine("An organisation", false)}
      </div>
    ),
    eligibility: (
      <div style={frame}>
        <div style={label}>Do you receive any of these benefits?</div>
        {radioLine("Personal Independence Payment (PIP)", true)}
        {radioLine("Disability Living Allowance (DLA)", false)}
        {radioLine("None of the above", false)}
        <div style={{ background: "#e8f0fe", borderLeft: "3px solid #1d70b8", padding: "8px 10px", borderRadius: 4, marginTop: 8, fontSize: 11, color: "#1d70b8", fontWeight: 500 }}>
          You may be automatically eligible
        </div>
      </div>
    ),
    tasklist: (
      <div style={frame}>
        <div style={{ ...label, marginBottom: 12 }}>Apply for a Blue Badge</div>
        {[
          { task: "Check eligibility", status: "Completed", color: "#00703c", bg: "#e6f3ec" },
          { task: "Personal details", status: "In progress", color: "#1d70b8", bg: "#e8f0fe" },
          { task: "Upload documents", status: "Not started", color: "#86868b", bg: "#f0f0f0" },
          { task: "Check and submit", status: "Cannot start", color: "#b1b4b6", bg: "#f5f5f5" },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
            <span style={{ fontSize: 12, color: t.status === "Cannot start" ? "#b1b4b6" : "#1d70b8", textDecoration: t.status === "Cannot start" ? "none" : "underline" }}>{t.task}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: t.color, background: t.bg, padding: "2px 8px", borderRadius: 4 }}>{t.status}</span>
          </div>
        ))}
      </div>
    ),
    name: (
      <div style={frame}>
        <div style={label}>First name</div>
        <div style={{ ...input, marginBottom: 10, position: "relative" }}>
          <span style={{ position: "absolute", top: 6, left: 8, fontSize: 13, color: "#0b0c0e" }}>Sarah</span>
        </div>
        <div style={label}>Last name</div>
        <div style={input} />
      </div>
    ),
    date: (
      <div style={frame}>
        <div style={label}>Date of birth</div>
        <div style={hint}>For example, 27 3 1990</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 3 }}>Day</div>
            <div style={smallInput} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 3 }}>Month</div>
            <div style={smallInput} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 3 }}>Year</div>
            <div style={{ ...smallInput, width: 80 }} />
          </div>
        </div>
      </div>
    ),
    address: (
      <div style={frame}>
        <div style={label}>Postcode</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ ...input, width: 120 }} />
          <div style={{ background: "#00703c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 4, whiteSpace: "nowrap" }}>Find address</div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: "#1d70b8", textDecoration: "underline", cursor: "pointer" }}>Enter address manually</div>
      </div>
    ),
    mobility: (
      <div style={frame}>
        <div style={label}>How does your condition affect you?</div>
        <div style={hint}>Describe in your own words</div>
        <div style={{ ...input, height: 56, marginBottom: 4 }} />
        <div style={{ fontSize: 10, color: "#86868b", textAlign: "right" }}>You have 2,000 characters remaining</div>
      </div>
    ),
    upload: (
      <div style={frame}>
        <div style={label}>Upload your photo</div>
        <div style={hint}>JPG, PNG or PDF, 10MB max</div>
        <div style={{ border: "2px dashed #d2d2d7", borderRadius: 8, padding: "14px", textAlign: "center", color: "#86868b", fontSize: 11 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 4px", display: "block" }}><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="#d2d2d7"/></svg>
          Choose file or drag here
        </div>
      </div>
    ),
    error: (
      <div style={frame}>
        <div style={{ background: "#fce4e0", border: "2px solid #d4351c", borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#d4351c", marginBottom: 4 }}>There is a problem</div>
          <div style={{ fontSize: 11, color: "#d4351c", textDecoration: "underline" }}>Enter your date of birth</div>
        </div>
        <div style={label}>Date of birth</div>
        <div style={{ fontSize: 11, color: "#d4351c", fontWeight: 700, marginBottom: 4 }}>Error: Enter your date of birth</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ ...smallInput, border: "2px solid #d4351c" }} />
          <div style={{ ...smallInput, border: "2px solid #d4351c" }} />
          <div style={{ ...smallInput, width: 80, border: "2px solid #d4351c" }} />
        </div>
      </div>
    ),
    check: (
      <div style={frame}>
        <div style={{ ...label, marginBottom: 10 }}>Check your answers</div>
        {[
          { k: "Name", v: "Sarah Johnson" },
          { k: "Date of birth", v: "27 March 1990" },
          { k: "Address", v: "10 Downing St, London" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#86868b", width: 90 }}>{row.k}</span>
            <span style={{ fontSize: 11, flex: 1 }}>{row.v}</span>
            <span style={{ fontSize: 11, color: "#1d70b8", textDecoration: "underline" }}>Change</span>
          </div>
        ))}
      </div>
    ),
    confirm: (
      <div style={frame}>
        <div style={{ background: "#00703c", borderRadius: 6, padding: "20px 16px", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Application complete</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>Your reference number is</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", marginTop: 4 }}>BB-2024-7834</div>
        </div>
      </div>
    ),
  };

  return mocks[type] || null;
}

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
          background: "linear-gradient(165deg, #1d3557 0%, #2a5a8a 50%, #4a90c4 100%)",
          color: "#fff",
          padding: "80px 24px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 28,
                border: "1px solid rgba(255,255,255,0.15)",
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
                lineHeight: 1.12,
                margin: "0 0 20px",
              }}
            >
              How do you build a service<br />that really helps people?
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(17px, 2.5vw, 20px)", lineHeight: 1.55, color: "rgba(255,255,255,0.8)", margin: "0 0 40px", maxWidth: 560 }}>
              Follow along as we build an 'Apply for a Blue Badge' service
              using the GOV.UK Design System — no reinventing the wheel.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{ display: "flex", gap: 32 }}>
              <div ref={stepRef}>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{stepCount}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>steps</div>
              </div>
              <div ref={patternRef}>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{patternCount}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>patterns used</div>
              </div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>0</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>from scratch</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── The Brief — warm and personal ─────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px 0" }}>
        <FadeIn>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 320px" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#2a5a8a", letterSpacing: "0.03em", margin: "0 0 10px" }}>
                First, the people
              </p>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 16px" }}>
                Meet Sarah
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d3d40", margin: "0 0 16px" }}>
                Sarah works at a local council. She's been asked to build something that makes
                a real difference — a way for people to apply for a Blue Badge online, instead of
                filling in paper forms and posting them off. The good news? She doesn't have to
                figure it all out alone.
              </p>
            </div>
            <div
              style={{
                flex: "0 0 auto",
                width: 200,
                background: "linear-gradient(135deg, #eef4fb 0%, #f7f3ff 100%)",
                borderRadius: 16,
                padding: "20px",
                borderLeft: "4px solid #2a5a8a",
              }}
            >
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "#1d1d1f", margin: 0, fontStyle: "italic" }}>
                "I want to help people park closer to where they need to go — without the hassle."
              </p>
              <p style={{ fontSize: 13, color: "#7a7a80", margin: "10px 0 0", fontWeight: 500 }}>
                — Sarah
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── The Service Story ─────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 0" }}>
        <FadeIn>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#6b5b95", letterSpacing: "0.03em", margin: "0 0 10px" }}>
            The story so far
          </p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 20px" }}>
            What's a Blue Badge, anyway?
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d3d40", margin: "0 0 24px" }}>
            If you or someone you care for has a disability or health condition, a Blue Badge
            means you can park closer to where you need to be. It's a small thing that makes
            a huge difference to millions of people's daily lives.
          </p>
        </FadeIn>

        {/* Service context cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 32 }}>
          {[
            { figure: "2.35m", label: "people rely on one", color: "#2a5a8a", bg: "#eef4fb" },
            { figure: "152", label: "councils issue them", color: "#6b5b95", bg: "#f3f0fa" },
            { figure: "3 yrs", label: "before you renew", color: "#2e7d4f", bg: "#eaf5ee" },
          ].map((card, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ background: card.bg, borderRadius: 16, padding: "22px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: card.color, letterSpacing: "-0.02em" }}>{card.figure}</div>
                <div style={{ fontSize: 13, color: "#5a5a60", marginTop: 4, fontWeight: 500 }}>{card.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* The old way vs new way */}
        <FadeIn>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 32,
          }}>
            <div style={{
              background: "#faf5f5",
              borderRadius: 16,
              padding: "22px 22px",
              borderTop: "3px solid #c9a0a0",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#8a5a5a", marginBottom: 10 }}>The old way</div>
              <div style={{ display: "grid", gap: 6 }}>
                {["Paper forms", "Post or visit in person", "Weeks of waiting", "No progress updates"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#6a5555" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a0a0"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              background: "#f0f7f2",
              borderRadius: 16,
              padding: "22px 22px",
              borderTop: "3px solid #2e7d4f",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#2e7d4f", marginBottom: 10 }}>What Sarah's building</div>
              <div style={{ display: "grid", gap: 6 }}>
                {["Do it on any device", "Save and come back", "Clear, step-by-step", "Know where you stand"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#3a6b4a" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#2e7d4f"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Who it's for */}
        <FadeIn>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>It's not just one type of person</h3>
          <p style={{ fontSize: 15, color: "#5a5a60", margin: "0 0 16px", lineHeight: 1.5 }}>
            The service needs to work for everyone who might apply:
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 32 }}>
          {[
            { icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", label: "Someone applying for themselves", bg: "#eef4fb", iconBg: "#d6e6f7", iconFill: "#2a5a8a" },
            { icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", label: "A carer or family member helping out", bg: "#f3f0fa", iconBg: "#e2daf0", iconFill: "#6b5b95" },
            { icon: "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z", label: "A charity or care home", bg: "#eaf5ee", iconBg: "#cde8d5", iconFill: "#2e7d4f" },
          ].map((user, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ background: user.bg, borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: user.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={user.iconFill}><path d={user.icon} /></svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2a2a2e", lineHeight: 1.4 }}>{user.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* How she'll do it */}
        <FadeIn>
          <div style={{
            background: "linear-gradient(135deg, #eef4fb 0%, #f3f0fa 100%)",
            borderRadius: 16,
            padding: "24px 28px",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px", color: "#2a2a2e" }}>How she'll do it</h3>
            <p style={{ fontSize: 15, color: "#5a5a60", margin: "0 0 14px", lineHeight: 1.5 }}>
              Sarah's secret weapon is the GOV.UK Design System — a library of patterns and components
              that have already been tested with real people. Here's her plan:
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { step: "Start with what people actually need", icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
                { step: "Use tested patterns, not custom code", icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9h-2v2H9v-2H7v-2h2V7h2v2h2v2zm-2-8.5L16.5 8H11V3.5z" },
                { step: "Keep each step simple — one thing per page", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" },
                { step: "Test early, learn, and keep improving", icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#2a5a8a"><path d={item.icon} /></svg>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "#2a2a2e" }}>{item.step}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── User Needs — conversational ─────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 0" }}>
        <FadeIn>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
            What do people actually need?
          </h2>
          <p style={{ fontSize: 15, color: "#5a5a60", margin: "0 0 20px", lineHeight: 1.5 }}>
            Sarah talked to real applicants. Here's what matters most to them:
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {[
            { icon: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z", need: "Know if I'm eligible", bg: "#eef4fb", fill: "#2a5a8a" },
            { icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z", need: "Prove who I am", bg: "#f3f0fa", fill: "#6b5b95" },
            { icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z", need: "Explain my condition", bg: "#fdf2e9", fill: "#b8733a" },
            { icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z", need: "Track my progress", bg: "#eaf5ee", fill: "#2e7d4f" },
            { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", need: "Feel confident it's right", bg: "#eef4fb", fill: "#2a5a8a" },
            { icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z", need: "Know what happens next", bg: "#f3f0fa", fill: "#6b5b95" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div
                style={{
                  background: item.bg,
                  borderRadius: 14,
                  padding: "18px 16px",
                  textAlign: "center",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill={item.fill} style={{ marginBottom: 8 }}><path d={item.icon} /></svg>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#2a2a2e" }}>{item.need}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Journey intro ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 740, margin: "0 auto", padding: "60px 24px 0" }}>
        <FadeIn>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {Object.entries(PHASE_CONFIG).map(([name, cfg]) => (
              <span key={name} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.02em", color: cfg.color, background: cfg.bg, padding: "4px 12px", borderRadius: 8 }}>
                {name}
              </span>
            ))}
          </div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 8px" }}>
            Now let's build it together
          </h2>
          <p style={{ fontSize: 15, color: "#5a5a60", margin: "0 0 40px", lineHeight: 1.5 }}>
            Each step shows what the applicant sees — and which design patterns make it work.
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
                    <span style={{ fontSize: 13, color: "#86868b", fontWeight: 500 }}>Step {i + 1}</span>
                  </div>

                  <h3 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: 15, lineHeight: 1.5, color: "#515154", margin: "0 0 14px" }}>
                    {step.description}
                  </p>

                  {/* Mock UI illustration */}
                  <MockUI type={step.mockUI} />

                  {/* Pattern pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {step.patterns.map((pattern, j) => (
                      <a
                        key={j}
                        href={pattern.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={pattern.why}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          textDecoration: "none",
                          color: "#1d1d1f",
                          background: "#fafafa",
                          borderRadius: 8,
                          padding: "6px 12px",
                          border: "1px solid #f0f0f0",
                          fontSize: 13,
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f0f0f5";
                          e.currentTarget.style.borderColor = "#d0d0d0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fafafa";
                          e.currentTarget.style.borderColor = "#f0f0f0";
                        }}
                      >
                        {pattern.name}
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", background: "#eee", padding: "1px 6px", borderRadius: 4 }}>{pattern.type}</span>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: "#c7c7cc" }}>
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </section>

      {/* ── Scaffolding — compact pills ────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 0" }}>
        <FadeIn>
          <div
            style={{
              background: "linear-gradient(135deg, #eef4fb 0%, #f3f0fa 100%)",
              borderRadius: 20,
              padding: "28px 28px",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
              The bits that tie it all together
            </h3>
            <p style={{ fontSize: 14, color: "#5a5a60", margin: "0 0 14px" }}>
              These components appear on every single page, keeping things familiar:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SCAFFOLDING_PATTERNS.map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1d1d1f",
                    background: "#fff",
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid #e5e5e5",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#e8f0fe"; e.currentTarget.style.borderColor = "#1d70b8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e5e5"; }}
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Summary stats ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 0" }}>
        <FadeIn>
          <div
            style={{
              background: "linear-gradient(135deg, #2a5a8a 0%, #1d3557 50%, #6b5b95 100%)",
              borderRadius: 20,
              padding: "36px 32px",
              color: "#fff",
            }}
          >
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 20px" }}>
              And that's it — here's what Sarah built
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 20 }}>
              {[
                { n: JOURNEY.length, label: "journey steps" },
                { n: uniquePatterns.length, label: "GDS patterns" },
                { n: SCAFFOLDING_PATTERNS.length, label: "on every page" },
                { n: 0, label: "from scratch" },
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
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 80px" }}>
        <FadeIn>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 12px" }}>
              Fancy building something like this?
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5a5a60", margin: "0 auto 28px", maxWidth: 460 }}>
              Everything Sarah used is free, open source, and documented.
              You can start right now — here's where to begin:
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {[
                { label: "GOV.UK Design System", url: "https://design-system.service.gov.uk/", color: "#1d70b8" },
                { label: "Prototype Kit", url: "https://prototype-kit.service.gov.uk/", color: "#00703c" },
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
