import { t, cx, isEn, ENDITEMS } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { shopCover } from "../ui/helpers";
import { Ico, Chev, ShopCard } from "../components";

export function ShopsScreen({ c }: { c: any }) {
  const { shops, browse, back } = c;
  const [q, setQ] = useState("");
  const list = shops.filter((s: any) => !q || s.name.includes(q));
  return (
    <View className={cx("bg-white flex-1")}>
      <View className={cx("bg-brand px-4 pt-3 pb-3")} style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View className={cx("flex-row items-center justify-between h-10")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('رجوع')} onPress={back} className={cx("w-10")}><Chev dir="left" color="#fff" size={13} /></Pressable>
          <Text className={cx("text-white font-extrabold text-[28px]")}>{t('المحلات')}</Text>
          <View className={cx("w-10")} />
        </View>
        <View className={cx("bg-white rounded-full h-12 mt-2 px-4 flex-row items-center")}>
          <TextInput style={{ minWidth: 0, paddingEnd: 8 }} accessibilityLabel={t('ابحث باسم المحل')} value={q} onChangeText={setQ} placeholder={t('ابحث باسم المحل')} placeholderTextColor="#94a3b8" className={cx("flex-1 text-right text-base")} />
          <View className={cx("ml-2")}><Ico n="search" size={20} color="#64748b" /></View>
        </View>
        <View className={cx("flex-row-reverse mt-3")}>
          {[t('الأقرب'), t('التخصص'), t('الترتيب')].map((t) => <View key={t} className={cx("bg-white rounded-2xl py-2 ml-2 flex-1 items-center")}><Text className={cx("font-extrabold text-slate-800 text-base")}>{t}  ⌄</Text></View>)}
        </View>
      </View>
      <View className={cx("px-3 pt-2")}>
        {list.map((s: any, n: number) => (
          <ShopCard key={s.id} s={s} n={n} onPress={() => browse("", "", s.id)} />
        ))}
        {!list.length && <Text className={cx("text-center text-slate-500 my-10")}>{t('مفيش محلات مطابقة.')}</Text>}
      </View>
    </View>
  );
}
