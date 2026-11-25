import { Platform } from "react-native";
import { Asset } from "expo-asset";

// Bundles Cairo (SIL OFL, matches the design PDF) so Arabic text does not depend on fonts installed on the viewing device.
export function installWebFont() {
  if (Platform.OS !== "web" || typeof document === "undefined" || document.getElementById("ghiyar-font")) return;
  const u = (m: any) => Asset.fromModule(m).uri;
  const faces: [number, string][] = [
    [400, u(require("../assets/fonts/Cairo-Regular.ttf"))], [600, u(require("../assets/fonts/Cairo-SemiBold.ttf"))], [700, u(require("../assets/fonts/Cairo-Bold.ttf"))],
    [800, u(require("../assets/fonts/Cairo-ExtraBold.ttf"))], [900, u(require("../assets/fonts/Cairo-Black.ttf"))],
  ];
  const style = document.createElement("style");
  style.id = "ghiyar-font";
  style.textContent = faces.map(([w, uri]) => `@font-face{font-family:"Ghiyar Kufi";font-weight:${w};src:url("${uri}") format("truetype");font-display:swap}`).join("") +
    `body *,body{font-family:"Ghiyar Kufi","Cairo","Noto Kufi Arabic",system-ui,sans-serif !important}`;
  document.head.appendChild(style);
}
