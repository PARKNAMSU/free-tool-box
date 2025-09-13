import React from "react";

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}
function toSnake(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
}
function toCamel(s: string) {
  return s
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toLowerCase());
}
function toTitle(s: string) {
  return s.replace(
    /\w\S*/g,
    (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()
  );
}

export default function TextCase() {
  const [input, setInput] = React.useState("Hello world, ToolSite!");
  const out = {
    slug: toSlug(input),
    snake: toSnake(input),
    camel: toCamel(input),
    title: toTitle(input),
  };
  return (
    <div className="card">
      <textarea
        className="input"
        style={{ height: 160 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="hr"></div>
      <div className="grid">
        {Object.entries(out).map(([k, v]) => (
          <div key={k} className="card">
            <div className="muted">{k}</div>
            <div style={{ fontFamily: "ui-monospace,monospace" }}>{v}</div>
            <div className="row" style={{ marginTop: 8 }}>
              <button
                className="btn"
                onClick={() => navigator.clipboard.writeText(v)}
              >
                복사
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
