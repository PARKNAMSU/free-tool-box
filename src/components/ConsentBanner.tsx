import React from "react";
import { usePrefs } from "../store/usePrefs";
import clsx from "clsx";

export default function ConsentBanner() {
  const { consentAds, setConsentAds } = usePrefs();
  const [open, setOpen] = React.useState(!consentAds);

  if (!open) return null;

  return (
    <div
      className={clsx("card")}
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        maxWidth: 420,
        zIndex: 50,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>쿠키 & 광고 동의</div>
      <div className="muted">
        사이트 개선과 무료 서비스 유지를 위해 광고가 표시될 수 있습니다. 동의 시
        광고 스크립트가 로드됩니다.
      </div>
      <div
        className="row"
        style={{ justifyContent: "flex-end", marginTop: 12 }}
      >
        <button
          className="btn"
          onClick={() => {
            setConsentAds(true);
            setOpen(false);
          }}
        >
          동의
        </button>
        <button
          className="btn"
          style={{ background: "#3a3a3d" }}
          onClick={() => setOpen(false)}
        >
          나중에
        </button>
      </div>
    </div>
  );
}
