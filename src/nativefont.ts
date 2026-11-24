import React from "react";
import { Platform, StyleSheet, Text, TextInput } from "react-native";
import * as Font from "expo-font";

// Native (iOS/Android): register Noto Kufi Arabic (SIL OFL) and apply it to every Text and TextInput.
// React Native does not synthesise weights for custom families, so bold maps to the bold file.
// Not verified on a device in this audit; web uses src/webfont.ts.
const REG = "GhiyarKufi";
const BOLD = "GhiyarKufi-Bold";

export async function loadNativeFont() {
  if (Platform.OS === "web") return;
  try {
    await Font.loadAsync({
      [REG]: require("../assets/fonts/NotoKufiArabic-Regular.ttf"),
      [BOLD]: require("../assets/fonts/NotoKufiArabic-Bold.ttf"),
    });
    for (const Comp of [Text, TextInput] as any[]) {
      const render = Comp.render;
      if (typeof render !== "function" || Comp.__ghiyarPatched) continue;
      Comp.__ghiyarPatched = true;
      Comp.render = function (...args: any[]) {
        const el = render.apply(this, args);
        const flat: any = StyleSheet.flatten(el.props.style) || {};
        const w = String(flat.fontWeight || "400");
        const bold = w === "bold" || Number(w) >= 600;
        return React.cloneElement(el, { style: [el.props.style, { fontFamily: bold ? BOLD : REG, fontWeight: "normal" }] });
      };
    }
  } catch {
    // keep the system font when loading fails
  }
}
