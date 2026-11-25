import React from "react";
import { Platform, StyleSheet, Text, TextInput } from "react-native";
import * as Font from "expo-font";

// Native (iOS/Android): register Cairo (SIL OFL) and apply it to every Text and TextInput.
// React Native does not synthesise weights for custom families, so bold maps to the bold file.
// Not verified on a device in this audit; web uses src/webfont.ts.
const FAM: [number, string, any][] = [
  [400, "GhiyarCairo-400", require("../assets/fonts/Cairo-Regular.ttf")], [600, "GhiyarCairo-600", require("../assets/fonts/Cairo-SemiBold.ttf")], [700, "GhiyarCairo-700", require("../assets/fonts/Cairo-Bold.ttf")],
  [800, "GhiyarCairo-800", require("../assets/fonts/Cairo-ExtraBold.ttf")], [900, "GhiyarCairo-900", require("../assets/fonts/Cairo-Black.ttf")],
];

export async function loadNativeFont() {
  if (Platform.OS === "web") return;
  try {
    await Font.loadAsync(Object.fromEntries(FAM.map(([, n, m]) => [n, m])));
    for (const Comp of [Text, TextInput] as any[]) {
      const render = Comp.render;
      if (typeof render !== "function" || Comp.__ghiyarPatched) continue;
      Comp.__ghiyarPatched = true;
      Comp.render = function (...args: any[]) {
        const el = render.apply(this, args);
        const flat: any = StyleSheet.flatten(el.props.style) || {};
        const w = String(flat.fontWeight || "400");
        const n = w === "bold" ? 700 : Number(w) || 400;
        const pick = FAM.reduce((best, cur) => (Math.abs(cur[0] - n) < Math.abs(best[0] - n) ? cur : best), FAM[0]);
        return React.cloneElement(el, { style: [el.props.style, { fontFamily: pick[1], fontWeight: "normal" }] });
      };
    }
  } catch {
    // keep the system font when loading fails
  }
}
