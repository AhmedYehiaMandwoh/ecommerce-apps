import { t, cx, isEn } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { art, Ico, Chev } from "../ui/kit";

const BRAND = "#0751e8";
const cats: [string, any][] = [
  ['فرامل', require("../../assets/tiles/brakes.png")], ['زيوت', require("../../assets/tiles/oil.png")], ['فلاتر', require("../../assets/tiles/filter.png")],
  ['تعليق', require("../../assets/tiles/suspension.png")], ['كهرباء', require("../../assets/tiles/electric.png")], ['إكسسوارات', require("../../assets/tiles/accessory.png")],
];
export function HomeScreen({ c }: { c: any }) {
  const { go, count, browse, search, history } = c;
  const [q, setQ] = useState("");
  const recent = history.slice(0, 2);
  const shown = (l: string) => (isEn ? t(l) : l === 'تعليق' ? 'عفشة' : l);
  return (
    <View className={cx("bg-white flex-1")}>
      <View className={cx("bg-brand")} style={{ paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View className={cx("flex-row items-center justify-between")} style={{ height: 48 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('عنوان التوصيل')} onPress={() => go("addresses")}><View className={cx("flex-row items-center")}><Ico n="pin" size={18} color="#fff" /><Text className={cx("text-white font-semibold")} style={{ fontSize: 10, marginLeft: 6 }}>{t('حدد موقع التوصيل ⌄').replace(" ⌄", "")}</Text><View style={{ width: 6, height: 6, marginLeft: 8, marginTop: -3, borderColor: "#dbe7ff", borderRightWidth: 1.5, borderBottomWidth: 1.5, transform: [{ rotate: "45deg" }] }} /></View></Pressable>
          <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: -1, alignItems: "center" }}><Image source={art.logo} style={{ width: 103, height: 54, resizeMode: "contain" }} /></View>
          <Pressable accessibilityRole="button" accessibilityLabel={t('السلة')} onPress={() => go("cart")} className={cx("items-center justify-center")} style={{ width: 40, height: 40 }}>
            <Image source={art.cart} style={{ width: 36, height: 36, resizeMode: "contain" }} />
            {!!count && <View className={cx("absolute bg-accent rounded-full items-center justify-center")} style={{ top: 0, right: 0, minWidth: 14, height: 14 }}><Text className={cx("text-white font-bold")} style={{ fontSize: 9 }}>{count}</Text></View>}
          </Pressable>
        </View>
        <Text className={cx("text-white font-extrabold text-center")} style={{ fontSize: 30, lineHeight: 42, marginTop: 14 }}>{t('بتدور على إيه؟')}</Text>
        <View className={cx("bg-white rounded-full px-4 flex-row items-center")} style={{ height: 41, marginTop: 6.5 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('بحث')} onPress={() => browse(q, "")}><Ico n="search" size={24} color="#4b5d78" /></Pressable>
          <TextInput accessibilityLabel={t('البحث')} value={q} onChangeText={setQ} onSubmitEditing={() => browse(q, "")} placeholder={t('ابحث باسم القطعة أو رقمها')} placeholderTextColor="#64748b" className={cx("flex-1 text-right")} style={{ fontSize: 15 }} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 14, paddingTop: 11.5 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('اختر عربيتك')} onPress={() => go("vehicle")} className={cx("flex-row items-center")} style={{ flexDirection: "row", height: 65, borderRadius: 16, backgroundColor: "#eaf1fd", paddingHorizontal: 16 }}>
          <Image source={require("../../assets/icons/car.png")} style={{ width: 46, height: 46, resizeMode: "contain", tintColor: "#0f2747" }} />
          <View style={{ width: 1, height: 40, backgroundColor: "#cbd5e1", marginLeft: 18 }} />
          <View className={cx("flex-1 items-start")} style={{ marginLeft: 16 }}><Text className={cx("font-extrabold text-slate-900")} style={{ fontSize: 16, lineHeight: 24 }}>{t('اختر عربيتك')}</Text><Text className={cx("text-slate-500")} style={{ fontSize: 12.5, lineHeight: 18 }}>{t('عشان نعرض لك القطع المناسبة')}</Text></View>
          <Chev dir="right" color="#0f172a" size={12} />
        </Pressable>
        <View className={cx("flex-row items-center justify-between")} style={{ height: 30, marginTop: 14, marginBottom: 7 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('عرض الكل')} onPress={() => browse("", "")} style={{ flexDirection: isEn ? "row-reverse" : "row", alignItems: "center" }}><View style={{ width: 9, height: 9, marginHorizontal: 5, borderColor: BRAND, transform: [{ rotate: "45deg" }], ...(isEn ? { borderRightWidth: 2.5, borderTopWidth: 2.5 } : { borderLeftWidth: 2.5, borderBottomWidth: 2.5 }) }} /><Text className={cx("text-brand font-semibold")} style={{ fontSize: 12.5 }}>{isEn ? t('عرض الكل') : 'عرض الكل'}</Text></Pressable>
          <Text className={cx("font-extrabold")} style={{ fontSize: 16 }}>{t('تصفح الأقسام')}</Text>
        </View>
        <View className={cx("flex-row-reverse flex-wrap justify-between")}>
          {cats.map(([label, image]) => (
            <Pressable key={label} accessibilityRole="button" accessibilityLabel={t(label)} onPress={() => browse("", label)} style={{ width: "31%", alignItems: "center" }}>
              <View style={{ width: "100%", height: 97, borderRadius: 14, backgroundColor: "#f7f0e9", overflow: "hidden" }}><Image source={image} style={{ width: "100%", height: 97, resizeMode: "cover" }} /></View>
              <Text className={cx("font-bold text-slate-900")} style={{ fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 11 }}>{shown(label)}</Text>
            </Pressable>
          ))}
        </View>
        <Text className={cx("font-extrabold text-right")} style={{ fontSize: 16, lineHeight: 28, marginTop: 13, marginBottom: 3 }}>{t('عمليات البحث الأخيرة')}</Text>
        <View className={cx("flex-row-reverse")} style={{ gap: 10 }}>
          {recent.length === 0 && <Text className={cx("text-slate-400 text-sm")}>{t('لسه ما بحثتش عن حاجة')}</Text>}
          {recent.map((h: string) => (
            <Pressable key={h} accessibilityRole="button" onPress={() => browse(h, "")} className={cx("flex-row-reverse items-center bg-white")} style={{ flex: 1, height: 40, borderRadius: 20, borderWidth: 1, borderColor: "#e2e8f0", paddingHorizontal: 16 }}><View className={cx("ml-2")}><Ico n="clock" size={22} color="#1e293b" /></View><Text className={cx("font-semibold text-slate-800")} style={{ fontSize: 13 }}>{h}</Text></Pressable>
          ))}
        </View>
        <Text className={cx("text-center text-xs text-slate-400 my-5")}>{t('تصميم مبدئي • بيانات تجريبية • الدفع كاش فقط')}</Text>
      </View>
    </View>
  );
}
