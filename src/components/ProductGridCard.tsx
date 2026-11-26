import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { t, cx } from "../i18n";
import { thumb } from "../ui/helpers";
import { money } from "../shared";
import { Ico } from "./Icons";

/** Two-column product tile used in a shop's catalogue: photo, title, price, add-to-cart and favourite. */
export function ProductGridCard({ p, offer, isFavorite, onFavorite, onAdd, onOpen }: { p: any; offer: any; isFavorite: boolean; onFavorite: () => void; onAdd: () => void; onOpen: () => void }) {
  return (
    <View className={cx("w-[48%] bg-white rounded-2xl border border-slate-200 mb-3 overflow-hidden")}>
      <Pressable style={{ zIndex: 10 }} accessibilityRole="button" accessibilityLabel={t('مفضلة {0}', p.title)} onPress={onFavorite} className={cx("absolute z-10 top-2 left-2")}><Ico n={isFavorite ? "heart-on" : "heart-off"} size={20} color={isFavorite ? "#ef4444" : "#64748b"} /></Pressable>
      <Image source={thumb(p.image)} style={{ width: "100%", height: 120, resizeMode: "cover", backgroundColor: "#fbf4ec" }} />
      <View className={cx("p-2 items-end")}><Text className={cx("font-bold text-sm text-right")} numberOfLines={2}>{p.title}</Text></View>
      <View className={cx("flex-row items-center justify-between p-2 z-[10]")}>
        <Pressable style={{ position: "relative", zIndex: 10 }} accessibilityRole="button" accessibilityLabel={t('أضف {0}', p.title)} onPress={onAdd} className={cx("z-10 w-9 h-9 rounded-full bg-accent items-center justify-center")}><Text className={cx("text-white text-xl")}>+</Text></Pressable>
        <Text className={cx("text-accent font-extrabold")}>{money(offer.price)}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={p.title} onPress={onOpen} className={cx("absolute inset-0 z-[5]")} />
    </View>
  );
}
