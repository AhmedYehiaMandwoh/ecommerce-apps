import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { t, cx } from "../i18n";
import { thumb } from "../ui/helpers";
import { Card } from "./Card";
import { Ico } from "./Icons";

/** Saved-product row with remove-heart, title and thumbnail. */
export function FavoriteRow({ p, onRemove, onOpen }: { p: any; onRemove: () => void; onOpen: () => void }) {
  return (
    <Card className={cx("flex-row items-center")}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('إزالة {0}', p.title)} onPress={onRemove} className={cx("w-10 h-10 items-center justify-center")}><Ico n="heart-on" size={22} color="#ef4444" /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={t('تفاصيل {0}', p.title)} className={cx("flex-1 flex-row items-center")} onPress={onOpen}>
        <View className={cx("flex-1 items-end mx-2")}><Text className={cx("font-bold text-right")}>{p.title}</Text></View>
        <Image source={thumb(p.image)} style={{ width: 70, height: 60, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 10 }} />
      </Pressable>
    </Card>
  );
}
