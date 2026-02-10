import React, { useState, useEffect, useRef } from "react";

// ─── The 6 needs → patterns ─────────────────────────────────────────────────
const PATTERNS = [
  {
    need: "I need to check if someone's eligible before they spend time filling in the whole form.",
    pattern: "Radios with conditional reveal",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/radios/",
    why: "Radios make choices visible. Conditional reveals show follow-up questions only when they're relevant — so Sarah can ask 'Do you receive PIP?' and only show the reference number field if they say yes.",
    mockUI: "eligibility",
  },
  {
    need: "There are a lot of sections to complete. I need people to see the whole journey and do it in their own order.",
    pattern: "Task list pages",
    type: "Pattern",
    url: "https://design-system.service.gov.uk/patterns/task-list-pages/",
    why: "A task list breaks a long form into sections people can complete in any order. Status tags show what's done and what's left. People can leave and come back without losing progress.",
    mockUI: "tasklist",
  },
  {
    need: "I need to collect personal details — name, date of birth, address. Each one has to be simple and accessible.",
    pattern: "Date input",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/date-input/",
    why: "Three separate number fields for day, month and year. Research showed this is faster and more accessible than a date picker for dates people know from memory. The hint text shows the expected format.",
    mockUI: "date",
  },
  {
    need: "People need to upload a photo and documents. Some will be on their phone, some on a desktop.",
    pattern: "File upload",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/file-upload/",
    why: "The native file input works on every device — on phones it opens the camera directly. Inset text shows the requirements (file type, size limit, photo guidelines) so people get it right first time.",
    mockUI: "upload",
  },
  {
    need: "People will make mistakes. I need to tell them what went wrong and how to fix it — clearly.",
    pattern: "Error summary + error message",
    type: "Component",
    url: "https://design-system.service.gov.uk/components/error-summary/",
    why: "An error summary at the top of the page lists every problem with a link to each field. Each field also gets its own specific message. Screen readers announce the summary when the page loads.",
    mockUI: "error",
  },
  {
    need: "At the end, people need to know it worked. They need a reference number and to know what happens next.",
    pattern: "Confirmation page + panel",
    type: "Pattern",
    url: "https://design-system.service.gov.uk/patterns/confirmation-pages/",
    why: "A large green panel with a reference number gives people clear confirmation. Below it, 'what happens next' explains the timeline and next steps — reducing follow-up calls to the council.",
    mockUI: "confirm",
  },
];

