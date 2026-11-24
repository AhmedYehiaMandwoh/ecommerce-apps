import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Header, Card } from "../ui/kit";
import { img } from "../ui/helpers";

export function FavoritesScreen({ c }: { c: any }) {
  const { favorites, favorite, api, run, setSelected, go, back } = c;
  return (
    <View className="bg-white flex-1" style={{ minHeight: 600 }}>
      <Header back onBack={back} title="المفضلة" subtitle="القطع والمنتجات المحفوظة" tall />
      <View className="p-4">
        {!favorites.length && <Text className="text-center text-slate-500 my-8">لا توجد عناصر محفوظة</Text>}
        {favorites.map((p: any) => (
          <Card key={p.id} className="flex-row items-center">
            <Pressable accessibilityRole="button" accessibilityLabel={"إزالة " + p.title} onPress={() => favorite(p)} className="w-10 h-10 items-center justify-center"><Text className="text-red-500 text-xl">❤</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={"تفاصيل " + p.title} className="flex-1 flex-row items-center" onPress={() => run(async () => { setSelected(await api("/products/" + p.id)); go("product"); })}>
              <View className="flex-1 items-end mx-2"><Text className="font-bold text-right">{p.title}</Text></View>
              <Image source={img(p.image)} style={{ width: 70, height: 60, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 10 }} />
            </Pressable>
          </Card>
        ))}
      </View>
    </View>
  );
}
