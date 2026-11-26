import React from "react";
import { View, Text, Pressable } from "react-native";
import { t, cx } from "../i18n";

export function Stepper({ value, onMinus, onPlus }: { value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <View className={cx("flex-row items-center border border-slate-300 rounded-xl overflow-hidden self-start")}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('تقليل')} onPress={onMinus} className={cx("w-10 h-10 items-center justify-center")}><Text className={cx("text-xl text-brand")}>−</Text></Pressable>
      <Text className={cx("w-10 text-center font-bold")}>{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={t('زيادة')} onPress={onPlus} className={cx("w-10 h-10 items-center justify-center")}><Text className={cx("text-xl text-brand")}>+</Text></Pressable>
    </View>
  );
}
