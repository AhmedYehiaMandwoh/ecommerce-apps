import { t, cx, isEn, ENDITEMS } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { shopCover } from "../ui/helpers";
import { Ico, Chev } from "../ui/kit";

export function ShopsScreen({ c }: { c: any }) {
  const { shops, browse, back } = c;
  const [q, setQ] = useState("");
  const list = shops.filter((s: any) => !q || s.name.includes(q));
  return (
    <View className={cx("bg-white flex-1")}>
      <View className={cx("bg-brand px-4 pt-3 pb-3")} style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View className={cx("flex-row items-center justify-between h-10")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('رجوع')} onPress={back} className={cx("w-10")}><Chev dir="left" color="#fff" size={13} /></Pressable>
          <Text className={cx("text-white font-extrabold")} style={{ fontSize: 28 }}>{t('المحلات')}</Text>
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
          <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={s.name} onPress={() => browse("", "", s.id)} className={cx("bg-white rounded-2xl border border-slate-200 mb-2 overflow-hidden")}>
            <View>
              <Image source={shopCover(s, n).source} style={{ width: "100%", height: 96, resizeMode: "cover" }} />
              {shopCover(s, n).demo && <View className={cx("absolute bottom-1 left-2 bg-slate-900/80 rounded px-2")}><Text className={cx("text-white text-[11px]")}>{t('صورة تجريبية')}</Text></View>}
            </View>
            <View className="items-center px-3 py-1" style={{ flexDirection: "row" }}>
              <View className={cx("w-11 h-11 rounded-full bg-accent items-center justify-center")}><Ico n="shop" size={30} color="#fff" /></View>
              <View className={cx("flex-1 mx-3")} style={{ alignItems: ENDITEMS }}><Text className={cx("font-extrabold text-lg")}>{s.name}</Text><Text className={cx("text-slate-500 text-sm")}>{s.description || t('قطع غيار وصيانة')} • {s.city}{s.district ? " • " + s.district : ""}</Text></View>
              <Chev dir={isEn ? "right" : "left"} color="#64748b" size={10} />
            </View>
          </Pressable>
        ))}
        {!list.length && <Text className={cx("text-center text-slate-500 my-10")}>{t('مفيش محلات مطابقة.')}</Text>}
      </View>
    </View>
  );
}
