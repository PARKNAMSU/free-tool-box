import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { tools } from "../toolRegistry";
import { usePrefs } from "../store/usePrefs";
import clsx from "clsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const { theme, setTheme, recentTools } = usePrefs();
  const [query, setQuery] = React.useState("");

  const filtered = tools.filter((t) =>
    [t.name, t.description, ...(t.keywords || [])]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <Link to="/" className="logo">
            ToolSite
          </Link>
          <select
            aria-label="테마"
            value={theme}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setTheme(e.target.value as any)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="hr"></div>
        <input
          className="input"
          placeholder="툴 검색…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ marginTop: 12, fontWeight: 700 }}>Category</div>
        {["JSON", "TEXT", "FILE", "DEVELOP", "Etc"].map((cat) => (
          <div key={cat} style={{ marginTop: 8 }}>
            <div className="muted">{cat}</div>
            {filtered
              .filter((t) => t.category === cat)
              .map((t) => (
                <div key={t.id} style={{ marginTop: 6 }}>
                  <NavLink
                    to={`/tools/${t.slug}`}
                    className={({ isActive }) =>
                      clsx("row card", isActive && "active")
                    }
                    style={{ gap: 8, padding: 10 }}
                  >
                    <span aria-hidden>{t.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>{t.name}</div>
                      <div className="muted">{t.description}</div>
                    </div>
                  </NavLink>
                </div>
              ))}
          </div>
        ))}

        {recentTools.length > 0 && (
          <>
            <div className="hr"></div>
            <div className="muted">최근 사용</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
              }}
            >
              {recentTools.map((s) => {
                const t = tools.find((x) => x.slug === s);
                if (!t) return null;
                return (
                  <Link
                    key={s}
                    to={`/tools/${s}`}
                    className="card"
                    style={{ padding: "6px 10px" }}
                  >
                    {t.icon} {t.name}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </aside>

      <main className="main">
        <header className="row" style={{ justifyContent: "space-between" }}>
          <div className="muted">many tools 💡</div>
          <div className="row">
            <button className="btn" onClick={() => nav("/")}>
              홈
            </button>
          </div>
        </header>
        <div className="hr"></div>
        {children}
        <div className="hr"></div>
        <footer>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="muted">© {new Date().getFullYear()} ToolSite</div>
            <div className="row" style={{ gap: 12 }}>
              <a href="/privacy">개인정보</a>
              <a href="/terms">약관</a>
              <a href="/about">About</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
