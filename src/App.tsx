import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import { bySlug, tools } from "./toolRegistry";
import { usePrefs } from "./store/usePrefs";
import ConsentBanner from "./components/ConsentBanner";
import AdSenseSlot from "./ads/AdSenseSlot";
import { TITLES } from "./constant/text";

function Home() {
  return (
    <>
      <title>{TITLES.HOME}</title>
      <meta name="description" content="페이지 설명" />
      <div className="grid">
        {tools.map((t) => (
          <a
            className="card"
            key={t.id}
            href={`/tools/${t.slug}`}
            style={{ display: "block" }}
          >
            <div className="row" style={{ gap: 8 }}>
              <span style={{ fontSize: 24 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 800 }}>{t.name}</div>
                <div className="muted">{t.description}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
      <AdSenseSlot slot="0000000001" style={{ minHeight: 120 }} />
    </>
  );
}

function ToolPage() {
  const { slug = "" } = useParams();
  const meta = bySlug(slug);
  const { pushRecent } = usePrefs();
  useEffect(() => {
    if (meta) pushRecent(meta.slug);
  }, [meta, pushRecent]);

  if (!meta) return <div className="card">존재하지 않는 툴입니다.</div>;
  const C = meta.component;

  return (
    <>
      <title>{TITLES.HOME}</title>
      <meta name="description" content={meta.description} />
      <h1 style={{ marginTop: 0 }}>
        {meta.icon} {meta.name}
      </h1>
      <div className="muted" style={{ marginBottom: 12 }}>
        {meta.description}
      </div>
      <Suspense fallback={<div className="card">로딩 중…</div>}>
        <C />
      </Suspense>
      <AdSenseSlot slot="0000000002" style={{ minHeight: 120 }} />
    </>
  );
}

export default function App() {
  const { theme } = usePrefs();
  const loc = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    // 시스템 테마 따라가기는 CSS로 간단히 처리 (여기선 생략)
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="*" element={<div className="card">404 Not Found</div>} />
      </Routes>
      <ConsentBanner />
    </Layout>
  );
}
