import React from "react";
import { View, Text, TextInput } from "react-native";
import { cx } from "../i18n";
import { icons, Ico } from "./Icons";

export function Input({ label, icon, value, onChange, placeholder, numeric, secure, multiline, inline, compact }: { compact?: boolean; inline?: boolean; label?: string; icon?: string; value: string; onChange: (t: string) => void; placeholder?: string; numeric?: boolean; secure?: boolean; multiline?: boolean }) {
  if (inline) return (
    <View className={cx("flex-row-reverse items-center bg-white border border-slate-200 rounded-2xl px-3 mb-1.5 overflow-hidden")} style={{ height: 46, shadowColor: "#0f172a", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}>
      <View className={cx("flex-row-reverse items-center")} style={{ maxWidth: "64%" }}>{icon && icons[icon] ? <View className={cx("ml-2")}><Ico n={icon} size={24} /></View> : icon ? <Text className={cx("ml-2")}>{icon}</Text> : null}<Text className={cx(`text-right font-bold text-slate-900 ${(label || "").length > 12 ? "text-sm" : "text-base"}`)} numberOfLines={1}>{label}</Text></View>
      <TextInput accessibilityLabel={label || placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94a3b8" keyboardType={numeric ? "numeric" : "default"} secureTextEntry={secure} className={cx("flex-1 mr-3 text-base")} style={{ textAlign: "left", height: 48, minWidth: 0, width: 0, outlineStyle: "none", outlineWidth: 0 } as any} />
    </View>
  );
  return (
    <View className={cx("mb-3")}>
      {!!label && <View className={cx("flex-row items-center mb-1")}>{icon && icons[icon] ? <View className={cx("ml-2")}><Ico n={icon} size={18} /></View> : null}<Text className={cx("text-right font-bold text-slate-900")}>{icon && !icons[icon] ? icon + "  " : ""}{label}</Text></View>}
      <TextInput accessibilityLabel={label || placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94a3b8" keyboardType={numeric ? "numeric" : "default"} secureTextEntry={secure} multiline={multiline} className={cx(`bg-white border border-slate-200 rounded-xl px-4 text-right text-base ${multiline ? (compact ? "py-1 min-h-[52px]" : "py-2 min-h-[70px]") : "h-12"}`)} />
    </View>
  );
}