// ─── Mock UI illustrations ───────────────────────────────────────────────────
function MockUI({ type }) {
  const frame = {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e5e5",
    padding: "18px 20px",
    fontFamily: "inherit",
    fontSize: 13,
    color: "#0b0c0e",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
  };
  const label = { fontSize: 13, fontWeight: 700, color: "#0b0c0e", marginBottom: 6 };
  const hint = { fontSize: 11, color: "#6e6e73", marginBottom: 8 };
  const input = { height: 34, borderRadius: 4, border: "2px solid #0b0c0e", background: "#fff", width: "100%" };
  const smallInput = { ...input, width: 60 };
  const radioLine = (text, checked) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${checked ? "#1d70b8" : "#0b0c0e"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {checked && <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#1d70b8" }} />}
      </div>
      <span style={{ fontSize: 13 }}>{text}</span>
    </div>
  );

  const mocks = {
    eligibility: (
      <div style={frame}>
        <div style={label}>Do you receive any of these benefits?</div>
        {radioLine("Personal Independence Payment (PIP)", true)}
        <div style={{ marginLeft: 28, background: "#f5f5f7", borderLeft: "3px solid #1d70b8", padding: "10px 12px", borderRadius: 4, marginBottom: 8, marginTop: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>What is your PIP reference number?</div>
          <div style={{ ...input, width: 200, height: 30 }} />
        </div>
        {radioLine("Disability Living Allowance (DLA)", false)}
        {radioLine("War Pensioners' Mobility Supplement", false)}
        {radioLine("None of the above", false)}
      </div>
    ),
    tasklist: (
      <div style={frame}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Apply for a Blue Badge</div>
        <div style={{ fontSize: 12, color: "#5a5a60", marginBottom: 14 }}>You have completed 1 of 4 sections.</div>
        {[
          { task: "Check eligibility", status: "Completed", color: "#00703c", bg: "#e6f3ec" },
          { task: "Personal details", status: "In progress", color: "#1d70b8", bg: "#e8f0fe" },
          { task: "Upload documents", status: "Not started", color: "#505a5f", bg: "#f0f0f0" },
          { task: "Check and submit", status: "Cannot start yet", color: "#b1b4b6", bg: "#f5f5f5" },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderTop: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: 13, color: t.status === "Cannot start yet" ? "#b1b4b6" : "#1d70b8", textDecoration: t.status === "Cannot start yet" ? "none" : "underline", fontWeight: 500 }}>{t.task}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: t.color, background: t.bg, padding: "2px 10px", borderRadius: 4 }}>{t.status}</span>
          </div>
        ))}
      </div>
    ),
    date: (
      <div style={frame}>
        <div style={label}>What is your date of birth?</div>
        <div style={hint}>For example, 27 3 1990</div>
        <div style={{ display: "flex", gap: 12 }}>
          {[{ l: "Day", w: 60 }, { l: "Month", w: 60 }, { l: "Year", w: 90 }].map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{f.l}</div>
              <div style={{ ...smallInput, width: f.w }} />
            </div>
          ))}
        </div>
      </div>
    ),
    upload: (
      <div style={frame}>
        <div style={label}>Upload a photo of yourself</div>
        <div style={{ background: "#eef4fb", borderLeft: "3px solid #1d70b8", padding: "10px 12px", borderRadius: 4, marginBottom: 12, fontSize: 12, color: "#2a5a8a", lineHeight: 1.45 }}>
          Your photo must be facing forward, with a plain background, and no sunglasses or hat.
        </div>
        <div style={hint}>JPG, PNG or PDF, 10MB max</div>
        <div style={{ border: "2px dashed #b1b4b6", borderRadius: 8, padding: "20px", textAlign: "center", color: "#505a5f", fontSize: 12 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 6px", display: "block" }}><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="#b1b4b6"/></svg>
          Choose file
        </div>
      </div>
    ),
    error: (
      <div style={frame}>
        <div style={{ background: "#fce4e0", border: "3px solid #d4351c", borderRadius: 6, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#d4351c", marginBottom: 6 }}>There is a problem</div>
          <div style={{ fontSize: 12, color: "#d4351c" }}><a href="#" style={{ color: "#d4351c" }}>Enter your date of birth</a></div>
          <div style={{ fontSize: 12, color: "#d4351c", marginTop: 2 }}><a href="#" style={{ color: "#d4351c" }}>Upload a photo</a></div>
        </div>
        <div style={label}>What is your date of birth?</div>
        <div style={{ fontSize: 12, color: "#d4351c", fontWeight: 700, marginBottom: 6 }}>Error: Enter your date of birth</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ ...smallInput, border: "3px solid #d4351c" }} />
          <div style={{ ...smallInput, border: "3px solid #d4351c" }} />
          <div style={{ ...smallInput, width: 90, border: "3px solid #d4351c" }} />
        </div>
      </div>
    ),
    confirm: (
      <div style={frame}>
        <div style={{ background: "#00703c", borderRadius: 6, padding: "24px 20px", textAlign: "center", color: "#fff", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Application complete</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Your reference number is</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.04em", marginTop: 4 }}>BB-2024-7834</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>What happens next</div>
        <div style={{ fontSize: 12, color: "#505a5f", lineHeight: 1.5 }}>
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

// ─── Connector arrow between need and pattern ────────────────────────────────
function Arrow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="#b1b4b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function BlueBadgeStory() {
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
          padding: "80px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
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
              From user need to design pattern
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              style={{
                fontSize: "clamp(32px, 5.5vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                margin: "0 0 20px",
              }}
            >
              "I need to build a Blue Badge<br />application service"
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 19px)", lineHeight: 1.6, color: "rgba(255,255,255,0.8)", margin: "0 0 0", maxWidth: 520 }}>
              Sarah is a council service officer. She described what she needed
              in plain English. The GOV.UK Design System had a pattern for every one.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── The context ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 0" }}>
        <FadeIn>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 14px" }}>
            The brief
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d3d40", margin: "0 0 20px" }}>
            A Blue Badge lets people with disabilities park closer to where they need to go.
            2.35 million people in the UK have one. Sarah's council wants to replace
            the paper application with a digital service.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d3d40", margin: "0 0 0" }}>
            She wrote down the six things the service needs to do. Each one maps
            directly to a pattern in the GOV.UK Design System.
          </p>
        </FadeIn>
      </section>

      {/* ── The 6 need → pattern pairs ────────────────────────────── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px 0" }}>
        <FadeIn>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 40 }}>
            <div style={{ height: 1, flex: 1, background: "#e5e5e5" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#5a5a60" }}>6 needs, 6 patterns</span>
            <div style={{ height: 1, flex: 1, background: "#e5e5e5" }} />
          </div>
        </FadeIn>

        {PATTERNS.map((item, i) => (
          <FadeIn key={i} style={{ marginBottom: i < PATTERNS.length - 1 ? 56 : 0 }}>
            {/* The need — Sarah's words */}
            <div
              style={{
                background: "#f8f8fa",
                borderRadius: 14,
                padding: "20px 24px",
                borderLeft: "4px solid #2a5a8a",
                marginBottom: 0,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: "#2a5a8a", marginBottom: 6, letterSpacing: "0.02em" }}>
                Sarah's need #{i + 1}
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "#1d1d1f", margin: 0, fontStyle: "italic" }}>
                "{item.need}"
              </p>
            </div>

            <Arrow />

            {/* The pattern — what the Design System gives her */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e5e5e5",
                overflow: "hidden",
              }}
            >
              {/* Pattern header */}
              <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 18, fontWeight: 700, color: "#1d70b8", textDecoration: "none" }}
                  >
                    {item.pattern}
                  </a>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5a5a60", background: "#f0f0f0", padding: "2px 8px", borderRadius: 4 }}>
                    {item.type}
                  </span>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: "#505a5f", margin: 0 }}>
                  {item.why}
                </p>
              </div>

              {/* Mock UI */}
              <div style={{ padding: "18px 22px", background: "#fafafa" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#86868b", marginBottom: 10, letterSpacing: "0.02em" }}>
                  What the user sees
                </div>
                <MockUI type={item.mockUI} />
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ── The point ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 0" }}>
        <FadeIn>
          <div
            style={{
              background: "linear-gradient(135deg, #2a5a8a 0%, #1d3557 50%, #6b5b95 100%)",
              borderRadius: 20,
              padding: "36px 32px",
              color: "#fff",
            }}
          >
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>
              The point
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.85)", margin: "0 0 24px" }}>
              Sarah described what she needed in plain sentences. Every one of them
              mapped to a pattern that already existed — researched, tested, and ready to use.
              She didn't design a single component from scratch.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { n: 6, label: "needs described" },
                { n: 6, label: "patterns matched" },
                { n: 0, label: "designed from scratch" },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>{stat.n}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px 80px" }}>
        <FadeIn>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
              Explore the Design System
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5a5a60", margin: "0 auto 28px", maxWidth: 460 }}>
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
      `}</style>
    </div>
  );
}
