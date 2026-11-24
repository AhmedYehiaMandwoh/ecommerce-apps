import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { shopPhoto } from "../ui/helpers";
import { Ico } from "../ui/kit";

export function ShopsScreen({ c }: { c: any }) {
  const { shops, browse, back } = c;
  const [q, setQ] = useState("");
  const list = shops.filter((s: any) => !q || s.name.includes(q));
  return (
    <View className="bg-white flex-1">
      <View className="bg-brand px-4 pt-3 pb-3">
        <View className="flex-row items-center justify-between h-10">
          <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={back} className="w-10"><Text className="text-white text-3xl">‹</Text></Pressable>
          <Text className="text-white text-2xl font-extrabold">المحلات</Text>
          <View className="w-10" />
        </View>
        <View className="bg-white rounded-full h-12 mt-2 px-4 flex-row items-center">
          <TextInput accessibilityLabel="ابحث باسم المحل" value={q} onChangeText={setQ} placeholder="ابحث باسم المحل" placeholderTextColor="#94a3b8" className="flex-1 text-right text-base" />
          <Text className="text-lg ml-2">🔍</Text>
        </View>
        <View className="flex-row-reverse mt-3">
          {["الأقرب", "التخصص", "الترتيب"].map((t) => <View key={t} className="bg-white rounded-2xl py-2 ml-2 flex-1 items-center"><Text className="font-extrabold text-slate-800 text-base">{t}  ⌄</Text></View>)}
        </View>
      </View>
      <View className="p-3">
        {list.map((s: any, n: number) => (
          <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={s.name} onPress={() => browse("", "", s.id)} className="bg-white rounded-2xl border border-slate-200 mb-3 overflow-hidden">
            <Image source={shopPhoto(n)} style={{ width: "100%", height: 96, resizeMode: "cover" }} />
            <View className="flex-row items-center px-3 py-1.5">
              <View className="w-12 h-12 rounded-full bg-accent items-center justify-center"><Ico n="shop" size={30} color="#fff" /></View>
              <View className="flex-1 mx-3 items-start"><Text className="font-extrabold text-lg">{s.name}</Text><Text className="text-slate-500 text-sm">قطع غيار وصيانة • {s.city}</Text></View>
              <Text className="text-slate-500 text-3xl">›</Text>
            </View>
          </Pressable>
        ))}
        {!list.length && <Text className="text-center text-slate-500 my-10">مفيش محلات مطابقة.</Text>}
      </View>
    </View>
  );
}
