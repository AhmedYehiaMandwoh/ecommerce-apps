import { registerRootComponent } from "expo";
import App from "./App";
import { installWebFont } from "./src/webfont";

installWebFont();
registerRootComponent(App);
