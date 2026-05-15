"use client";

import { useState } from "react";
import { AREA_ORDER, articles } from "@/lib/articles";

// Produces a scores string with the given area at score 2, rest at 7
function presetScores(area) {
  return AREA_ORDER.map((a) => (a === area ? 2 : 7)).join(",");
}

export default function DevPanel() {
  const [open, setOpen] = useState(false);

  const goResults = (area) => {
    window.location.href = `/results?scores=${presetScores(area)}`;
  };

  const goArticle = (area, slug) => {
    window.location.href = `/${area}/${slug}`;
  };

  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}>
      {open && (
        <div style={{
          position: "absolute",
          bottom: 36,
          right: 0,
          width: 300,
          maxHeight: "75vh",
          overflowY: "auto",
          background: "#18181b",
          border: "1px solid #3f3f46",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          padding: "8px 0",
        }}>
          {/* Results presets */}
          <p style={{ fontSize: 10, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 16px 4px", fontFamily: "monospace" }}>
            Simulate results — low score
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "4px 12px 10px" }}>
            {AREA_ORDER.map((area) => (
              <button
                key={area}
                onClick={() => goResults(area)}
                style={{
                  fontSize: 11,
                  background: "#3f3f46",
                  color: "#e4e4e7",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                {articles[area].label}
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: "#3f3f46", margin: "4px 12px 8px" }} />

          {/* Direct article jump */}
          <p style={{ fontSize: 10, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 16px 4px", fontFamily: "monospace" }}>
            Jump to article
          </p>
          {AREA_ORDER.map((area) => (
            <div key={area} style={{ padding: "2px 12px" }}>
              <p style={{ fontSize: 11, color: "#d4d4d8", fontWeight: 600, padding: "4px 4px 2px" }}>
                {articles[area].label}
              </p>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["low-score", "high-score", "what-is"].map((slug) => (
                  <button
                    key={slug}
                    onClick={() => goArticle(area, slug)}
                    style={{
                      fontSize: 11,
                      background: "#27272a",
                      color: "#e4e4e7",
                      border: "1px solid #3f3f46",
                      borderRadius: 6,
                      padding: "3px 8px",
                      cursor: "pointer",
                    }}
                  >
                    {slug}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          fontSize: 11,
          background: "#27272a",
          color: "#a1a1aa",
          border: "1px solid #3f3f46",
          borderRadius: 999,
          padding: "4px 12px",
          cursor: "pointer",
        }}
      >
        dev
      </button>
    </div>
  );
}
