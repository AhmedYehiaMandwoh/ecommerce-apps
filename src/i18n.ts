import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import en from "./locale-en.json";

// Arabic is the source language: the Arabic text is the key, English comes from locale-en.json.
// The language is read synchronously at import time so module-level labels and styles are right.
// Web: switching reloads the page. Native: the choice is saved and applies after the app is restarted.
function read(): string | null {
  try {
    if (Platform.OS === "web") return (globalThis as any).localStorage?.getItem("ghiyar-lang") ?? null;
    return (SecureStore as any).getItem ? (SecureStore as any).getItem("ghiyar-lang") : null;
  } catch { return null; }
}
export const lang: "ar" | "en" = read() === "en" ? "en" : "ar";
export const isEn = lang === "en";
export const ROW: "row" | "row-reverse" = isEn ? "row" : "row-reverse";
export const ENDALIGN: "left" | "right" = isEn ? "left" : "right";
export const STARTALIGN: "left" | "right" = isEn ? "right" : "left";
export const ENDITEMS: "flex-start" | "flex-end" = isEn ? "flex-start" : "flex-end";
export const writingDirection: "ltr" | "rtl" = isEn ? "ltr" : "rtl";

export function t(key: string, ...args: any[]): string {
  let s: string = isEn ? ((en as Record<string, string>)[key] ?? key) : key;
  args.forEach((a, i) => { s = s.split("{" + i + "}").join(String(a)); });
  return s;
}

export function setLang(l: "ar" | "en") {
  try {
    if (Platform.OS === "web") { (globalThis as any).localStorage?.setItem("ghiyar-lang", l); (globalThis as any).location?.reload(); }
    else (SecureStore as any).setItem?.("ghiyar-lang", l);
  } catch {}
}

const FLIP: Record<string, string> = { "flex-row-reverse": "flex-row", "text-right": "text-left", "items-end": "items-start", "items-start": "items-end", "justify-end": "justify-start", "justify-start": "justify-end", "self-start": "self-end", "self-end": "self-start" };
// Mirror direction-bound class names for LTR. Arabic (RTL) is returned unchanged.
export function cx(c?: string): string | undefined {
  if (!isEn || !c) return c;
  const tk = c.split(/\s+/);
  // Plain flex-row content rows with justify-between were laid out for RTL (first child on the left): reverse them.
  const swapRow = tk.includes("flex-row") && !tk.some((k) => /^h-(10|12|14)$/.test(k));
  return tk.map((k) => {
    if (k === "flex-row" && swapRow) return "flex-row-reverse";
    if (FLIP[k]) return FLIP[k];
    const m = k.match(/^(ml|mr|pl|pr|left|right)-(.+)$/);
    if (m) { const o: any = { ml: "mr", mr: "ml", pl: "pr", pr: "pl", left: "right", right: "left" }; return o[m[1]] + "-" + m[2]; }
    return k;
  }).join(" ");
}

if (Platform.OS === "web" && typeof document !== "undefined") {
  document.documentElement.lang = lang;
  document.documentElement.dir = writingDirection;
  // The layouts are authored visually (explicit row-reverse for Arabic); keep flex direction LTR so Arabic matches the original and English mirrors by rule.
  const st = document.createElement("style"); st.textContent = "#root{direction:ltr}" + (lang === "ar" ? "#root input,#root textarea{direction:rtl}#root [dir=auto]{unicode-bidi:plaintext}" : ""); document.head.appendChild(st);
}
