import React from "react";
import { View, Image } from "react-native";

export const art = {
  logo: require("../../assets/reference-logo.png"),
  cart: require("../../assets/cart-icon.png"),
  car: require("../../assets/car-icon.png"),
  store: require("../../assets/store-white.png"),
};

export const icons: Record<string, any> = {
  chev: require("../../assets/icons/chev.png"), search: require("../../assets/icons/search.png"), home: require("../../assets/icons/home.png"), shop: require("../../assets/icons/shop.png"), truck: require("../../assets/icons/truck.png"), car: require("../../assets/icons/car.png"),
  ticket: require("../../assets/icons/ticket.png"), pin: require("../../assets/icons/pin.png"),
  "f-pin": require("../../assets/icons/f-pin.png"), "f-map": require("../../assets/icons/f-map.png"), "f-road": require("../../assets/icons/f-road.png"),
  "send": require("../../assets/icons/send.png"), "f-doc": require("../../assets/icons/f-doc.png"), "f-landmark": require("../../assets/icons/f-landmark.png"),
  "v-car": require("../../assets/icons/v-car.png"), "v-cal": require("../../assets/icons/v-cal.png"), "v-engine": require("../../assets/icons/v-engine.png"), "clip": require("../../assets/icons/clip.png"), "heart-on": require("../../assets/icons/heart-on.png"), "heart-off": require("../../assets/icons/heart-off.png"), headset: require("../../assets/icons/headset.png"), clock: require("../../assets/icons/clock.png"), phone: require("../../assets/icons/phone.png"), x: require("../../assets/icons/x.png"), gear: require("../../assets/icons/gear.png"),
};

// Icons are cropped from the supplied PDF and used as tintable masks.
export function Ico({ n, size = 22, color = "#0b2a5b" }: { n: string; size?: number; color?: string }) {
  return <Image accessibilityElementsHidden importantForAccessibility="no-hide-descendants" source={icons[n]} style={{ width: size, height: size, resizeMode: "contain", tintColor: color }} />;
}

// Direction-invariant chevron drawn with borders, so RTL bidi mirroring can never flip it.
export function Chev({ dir, color, size = 10 }: { dir: "left" | "right"; color: string; size?: number }) {
  const w = 2.5;
  return <View style={{ width: size, height: size, marginHorizontal: 5, borderColor: color, transform: [{ rotate: "45deg" }], ...(dir === "left" ? { borderLeftWidth: w, borderBottomWidth: w } : { borderRightWidth: w, borderTopWidth: w }) }} />;
}
