import React from "react";
import { Text, Pressable } from "react-native";
import { cx } from "../i18n";

export function Chip({ title, active, onPress }: { title: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} className={cx(`px-4 py-2 rounded-xl ml-2 ${active ? "bg-brand" : "bg-brand-light"}`)}>
      <Text className={cx(active ? "text-white font-bold" : "text-slate-700 font-bold")}>{title}</Text>
    </Pressable>
  );
}
