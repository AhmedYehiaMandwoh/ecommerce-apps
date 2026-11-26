import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { cx, isEn } from "../i18n";
import { Chev } from "./Icons";

/** Menu row: round-cornered tile with title, subtitle, leading art and a chevron. */
export function ListRow({ title, sub, image, onPress }: { title: string; sub: string; image: any; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} className={cx("flex-row items-center bg-slate-50 rounded-2xl p-3 mb-3 border border-slate-100")}>
      <Chev dir={isEn ? "right" : "left"} color="#64748b" size={10} />
      <View className={cx("flex-1 mr-3 items-end")}><Text className={cx("font-extrabold text-base")}>{title}</Text><Text className={cx("text-slate-500 text-sm")}>{sub}</Text></View>
      <Image accessibilityElementsHidden source={image} style={{ width: 48, height: 48 }} />
    </Pressable>
  );
}
