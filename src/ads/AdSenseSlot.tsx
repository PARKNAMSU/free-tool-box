import React, { useEffect, useRef } from "react";
import { usePrefs } from "../store/usePrefs";

type Props = {
  slot: string; // 애드센스 ad-slot
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties; // 커스텀 높이 등
};

const ADS_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"; // ✅ 실제 ID로 교체

export default function AdSenseSlot({ slot, format = "auto", style }: Props) {
  const { consentAds } = usePrefs();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!consentAds || loadedRef.current || typeof window === "undefined")
      return;
    // 동적 스크립트 삽입 (한 번만)
    const existing = document.querySelector(`script[data-adsbygoogle]`);
    if (!existing) {
      const s = document.createElement("script");
      s.setAttribute("data-adsbygoogle", "true");
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    }
    loadedRef.current = true;
  }, [consentAds]);

  useEffect(() => {
    if (!consentAds) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [consentAds, slot]);

  if (!consentAds) return null;

  return (
    <ins
      className="adsbygoogle ad"
      style={{ display: "block", ...(style || {}) }}
      data-ad-client={ADS_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      aria-label="광고 영역"
    />
  );
}
