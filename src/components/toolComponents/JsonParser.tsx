import React from "react";

type Query = {
  input?: string;
  path?: string; // dot path: a.b[0].c
  pretty?: string; // "2" | "4" | ""
};

function getQuery(): Query {
  const p = new URLSearchParams(location.search);
  return {
    input: p.get("input") || "",
    path: p.get("path") || "",
    pretty: p.get("pretty") || "2",
  };
}
function setQuery(q: Query) {
  const p = new URLSearchParams();
  if (q.input) p.set("input", q.input);
  if (q.path) p.set("path", q.path);
  if (q.pretty) p.set("pretty", q.pretty);
  history.replaceState(null, "", `${location.pathname}?${p.toString()}`);
}

function safeParse(
  json: string
): { ok: true; value: any } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(json) };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Parse error" };
  }
}

// 아주 라이트한 dot/bracket path 접근기: a.b[0]["c"]
function getByPath(obj: any, path: string) {
  if (!path) return obj;
  // 토큰 분해
  const tokens: (string | number)[] = [];
  const re = /(\w+)|\[(\d+|".+?"|'.+?')\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path))) {
    if (m[1]) tokens.push(m[1]);
    else if (m[2]) {
      const raw = m[2];
      if (/^\d+$/.test(raw)) tokens.push(Number(raw));
      else
        tokens.push(raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'"));
    }
  }
  return tokens.reduce(
    (acc, t) => (acc == null ? undefined : acc[t as any]),
    obj
  );
}

export default function JsonParser() {
  const [input, setInput] = React.useState(
    getQuery().input || '{ "hello": ["world", {"x":1}] }'
  );
  const [path, setPath] = React.useState(getQuery().path || "");
  const [pretty, setPretty] = React.useState(getQuery().pretty || "2");

  React.useEffect(() => {
    setQuery({ input, path, pretty });
  }, [input, path, pretty]);

  const parsed = React.useMemo(() => safeParse(input), [input]);
  const value = parsed.ok ? getByPath(parsed.value, path) : undefined;

  const prettyText = React.useMemo(() => {
    if (!parsed.ok) return "";
    try {
      return JSON.stringify(
        value ?? parsed.value,
        null,
        pretty ? Number(pretty) : undefined
      );
    } catch {
      return "직렬화 실패";
    }
  }, [parsed, value, pretty]);

  return (
    <div className="row" style={{ alignItems: "stretch", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700 }}>입력(JSON)</div>
            <div className="row" style={{ gap: 8 }}>
              <label className="row" style={{ gap: 6 }}>
                Pretty
                <select
                  value={pretty}
                  onChange={(e) => setPretty(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                </select>
              </label>
            </div>
          </div>
          <textarea
            aria-label="JSON 입력"
            className="input"
            style={{
              height: 260,
              fontFamily: "ui-monospace,Consolas,Menlo,monospace",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {!parsed.ok && (
            <div
              className="card"
              style={{ background: "#331111", marginTop: 8 }}
            >
              <b>에러:</b> {parsed.error}
            </div>
          )}
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700 }}>경로(JSONPath-lite)</div>
            <div className="muted">
              예: <code>a.b[0]["c"]</code>
            </div>
          </div>
          <input
            className="input"
            placeholder="a.b[0].c"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700 }}>결과</div>
            <div className="row" style={{ gap: 8 }}>
              <button
                className="btn"
                onClick={() => navigator.clipboard.writeText(prettyText)}
              >
                복사
              </button>
              <button
                className="btn"
                onClick={() => {
                  const blob = new Blob([prettyText], {
                    type: "application/json;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "result.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                다운로드
              </button>
            </div>
          </div>
          <textarea
            aria-label="결과 출력"
            className="input"
            style={{
              height: 360,
              fontFamily: "ui-monospace,Consolas,Menlo,monospace",
            }}
            readOnly
            value={prettyText}
          />
        </div>
      </div>
    </div>
  );
}
