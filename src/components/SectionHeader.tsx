import React from "react";
import { View, Text, Pressable } from "react-native";
import { t, cx, isEn } from "../i18n";

const BRAND = "#0751e8";

/** Section title on one side and a "show all" link with a drawn chevron on the other. */
export function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel: string; onAction: () => void }) {
  return (
    <View className={cx("flex-row items-center justify-between h-[30px] mt-[14px] mb-[7px]")}>
      <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction} style={{ flexDirection: isEn ? "row-reverse" : "row", alignItems: "center" }}><View style={{ width: 9, height: 9, marginHorizontal: 5, borderColor: BRAND, transform: [{ rotate: "45deg" }], ...(isEn ? { borderRightWidth: 2.5, borderTopWidth: 2.5 } : { borderLeftWidth: 2.5, borderBottomWidth: 2.5 }) }} /><Text className={cx("text-brand font-semibold text-[14.5px]")}>{isEn ? actionLabel : 'عرض الكل'}</Text></Pressable>
      <Text className={cx("font-extrabold text-[17.5px]")}>{title}</Text>
    </View>
  );
}
