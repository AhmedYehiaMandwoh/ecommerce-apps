import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { art, Ico } from "../ui/kit";

const cats: [string, any][] = [
  ["فرامل", require("../../assets/category-brakes.png")], ["زيوت", require("../../assets/category-oil.png")], ["فلاتر", require("../../assets/category-filter.png")],
  ["تعليق", require("../../assets/category-suspension.png")], ["كهرباء", require("../../assets/category-electric.png")], ["إكسسوارات", require("../../assets/category-accessory.png")],
];
export function HomeScreen({ c }: { c: any }) {
  const { go, count, browse, search, history } = c;
  const [q, setQ] = useState("");
  const recent = history.slice(0, 2);
  return (
    <View className="bg-white flex-1">
      <View className="bg-brand px-4 pt-3 pb-4" style={{ borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View className="flex-row items-center justify-between h-12">
          <Pressable accessibilityRole="button" accessibilityLabel="عنوان التوصيل" onPress={() => go("addresses")}><View className="flex-row items-center"><Ico n="pin" size={16} color="#fff" /><Text className="text-white text-xs font-bold ml-1">حدد موقع التوصيل ⌄</Text></View></Pressable>
          <Image source={art.logo} style={{ width: 96, height: 42, resizeMode: "contain" }} />
          <Pressable accessibilityRole="button" accessibilityLabel="السلة" onPress={() => go("cart")} className="w-10 h-10 items-center justify-center">
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className="absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center"><Text className="text-white text-[11px] font-bold">{count}</Text></View>}
          </Pressable>
        </View>
        <Text className="text-white text-3xl font-extrabold text-center mt-2">بتدور على إيه؟</Text>
        <View className="bg-white rounded-full h-12 mt-3 px-4 flex-row items-center">
          <Pressable accessibilityRole="button" accessibilityLabel="بحث" onPress={() => browse(q, "")}><Ico n="search" size={22} color="#0b2a5b" /></Pressable>
          <TextInput accessibilityLabel="البحث" value={q} onChangeText={setQ} onSubmitEditing={() => browse(q, "")} placeholder="ابحث باسم القطعة أو رقمها" placeholderTextColor="#94a3b8" className="flex-1 text-right text-base" />
        </View>
      </View>
      <View className="px-4 pt-4">
        <Pressable accessibilityRole="button" accessibilityLabel="اختر عربيتك" onPress={() => go("vehicle")} className="flex-row items-center bg-brand-light rounded-2xl p-3">
          <Image source={art.car} style={{ width: 44, height: 30, resizeMode: "contain" }} />
          <View style={{ width: 1, height: 30, backgroundColor: "#cbd5e1", marginLeft: 12 }} />
          <View className="flex-1 mr-3 ml-3 items-end"><Text className="font-extrabold text-base text-slate-900">اختر عربيتك</Text><Text className="text-slate-500 text-xs">عشان نعرض لك القطع المناسبة</Text></View>
          <Text className="text-slate-900 text-2xl font-bold">›</Text>
          </Pressable>
        <View className="flex-row items-center justify-between mt-3 mb-2">
          <Pressable accessibilityRole="button" onPress={() => browse("", "")}><Text className="text-brand text-base font-bold">‹ عرض الكل</Text></Pressable>
          <Text className="font-extrabold text-lg">تصفح الأقسام</Text>
        </View>
        <View className="flex-row-reverse flex-wrap justify-between">
          {cats.map(([label, image]) => (
            <Pressable key={label} accessibilityRole="button" accessibilityLabel={label} onPress={() => browse("", label)} className="w-[31%] mb-2 items-center bg-orange-50 rounded-2xl overflow-hidden">
              <Image source={image} style={{ width: "100%", height: 80, resizeMode: "cover" }} />
              <Text className="font-bold text-sm my-1">{label}</Text>
            </Pressable>
          ))}
        </View>
        <Text className="font-extrabold text-lg text-right mt-2 mb-2">عمليات البحث الأخيرة</Text>
        <View className="flex-row-reverse flex-wrap">
          {recent.length === 0 && <Text className="text-slate-400 text-sm">لسه ما بحثتش عن حاجة</Text>}
          {recent.map((h: string) => (
            <Pressable key={h} accessibilityRole="button" onPress={() => browse(h, "")} className="flex-row-reverse items-center border border-slate-200 rounded-xl px-4 py-3 ml-2 mb-2"><Text className="ml-2">🕘</Text><Text className="font-semibold">{h}</Text></Pressable>
          ))}
        </View>
        <Text className="text-center text-xs text-slate-400 my-5">تصميم مبدئي • بيانات تجريبية • الدفع كاش فقط</Text>
      </View>
    </View>
  );
}
