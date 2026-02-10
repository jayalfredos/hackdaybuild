import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import GDSPatternSearch from "../GDSPatternSearch.jsx";
import BlueBadgeStory from "../BlueBadgeStory.jsx";
import "./index.css";

function App() {
  const [page, setPage] = useState("story");

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

  return <BlueBadgeStory />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
