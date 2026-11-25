import { t, cx, isEn } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { art, Ico } from "../ui/kit";

const BRAND = "#0751e8";
const cats: [string, any][] = [
  ['فرامل', require("../../assets/category-brakes.png")], ['زيوت', require("../../assets/category-oil.png")], ['فلاتر', require("../../assets/category-filter.png")],
  ['تعليق', require("../../assets/category-suspension.png")], ['كهرباء', require("../../assets/category-electric.png")], ['إكسسوارات', require("../../assets/category-accessory.png")],
];
export function HomeScreen({ c }: { c: any }) {
  const { go, count, browse, search, history } = c;
  const [q, setQ] = useState("");
  const recent = history.slice(0, 2);
  return (
    <View className={cx("bg-white flex-1")}>
      <View className={cx("bg-brand px-4 pt-3 pb-4")} style={{ borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View className={cx("flex-row items-center justify-between h-12")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('عنوان التوصيل')} onPress={() => go("addresses")}><View className={cx("flex-row items-center")}><Ico n="pin" size={16} color="#fff" /><Text className={cx("text-white text-xs font-bold ml-1")}>{t('حدد موقع التوصيل ⌄')}</Text></View></Pressable>
          <Image source={art.logo} style={{ width: 96, height: 42, resizeMode: "contain" }} />
          <Pressable accessibilityRole="button" accessibilityLabel={t('السلة')} onPress={() => go("cart")} className={cx("w-10 h-10 items-center justify-center")}>
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className={cx("absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center")}><Text className={cx("text-white text-[11px] font-bold")}>{count}</Text></View>}
          </Pressable>
        </View>
        <Text className={cx("text-white text-2xl font-extrabold text-center mt-2")}>{t('بتدور على إيه؟')}</Text>
        <View className={cx("bg-white rounded-full h-10 mt-2 px-4 flex-row items-center")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('بحث')} onPress={() => browse(q, "")}><Ico n="search" size={22} color="#0b2a5b" /></Pressable>
          <TextInput accessibilityLabel={t('البحث')} value={q} onChangeText={setQ} onSubmitEditing={() => browse(q, "")} placeholder={t('ابحث باسم القطعة أو رقمها')} placeholderTextColor="#94a3b8" className={cx("flex-1 text-right text-base")} />
        </View>
      </View>
      <View className={cx("px-4 pt-4")}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('اختر عربيتك')} onPress={() => go("vehicle")} className={cx("flex-row items-center bg-brand-light rounded-2xl p-3")} style={isEn ? { flexDirection: "row" } : undefined}>
          <Image source={art.car} style={{ width: 44, height: 30, resizeMode: "contain" }} />
          <View style={{ width: 1, height: 30, backgroundColor: "#cbd5e1", marginLeft: 12 }} />
          <View className={cx("flex-1 mr-3 ml-3 items-end")}><Text className={cx("font-extrabold text-base text-slate-900")}>{t('اختر عربيتك')}</Text><Text className={cx("text-slate-500 text-xs")}>{t('عشان نعرض لك القطع المناسبة')}</Text></View>
          <Text className={cx("text-slate-900 text-2xl font-bold")}>{"\u200e›"}</Text>
          </Pressable>
        <View className={cx("flex-row items-center justify-between mt-3 mb-2")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('عرض الكل')} onPress={() => browse("", "")} style={{ flexDirection: isEn ? "row-reverse" : "row", alignItems: "center" }}><View style={{ width: 9, height: 9, marginHorizontal: 5, borderColor: BRAND, transform: [{ rotate: "45deg" }], ...(isEn ? { borderRightWidth: 2.5, borderTopWidth: 2.5 } : { borderLeftWidth: 2.5, borderBottomWidth: 2.5 }) }} /><Text className={cx("text-brand text-base font-bold")}>{isEn ? t('عرض الكل') : 'عرض الكل'}</Text></Pressable>
          <Text className={cx("font-extrabold text-lg")}>{t('تصفح الأقسام')}</Text>
        </View>
        <View className={cx("flex-row-reverse flex-wrap justify-between")}>
          {cats.map(([label, image]) => (
            <Pressable key={label} accessibilityRole="button" accessibilityLabel={t(label)} onPress={() => browse("", label)} className={cx("w-[31%] mb-2 items-center bg-orange-50 rounded-2xl overflow-hidden")}>
              <Image source={image} style={{ width: "100%", height: 80, resizeMode: "cover" }} />
              <Text className={cx("font-bold text-sm my-1")}>{t(label)}</Text>
            </Pressable>
          ))}
        </View>
        <Text className={cx("font-extrabold text-lg text-right mt-2 mb-2")}>{t('عمليات البحث الأخيرة')}</Text>
        <View className={cx("flex-row-reverse flex-wrap")}>
          {recent.length === 0 && <Text className={cx("text-slate-400 text-sm")}>{t('لسه ما بحثتش عن حاجة')}</Text>}
          {recent.map((h: string) => (
            <Pressable key={h} accessibilityRole="button" onPress={() => browse(h, "")} className={cx("flex-row-reverse items-center border border-slate-200 rounded-xl px-4 py-3 ml-2 mb-2")}><View className={cx("ml-2")}><Ico n="clock" size={16} color="#475569" /></View><Text className={cx("font-semibold")}>{h}</Text></Pressable>
          ))}
        </View>
        <Text className={cx("text-center text-xs text-slate-400 my-5")}>{t('تصميم مبدئي • بيانات تجريبية • الدفع كاش فقط')}</Text>
      </View>
    </View>
  );
}
