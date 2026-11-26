import React from "react";
import { View, Pressable } from "react-native";
import { cx } from "../i18n";

export function Card({ children, className = "", onPress }: { children: React.ReactNode; className?: string; onPress?: () => void }) {
  const cls = `${/\bbg-/.test(className) ? "" : "bg-white "}rounded-2xl border ${/\bborder-/.test(className) ? "" : "border-slate-200 "}${/\bp-\d/.test(className) ? "" : "p-3 "}${/\bmb-/.test(className) ? "" : "mb-3 "}${className}`;
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} className={cx(cls)}>{children}</Pressable> : <View className={cx(cls)}>{children}</View>;
}
