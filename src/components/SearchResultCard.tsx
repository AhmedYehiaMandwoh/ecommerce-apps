import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { t, cx } from "../i18n";
import { thumb } from "../ui/helpers";
import { money } from "../shared";

/** Horizontal search-result row: add button, title, shop, best price, compatibility chip and photo. */
export function SearchResultCard({ p, best, onAdd, onOpen }: { p: any; best: any; onAdd: () => void; onOpen: () => void }) {
  return (
    <View className={cx("flex-row bg-white rounded-2xl border border-slate-200 mb-3 overflow-hidden")}>
      <Pressable style={{ position: "relative", zIndex: 10 }} accessibilityRole="button" accessibilityLabel={t('أضف {0}', p.title)} onPress={onAdd} className={cx("z-10 w-14 h-14 rounded-full bg-accent items-center justify-center self-center mx-2")}><Text className={cx("text-white text-3xl")}>+</Text></Pressable>
      <View className={cx("flex-1 min-w-0 py-3 items-end")}>
        <Text className={cx("font-extrabold text-base text-right")} numberOfLines={2} accessibilityLabel={p.title}>{p.title}</Text>
        <Text className={cx("text-slate-500 text-sm")} numberOfLines={1}>{t('من')} {best?.shop?.name}</Text>
        <Text className={cx("text-accent font-extrabold text-xl")}>{money(best.price)}</Text>
        <Text className={cx("text-slate-500 text-[11px]")} numberOfLines={1}>{p.brand} • {p.partNumber}</Text>
        <View className={cx("bg-slate-100 rounded-lg px-3 py-1 mt-1")}><Text className={cx("text-slate-600 text-xs font-bold")}>{t('راجع التوافق')}</Text></View>
      </View>
      <Image source={thumb(p.image)} style={{ width: 132, height: 132, resizeMode: "contain", backgroundColor: "#fbf4ec" }} />
      <Pressable accessibilityRole="button" accessibilityLabel={p.title} onPress={onOpen} className={cx("absolute inset-0 z-[5]")} />
    </View>
  );
}
