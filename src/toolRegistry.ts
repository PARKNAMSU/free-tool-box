import { lazy, type JSX } from "react";

export type ToolMeta = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string; // emoji or icon name
  category: "JSON" | "TEXT" | "FILE" | "DEVELOP" | "ETC";
  component: React.LazyExoticComponent<() => JSX.Element>;
  defaultQuery?: Record<string, string>;
  keywords?: string[];
};

export const tools: ToolMeta[] = [
  {
    id: "json-parser",
    slug: "json-parser",
    name: "JSON Parsor/Formatter!!",
    description: "JSON 유효성 검사, 포매팅, 경로 추출(JSONPath-lite)",
    icon: "🧩",
    category: "JSON",
    component: lazy(() => import("./components/toolComponents/JsonParser")),
  },
  {
    id: "text-case",
    slug: "text-case",
    name: "텍스트 변환기",
    description: "대소문자/슬러그/스네이크/카멜케이스 변환",
    icon: "🔤",
    category: "TEXT",
    component: lazy(() => import("./components/toolComponents/TextCase")),
  },
  // 새 툴은 여기에 추가 ↑
];

export const bySlug = (slug: string) => tools.find((t) => t.slug === slug);
