import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { shopPhoto } from "../ui/helpers";

export function ShopsScreen({ c }: { c: any }) {
  const { shops, browse, back } = c;
  const [q, setQ] = useState("");
  const list = shops.filter((s: any) => !q || s.name.includes(q));
  return (
    <View className="bg-white flex-1">
      <View className="bg-brand px-4 pt-3 pb-4">
        <View className="flex-row items-center justify-between h-10">
          <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={back} className="w-10"><Text className="text-white text-3xl">‹</Text></Pressable>
          <Text className="text-white text-xl font-extrabold">المحلات</Text>
          <View className="w-10" />
        </View>
        <View className="bg-white rounded-full h-12 mt-2 px-4 flex-row items-center">
          <TextInput accessibilityLabel="ابحث باسم المحل" value={q} onChangeText={setQ} placeholder="ابحث باسم المحل" placeholderTextColor="#94a3b8" className="flex-1 text-right text-base" />
          <Text className="text-lg ml-2">🔍</Text>
        </View>
        <View className="flex-row-reverse mt-3">
          {["الأقرب", "التخصص", "الترتيب"].map((t) => <View key={t} className="bg-white rounded-xl px-4 py-2 ml-2"><Text className="font-bold text-slate-700">{t} ⌄</Text></View>)}
        </View>
      </View>
      <View className="p-4">
        {list.map((s: any, n: number) => (
          <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={s.name} onPress={() => browse("", "", s.id)} className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-hidden">
            <Image source={shopPhoto(n)} style={{ width: "100%", height: 130, resizeMode: "cover" }} />
            <View className="flex-row items-center p-3">
              <Text className="text-slate-400 text-2xl">‹</Text>
              <View className="flex-1 mx-3 items-end"><Text className="font-extrabold text-base">{s.name}</Text><Text className="text-slate-500 text-sm">قطع غيار وصيانة • {s.city}</Text></View>
              <View className="w-12 h-12 rounded-full bg-accent items-center justify-center"><Text className="text-white text-xl">🏪</Text></View>
            </View>
          </Pressable>
        ))}
        {!list.length && <Text className="text-center text-slate-500 my-10">مفيش محلات مطابقة.</Text>}
      </View>
    </View>
  );
}
