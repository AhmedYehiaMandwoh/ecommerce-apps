import { registerRootComponent } from "expo";
import App from "./App";
import { installWebFont } from "./src/webfont";
import { loadNativeFont } from "./src/nativefont";

installWebFont();
loadNativeFont().finally(() => registerRootComponent(App));
