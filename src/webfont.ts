import { Platform } from "react-native";
import { Asset } from "expo-asset";

// Bundles Noto Kufi Arabic (SIL OFL) so Arabic text does not depend on fonts installed on the viewing device.
export function installWebFont() {
  if (Platform.OS !== "web" || typeof document === "undefined" || document.getElementById("ghiyar-font")) return;
  const reg = Asset.fromModule(require("../assets/fonts/NotoKufiArabic-Regular.ttf")).uri;
  const bold = Asset.fromModule(require("../assets/fonts/NotoKufiArabic-Bold.ttf")).uri;
  const style = document.createElement("style");
  style.id = "ghiyar-font";
  style.textContent = `@font-face{font-family:"Ghiyar Kufi";font-weight:400;src:url("${reg}") format("truetype");font-display:swap}` +
    `@font-face{font-family:"Ghiyar Kufi";font-weight:500 900;src:url("${bold}") format("truetype");font-display:swap}` +
    `body *,body{font-family:"Ghiyar Kufi","Noto Kufi Arabic",system-ui,sans-serif !important}`;
  document.head.appendChild(style);
}
