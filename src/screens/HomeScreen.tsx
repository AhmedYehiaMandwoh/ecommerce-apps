import { t, cx, isEn } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { art, Ico, Chev } from "../ui/kit";

const BRAND = "#0751e8";
const cats: [string, any][] = [
  ['فرامل', require("../../assets/pdf/tile-brakes.png")], ['زيوت', require("../../assets/pdf/tile-oil.png")], ['فلاتر', require("../../assets/pdf/tile-filter.png")],
  ['تعليق', require("../../assets/pdf/tile-suspension.png")], ['كهرباء', require("../../assets/pdf/tile-electric.png")], ['إكسسوارات', require("../../assets/pdf/tile-accessory.png")],
];
export function HomeScreen({ c }: { c: any }) {
  const { go, count, browse, search, history } = c;
  const [q, setQ] = useState("");
  const recent = history.slice(0, 2);
  const shown = (l: string) => (isEn ? t(l) : l === 'تعليق' ? 'عفشة' : l);
  return (
    <View className={cx("bg-white flex-1")}>
      <View style={{ backgroundColor: "#0057d9", overflow: "hidden", paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Image pointerEvents="none" source={require("../../assets/pdf/header-streaks.png")} style={{ position: "absolute", left: 0, top: 56, width: 88, height: 68, resizeMode: "stretch", opacity: 0.8 }} />
        <View className={cx("flex-row items-center justify-between")} style={{ height: 48 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('عنوان التوصيل')} onPress={() => go("addresses")}><View className={cx("flex-row items-center")} style={{ transform: [{ translateX: 6 }] }}><Image source={require("../../assets/pdf/pin.png")} style={{ width: 15, height: 19.5 }} /><Text className={cx("text-white font-bold")} style={{ fontSize: 10.5, marginLeft: 6 }}>{t('حدد موقع التوصيل ⌄').replace(" ⌄", "")}</Text><View style={{ width: 6, height: 6, marginLeft: 8, marginTop: -3, borderColor: "#dbe7ff", borderRightWidth: 1.5, borderBottomWidth: 1.5, transform: [{ rotate: "45deg" }] }} /></View></Pressable>
          <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: -1, alignItems: "center" }}><Image source={art.logo} style={{ width: 103, height: 54, resizeMode: "contain" }} /></View>
          <Pressable accessibilityRole="button" accessibilityLabel={t('السلة')} onPress={() => go("cart")} className={cx("items-center justify-center")} style={{ width: 40, height: 40 }}>
            <Image source={require("../../assets/pdf/cart.png")} style={{ width: 29, height: 30 }} />
            {!!count && <View className={cx("absolute bg-accent rounded-full items-center justify-center")} style={{ top: 0, right: 0, minWidth: 14, height: 14 }}><Text className={cx("text-white font-bold")} style={{ fontSize: 9 }}>{count}</Text></View>}
          </Pressable>
        </View>
        <Text className={cx("text-white text-center")} style={{ fontWeight: "900", fontSize: 31, lineHeight: 42, marginTop: 12.5 }}>{t('بتدور على إيه؟')}</Text>
        <View className={cx("bg-white rounded-full px-4 flex-row items-center")} style={{ height: 41, marginTop: 8 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('بحث')} onPress={() => browse(q, "")}><Image source={require("../../assets/pdf/search.png")} style={{ width: 21, height: 21 }} /></Pressable>
          <TextInput accessibilityLabel={t('البحث')} value={q} onChangeText={setQ} onSubmitEditing={() => browse(q, "")} placeholder={t('ابحث باسم القطعة أو رقمها')} placeholderTextColor="#6b6f7e" className={cx("flex-1 text-right")} style={{ fontSize: 16.3 }} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 14, paddingTop: 11.5 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('اختر عربيتك')} onPress={() => go("vehicle")} className={cx("flex-row items-center")} style={{ flexDirection: "row", height: 65, borderRadius: 16, backgroundColor: "#eaf1fd", paddingHorizontal: 16 }}>
          <Image source={require("../../assets/pdf/car.png")} style={{ width: 41, height: 32 }} />
          <View style={{ width: 1, height: 40, backgroundColor: "#cbd5e1", marginLeft: 22 }} />
          <View className={cx("flex-1 items-start")} style={{ marginLeft: 17, transform: [{ translateY: 1.5 }] }}><Text className={cx("font-extrabold text-slate-900")} style={{ fontSize: 17.5, lineHeight: 24 }}>{t('اختر عربيتك')}</Text><Text className={cx("text-slate-600")} style={{ fontSize: 13.3, lineHeight: 18, marginTop: 5 }}>{t('عشان نعرض لك القطع المناسبة')}</Text></View>
          <Image source={require("../../assets/pdf/chev-r.png")} style={{ width: 8.75, height: 15.5 }} />
        </Pressable>
        <View className={cx("flex-row items-center justify-between")} style={{ height: 30, marginTop: 14, marginBottom: 7 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('عرض الكل')} onPress={() => browse("", "")} style={{ flexDirection: isEn ? "row-reverse" : "row", alignItems: "center" }}><View style={{ width: 9, height: 9, marginHorizontal: 5, borderColor: BRAND, transform: [{ rotate: "45deg" }], ...(isEn ? { borderRightWidth: 2.5, borderTopWidth: 2.5 } : { borderLeftWidth: 2.5, borderBottomWidth: 2.5 }) }} /><Text className={cx("text-brand font-semibold")} style={{ fontSize: 14.5 }}>{isEn ? t('عرض الكل') : 'عرض الكل'}</Text></Pressable>
          <Text className={cx("font-extrabold")} style={{ fontSize: 17.5 }}>{t('تصفح الأقسام')}</Text>
        </View>
        <View className={cx("flex-row-reverse flex-wrap justify-between")}>
          {cats.map(([label, image], i) => (
            <Pressable key={label} accessibilityRole="button" accessibilityLabel={t(label)} onPress={() => browse("", label)} style={{ width: "31%", alignItems: "center" }}>
              <View style={{ width: "100%", height: i < 3 ? 97 : 103, borderRadius: 14, backgroundColor: "#f7f0e9", overflow: "hidden" }}><Image source={image} style={{ width: "100%", height: i < 3 ? 97 : 103, resizeMode: "stretch" }} /></View>
              <Text className={cx("font-bold text-slate-900")} style={{ fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 11 }}>{shown(label)}</Text>
            </Pressable>
          ))}
        </View>
        <Text className={cx("font-extrabold text-right")} style={{ fontSize: 17, lineHeight: 28, marginTop: 3.5, marginBottom: 3 }}>{t('عمليات البحث الأخيرة')}</Text>
        <View className={cx("flex-row-reverse")} style={{ gap: 10 }}>
          {recent.length === 0 && <Text className={cx("text-slate-400 text-sm")}>{t('لسه ما بحثتش عن حاجة')}</Text>}
          {recent.map((h: string) => (
            <Pressable key={h} accessibilityRole="button" onPress={() => browse(h, "")} className={cx("flex-row-reverse items-center bg-white")} style={{ flex: 1, height: 42, borderRadius: 14, borderWidth: 1, borderColor: "#e3e6ec", paddingHorizontal: 16, shadowColor: "#0f172a", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}><View className={cx("ml-2")}><Image source={require("../../assets/pdf/clock.png")} style={{ width: 17, height: 17 }} /></View><Text className={cx("font-bold text-slate-900")} style={{ fontSize: 14 }}>{h}</Text></Pressable>
          ))}
        </View>
        <Text className={cx("text-center text-xs text-slate-400 my-5")}>{t('تصميم مبدئي • بيانات تجريبية • الدفع كاش فقط')}</Text>
      </View>
    </View>
  );
}
