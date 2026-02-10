import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import GDSPatternSearch from "../GDSPatternSearch.jsx";
import BlueBadgeStory from "../BlueBadgeStory.jsx";
import "./index.css";

function App() {
  const [page, setPage] = useState("search");

  const navStyle = (active) => ({
    padding: "8px 18px",
    borderRadius: 100,
    border: "none",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    background: active ? "#1d1d1f" : "transparent",
    color: active ? "#fff" : "#86868b",
    transition: "all 0.2s ease",
  });

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          gap: 4,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 100,
          padding: 4,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <button onClick={() => setPage("search")} style={navStyle(page === "search")}>
          Pattern Search
        </button>
        <button onClick={() => setPage("story")} style={navStyle(page === "story")}>
          Blue Badge Story
        </button>
      </nav>
      <div style={{ paddingTop: 56 }}>
        {page === "search" ? <GDSPatternSearch /> : <BlueBadgeStory />}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
