import { t, cx, isEn } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { art, Ico, Chev, SectionHeader } from "../components";

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
        <View className={cx("flex-row items-center justify-between h-[48px]")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('عنوان التوصيل')} onPress={() => go("addresses")}><View className={cx("flex-row items-center")} style={{ transform: [{ translateX: 6 }] }}><Image source={require("../../assets/pdf/pin.png")} style={{ width: 15, height: 19.5 }} /><Text className={cx("text-white font-bold text-[10.5px] ml-[6px]")}>{t('حدد موقع التوصيل ⌄').replace(" ⌄", "")}</Text><View style={{ width: 6, height: 6, marginLeft: 8, marginTop: -3, borderColor: "#dbe7ff", borderRightWidth: 1.5, borderBottomWidth: 1.5, transform: [{ rotate: "45deg" }] }} /></View></Pressable>
          <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: -1, alignItems: "center" }}><Image source={art.logo} style={{ width: 103, height: 54, resizeMode: "contain" }} /></View>
          <Pressable accessibilityRole="button" accessibilityLabel={t('السلة')} onPress={() => go("cart")} className={cx("items-center justify-center w-[40px] h-[40px]")}>
            <Image source={require("../../assets/pdf/cart.png")} style={{ width: 29, height: 30 }} />
            {!!count && <View className={cx("absolute bg-accent rounded-full items-center justify-center h-[14px]")} style={{ top: 0, right: 0, minWidth: 14 }}><Text className={cx("text-white font-bold text-[9px]")}>{count}</Text></View>}
          </Pressable>
        </View>
        <Text className={cx("text-white text-center text-[31px] leading-[42px] mt-[12.5px]")} style={{ fontWeight: "900" }}>{t('بتدور على إيه؟')}</Text>
        <View className={cx("bg-white rounded-full px-4 flex-row items-center h-[41px] mt-[8px]")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('بحث')} onPress={() => browse(q, "")}><Image source={require("../../assets/pdf/search.png")} style={{ width: 21, height: 21 }} /></Pressable>
          <TextInput accessibilityLabel={t('البحث')} value={q} onChangeText={setQ} onSubmitEditing={() => browse(q, "")} placeholder={t('ابحث باسم القطعة أو رقمها')} placeholderTextColor="#6b6f7e" className={cx("flex-1 text-right text-[16.3px]")} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 14, paddingTop: 11.5 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('اختر عربيتك')} onPress={() => go("vehicle")} className={cx("flex-row items-center h-[65px] rounded-[16px] bg-[#eaf1fd] px-[16px]")} style={{ flexDirection: "row" }}>
          <Image source={require("../../assets/pdf/car.png")} style={{ width: 41, height: 32 }} />
          <View style={{ width: 1, height: 40, backgroundColor: "#cbd5e1", marginLeft: 22 }} />
          <View className={cx("flex-1 items-start")} style={{ marginLeft: 17, transform: [{ translateY: 1.5 }] }}><Text className={cx("font-extrabold text-slate-900 text-[17.5px] leading-[24px]")}>{t('اختر عربيتك')}</Text><Text className={cx("text-slate-600 text-[13.3px] leading-[18px] mt-[5px]")}>{t('عشان نعرض لك القطع المناسبة')}</Text></View>
          <Image source={require("../../assets/pdf/chev-r.png")} style={{ width: 8.75, height: 15.5 }} />
        </Pressable>
        <SectionHeader title={t('تصفح الأقسام')} actionLabel={t('عرض الكل')} onAction={() => browse("", "")} />
        <View className={cx("flex-row-reverse flex-wrap justify-between")}>
          {cats.map(([label, image], i) => (
            <Pressable key={label} accessibilityRole="button" accessibilityLabel={t(label)} onPress={() => browse("", label)} style={{ width: "31%", alignItems: "center" }}>
              <View style={{ width: "100%", height: i < 3 ? 97 : 103, borderRadius: 14, backgroundColor: "#f7f0e9", overflow: "hidden" }}><Image source={image} style={{ width: "100%", height: i < 3 ? 97 : 103, resizeMode: "stretch" }} /></View>
              <Text className={cx("font-bold text-slate-900 text-[14px] leading-[20px] mt-[4px] mb-[11px]")}>{shown(label)}</Text>
            </Pressable>
          ))}
        </View>
        <Text className={cx("font-extrabold text-right text-[17px] leading-[28px] mt-[3.5px] mb-[3px]")}>{t('عمليات البحث الأخيرة')}</Text>
        <View className={cx("flex-row-reverse")} style={{ gap: 10 }}>
          {recent.length === 0 && <Text className={cx("text-slate-400 text-sm")}>{t('لسه ما بحثتش عن حاجة')}</Text>}
          {recent.map((h: string) => (
            <Pressable key={h} accessibilityRole="button" onPress={() => browse(h, "")} className={cx("flex-row-reverse items-center bg-white")} style={{ flex: 1, height: 42, borderRadius: 14, borderWidth: 1, borderColor: "#e3e6ec", paddingHorizontal: 16, shadowColor: "#0f172a", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}><View className={cx("ml-2")}><Image source={require("../../assets/pdf/clock.png")} style={{ width: 17, height: 17 }} /></View><Text className={cx("font-bold text-slate-900 text-[14px]")}>{h}</Text></Pressable>
          ))}
        </View>
        <Text className={cx("text-center text-xs text-slate-400 my-5")}>{t('تصميم مبدئي • بيانات تجريبية • الدفع كاش فقط')}</Text>
      </View>
    </View>
  );
}
