import React, { useState, useEffect, useRef } from "react";

// ─── Accent colours for each requirement ─────────────────────────────────────
const ACCENTS = [
  { primary: "#1d70b8", light: "#e8f0fe", mid: "#c5d9f0" },
  { primary: "#4c2c92", light: "#f0ebf8", mid: "#d5c8ed" },
  { primary: "#00703c", light: "#e6f3ec", mid: "#b8dfc8" },
  { primary: "#d4351c", light: "#fce4e0", mid: "#f0b8ae" },
  { primary: "#f47738", light: "#fef3ec", mid: "#f5d0b0" },
  { primary: "#00703c", light: "#e6f3ec", mid: "#b8dfc8" },
];

// ─── The 6 requirements → patterns ──────────────────────────────────────────
const PATTERNS = [
  {
    need: "Before anyone spends time filling things in, I need a way to check they're actually eligible.",
    pattern: "Radios with conditional reveal",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/radios/",
    why: "Radios make choices visible. Conditional reveals show follow-up questions only when they're relevant — so Sarah can ask 'Do you receive PIP?' and only show the reference number field if they say yes.",
    mockUI: "eligibility",
  },
  {
    need: "There's quite a lot to get through. I want people to see what's involved upfront and tackle it in whatever order works for them.",
    pattern: "Task list pages",
    type: "Pattern",
    url: "https://design-system.service.gov.uk/patterns/task-list-pages/",
    why: "A task list breaks a long form into sections people can complete in any order. Status tags show what's done and what's left. People can leave and come back without losing progress.",
    mockUI: "tasklist",
  },
  {
    need: "I need a way for people to add their personal details — name, date of birth, address — without it feeling overwhelming.",
    pattern: "Date input",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/date-input/",
    why: "Three separate number fields for day, month and year. Research showed this is faster and more accessible than a date picker for dates people know from memory.",
    mockUI: "date",
  },
  {
    need: "At some point they'll need to send us a photo and some documents. Lots of people will just be doing this on their phone.",
    pattern: "File upload",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/file-upload/",
    why: "The native file input works on every device — on phones it opens the camera directly. Inset text shows requirements so people get it right first time.",
    mockUI: "upload",
  },
  {
    need: "People are going to get things wrong sometimes. I need to make sure they know exactly what to fix, without making them feel stupid.",
    pattern: "Error summary + error message",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/error-summary/",
    why: "An error summary at the top of the page lists every problem with a link to each field. Each field also gets its own specific message.",
    mockUI: "error",
  },
  {
    need: "When they're done, I want them to feel confident it actually went through. Give them a reference number and tell them what happens next.",
    pattern: "Confirmation page + panel",
    type: "Pattern",
    url: "https://design-system.service.gov.uk/patterns/confirmation-pages/",
    why: "A large green panel with a reference number gives clear confirmation. 'What happens next' explains the timeline — reducing follow-up calls to the council.",
    mockUI: "confirm",
  },
];

