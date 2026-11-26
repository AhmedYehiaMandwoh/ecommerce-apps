import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { t, cx, isEn, ENDITEMS } from "../i18n";
import { shopCover } from "../ui/helpers";
import { Ico, Chev } from "./Icons";

/** Shop list card: cover photo (demo badge when it is placeholder art), round shop icon, name, details and chevron. */
export function ShopCard({ s, n, onPress }: { s: any; n: number; onPress: () => void }) {
  const cover = shopCover(s, n);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={s.name} onPress={onPress} className={cx("bg-white rounded-2xl border border-slate-200 mb-2 overflow-hidden")}>
      <View>
        <Image source={cover.source} style={{ width: "100%", height: 96, resizeMode: "cover" }} />
        {cover.demo && <View className={cx("absolute bottom-1 left-2 bg-slate-900/80 rounded px-2")}><Text className={cx("text-white text-[11px]")}>{t('صورة تجريبية')}</Text></View>}
      </View>
      <View className="items-center px-3 py-1" style={{ flexDirection: "row" }}>
        <View className={cx("w-11 h-11 rounded-full bg-accent items-center justify-center")}><Ico n="shop" size={30} color="#fff" /></View>
        <View className={cx("flex-1 mx-3")} style={{ alignItems: ENDITEMS }}><Text className={cx("font-extrabold text-lg")}>{s.name}</Text><Text className={cx("text-slate-500 text-sm")}>{s.description || t('قطع غيار وصيانة')} • {s.city}{s.district ? " • " + s.district : ""}</Text></View>
        <Chev dir={isEn ? "right" : "left"} color="#64748b" size={10} />
      </View>
    </Pressable>
  );
}
