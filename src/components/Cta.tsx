import React from "react";
import { View, Text, Pressable } from "react-native";
import { cx, isEn } from "../i18n";
import { Ico } from "./Icons";

export function Cta({ title, onPress, disabled, outline, soft, testID, chevron, icon, chevronSide }: { chevron?: boolean; title: string; onPress: () => void; disabled?: boolean; outline?: boolean; soft?: boolean; testID?: string; icon?: string; chevronSide?: "left" | "right" }) {
  const base = "rounded-2xl py-4 px-5 items-center justify-center mt-3";
  const tone = outline ? "bg-white border-2 border-brand" : soft ? "bg-brand-light" : "bg-accent";
  const text = outline || soft ? "text-brand font-extrabold text-lg" : "text-white font-extrabold text-lg";
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} className={cx(`${base} ${tone} ${disabled ? "opacity-50" : ""}`)}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>{!!icon && <View style={{ marginRight: 8 }}><Ico n={icon} size={24} color={outline || soft ? "#0751e8" : "#fff"} /></View>}<Text className={cx(text)}>{title.replace(/\s*[‹›]$/, "")}</Text></View>
      {(chevron || /[‹›]\s*$/.test(title)) && <View style={{ position: "absolute", [(chevronSide || (isEn ? "right" : "left")) === "right" ? "right" : "left"]: 16, top: 0, bottom: 0, justifyContent: "center" }}><View style={(chevronSide || (isEn ? "right" : "left")) === "right" ? { transform: [{ scaleX: -1 }] } : undefined}><Ico n="chev" size={22} color="#fff" /></View></View>}
    </Pressable>
  );
}