// ─── Mock UI illustrations ───────────────────────────────────────────────────
function MockUI({ type }) {
  const frame = {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e0e0e0",
    padding: "16px 18px",
    fontFamily: "inherit",
    fontSize: 13,
    color: "#0b0c0e",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  };
  const label = { fontSize: 13, fontWeight: 700, color: "#0b0c0e", marginBottom: 6 };
  const hint = { fontSize: 11, color: "#6e6e73", marginBottom: 8 };
  const input = { height: 32, borderRadius: 4, border: "2px solid #0b0c0e", background: "#fff", width: "100%" };
  const smallInput = { ...input, width: 56 };
  const radioLine = (text, checked) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${checked ? "#1d70b8" : "#0b0c0e"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checked && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1d70b8" }} />}
      </div>
      <span style={{ fontSize: 12 }}>{text}</span>
    </div>
  );

  const mocks = {
    eligibility: (
      <div style={frame}>
        <div style={label}>Do you receive any of these benefits?</div>
        {radioLine("Personal Independence Payment (PIP)", true)}
        <div style={{ marginLeft: 26, background: "#f5f5f7", borderLeft: "3px solid #1d70b8", padding: "8px 10px", borderRadius: 4, marginBottom: 6, marginTop: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 3 }}>What is your PIP reference number?</div>
          <div style={{ ...input, width: 180, height: 28 }} />
        </div>
        {radioLine("Disability Living Allowance (DLA)", false)}
        {radioLine("War Pensioners' Mobility Supplement", false)}
        {radioLine("None of the above", false)}
      </div>
    ),
    tasklist: (
      <div style={frame}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>Apply for a Blue Badge</div>
        <div style={{ fontSize: 11, color: "#5a5a60", marginBottom: 12 }}>You have completed 1 of 4 sections.</div>
        {[
          { task: "Check eligibility", status: "Completed", color: "#00703c", bg: "#e6f3ec" },
          { task: "Personal details", status: "In progress", color: "#1d70b8", bg: "#e8f0fe" },
          { task: "Upload documents", status: "Not started", color: "#505a5f", bg: "#f0f0f0" },
          { task: "Check and submit", status: "Cannot start yet", color: "#b1b4b6", bg: "#f5f5f5" },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: 12, color: t.status === "Cannot start yet" ? "#b1b4b6" : "#1d70b8", textDecoration: t.status === "Cannot start yet" ? "none" : "underline", fontWeight: 500 }}>{t.task}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: t.color, background: t.bg, padding: "2px 8px", borderRadius: 4 }}>{t.status}</span>
          </div>
        ))}
      </div>
    ),
    date: (
      <div style={frame}>
        <div style={label}>What is your date of birth?</div>
        <div style={hint}>For example, 27 3 1990</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ l: "Day", w: 56 }, { l: "Month", w: 56 }, { l: "Year", w: 80 }].map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 3 }}>{f.l}</div>
              <div style={{ ...smallInput, width: f.w }} />
            </div>
          ))}
        </div>
      </div>
    ),
    upload: (
      <div style={frame}>
        <div style={label}>Upload a photo of yourself</div>
        <div style={{ background: "#eef4fb", borderLeft: "3px solid #1d70b8", padding: "8px 10px", borderRadius: 4, marginBottom: 10, fontSize: 11, color: "#2a5a8a", lineHeight: 1.4 }}>
          Facing forward, plain background, no sunglasses or hat.
        </div>
        <div style={hint}>JPG, PNG or PDF, 10MB max</div>
        <div style={{ border: "2px dashed #b1b4b6", borderRadius: 8, padding: "16px", textAlign: "center", color: "#505a5f", fontSize: 11 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 4px", display: "block" }}><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="#b1b4b6"/></svg>
          Choose file
        </div>
      </div>
    ),
    error: (
      <div style={frame}>
        <div style={{ background: "#fce4e0", border: "3px solid #d4351c", borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#d4351c", marginBottom: 4 }}>There is a problem</div>
          <div style={{ fontSize: 11, color: "#d4351c" }}>Enter your date of birth</div>
          <div style={{ fontSize: 11, color: "#d4351c", marginTop: 2 }}>Upload a photo</div>
        </div>
        <div style={label}>What is your date of birth?</div>
        <div style={{ fontSize: 11, color: "#d4351c", fontWeight: 700, marginBottom: 4 }}>Error: Enter your date of birth</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ ...smallInput, border: "3px solid #d4351c" }} />
          <div style={{ ...smallInput, border: "3px solid #d4351c" }} />
          <div style={{ ...smallInput, width: 80, border: "3px solid #d4351c" }} />
        </div>
      </div>
    ),
    confirm: (
      <div style={frame}>
        <div style={{ background: "#00703c", borderRadius: 6, padding: "20px 16px", textAlign: "center", color: "#fff", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Application complete</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>Your reference number is</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.04em", marginTop: 3 }}>BB-2024-7834</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>What happens next</div>
        <div style={{ fontSize: 11, color: "#505a5f", lineHeight: 1.45 }}>
          We've sent a confirmation email. Your council will review your application within 12 weeks.
        </div>
      </div>
    ),
  };

  return mocks[type] || null;
}

// ─── Fade-in on scroll ──────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function BlueBadgeStory() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafbfc",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: "#1d1d1f",
      }}
    >
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1d3557 0%, #2a5a8a 40%, #4a90c4 70%, #6bb3d9 100%)",
          color: "#fff",
          padding: "80px 32px 88px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "20%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "15%", width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
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
                color: "rgba(255,255,255,0.85)",
                marginBottom: 24,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              From requirement to design pattern
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: "0 0 20px",
                maxWidth: 700,
              }}
            >
              "I need to build a Blue Badge application service"
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, color: "rgba(255,255,255,0.8)", margin: 0, maxWidth: 560 }}>
              Sarah is a council service officer. She described what she needed
              in plain English. The GOV.UK Design System had a pattern for every one.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── The brief + stats ─────────────────────────────────────── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "56px 32px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>
          <FadeIn>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              The brief
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d3d40", margin: "0 0 16px" }}>
              A Blue Badge lets people with disabilities park closer to where they need to go.
              2.35 million people in the UK have one. Sarah's council wants to replace
              the paper application with a digital service.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d3d40", margin: 0 }}>
              She wrote down the six things the service needs to do. Each one maps
              directly to a pattern in the GOV.UK Design System.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { figure: "2.35m", label: "badge holders in the UK", accent: ACCENTS[0] },
                { figure: "152", label: "councils issue them", accent: ACCENTS[1] },
                { figure: "3 yrs", label: "standard badge duration", accent: ACCENTS[2] },
              ].map((card, i) => (
                <div key={i} style={{ background: card.accent.light, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: card.accent.primary, minWidth: 70 }}>{card.figure}</div>
                  <div style={{ fontSize: 14, color: "#3d3d40" }}>{card.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px 0" }}>
        <FadeIn>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, #d0d5dd, transparent)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#5a5a60", whiteSpace: "nowrap" }}>6 requirements, 6 patterns</span>
            <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, #d0d5dd, transparent)" }} />
          </div>
        </FadeIn>
      </section>

      {/* ── The 6 requirement → pattern pairs ─────────────────────── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px 0" }}>
        {PATTERNS.map((item, i) => {
          const accent = ACCENTS[i];
          const isEven = i % 2 === 0;

          return (
            <FadeIn key={i} style={{ marginBottom: 48 }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: isEven ? "380px 1fr" : "1fr 380px",
                gap: 0,
                background: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid #e5e5e5",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                {/* Requirement side */}
                <div style={{
                  background: accent.light,
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  order: isEven ? 0 : 1,
                  borderRight: isEven ? `3px solid ${accent.mid}` : "none",
                  borderLeft: isEven ? "none" : `3px solid ${accent.mid}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: accent.primary,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: accent.primary, letterSpacing: "0.02em" }}>Sarah's requirement</span>
                  </div>
                  <p style={{ fontSize: 18, lineHeight: 1.55, color: "#1d1d1f", margin: 0, fontStyle: "italic" }}>
                    "{item.need}"
                  </p>
                </div>

                {/* Pattern side */}
                <div style={{
                  padding: "28px 28px",
                  display: "flex",
                  flexDirection: "column",
                  order: isEven ? 1 : 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 17, fontWeight: 700, color: accent.primary, textDecoration: "none" }}
                    >
                      {item.pattern}
                    </a>
                    <span style={{ fontSize: 10, fontWeight: 700, color: accent.primary, background: accent.light, padding: "2px 8px", borderRadius: 4 }}>
                      {item.type}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "#505a5f", margin: "0 0 16px" }}>
                    {item.why}
                  </p>
                  <div style={{ background: "#f8f9fa", borderRadius: 10, padding: "14px", flex: 1 }}>
                    <MockUI type={item.mockUI} />
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </section>

      {/* ── What Sarah created ─────────────────────────────────────── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "32px 32px 0" }}>
        <FadeIn>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 14px" }}>
            What Sarah created
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d3d40", margin: "0 0 28px" }}>
            Sarah described her requirements in plain English. Each one mapped directly
            to a pattern in the GOV.UK Design System — researched, tested, and ready to use.
          </p>
        </FadeIn>

        {/* Summary table */}
        <FadeIn>
          <div style={{ borderRadius: 16, border: "1px solid #e5e5e5", overflow: "hidden", marginBottom: 28, background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr auto 1fr", padding: "12px 24px", background: "#f4f5f7", borderBottom: "1px solid #e5e5e5", fontSize: 12, fontWeight: 700, color: "#5a5a60" }}>
              <span></span>
              <span>Her requirement</span>
              <span style={{ padding: "0 12px" }}></span>
              <span>The pattern</span>
            </div>
            {PATTERNS.map((item, i) => {
              const accent = ACCENTS[i];
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto 1fr", padding: "14px 24px", borderBottom: i < PATTERNS.length - 1 ? "1px solid #f0f0f0" : "none", alignItems: "center" }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: accent.light,
                    color: accent.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: "#3d3d40", lineHeight: 1.4 }}>
                    {item.need.replace(/^I need to |^People need to |^People will |^There are |^At the end, people need to /i, "").replace(/\.$/, "")}
                  </span>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ margin: "0 12px" }}><path d="M3 8h8m0 0L7.5 4.5M11 8l-3.5 3.5" stroke={accent.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: accent.primary, textDecoration: "none" }}>{item.pattern}</a>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[
              { n: 6, label: "requirements", accent: ACCENTS[0] },
              { n: 6, label: "patterns matched", accent: ACCENTS[1] },
              { n: 0, label: "designed from scratch", accent: ACCENTS[2] },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "linear-gradient(135deg, " + stat.accent.primary + " 0%, " + stat.accent.primary + "cc 100%)",
                borderRadius: 14,
                padding: "24px 20px",
                textAlign: "center",
                color: "#fff",
              }}>
                <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>{stat.n}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Scaffolding ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px 0" }}>
        <FadeIn>
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", border: "1px solid #e5e5e5" }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              Also on every page
            </div>
            <div style={{ fontSize: 14, color: "#5a5a60", marginBottom: 14 }}>
              These components provide the consistent frame around Sarah's service:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { name: "Header", url: "https://design-system.service.gov.uk/components/header/" },
                { name: "Footer", url: "https://design-system.service.gov.uk/components/footer/" },
                { name: "Phase banner", url: "https://design-system.service.gov.uk/components/phase-banner/" },
                { name: "Back link", url: "https://design-system.service.gov.uk/components/back-link/" },
                { name: "Skip link", url: "https://design-system.service.gov.uk/components/skip-link/" },
                { name: "Notification banner", url: "https://design-system.service.gov.uk/components/notification-banner/" },
              ].map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1d70b8",
                    background: "#eef4fb",
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid #d6e6f7",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#d6e6f7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#eef4fb"; }}
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "56px 32px 80px" }}>
        <FadeIn>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
              Explore the Design System
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5a5a60", margin: "0 auto 28px", maxWidth: 500 }}>
              Every pattern is open source, documented, and tested with real users.
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
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: 380px"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: 1fr 380px"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: 1fr 320px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
