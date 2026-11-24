import React from "react";
import { View, Text, Image, Pressable, ScrollView, TextInput } from "react-native";
import { Chip, art } from "../ui/kit";
import { img, shopPhoto } from "../ui/helpers";
import { money } from "../shared";

export function ShopScreen({ c }: { c: any }) {
  const { products, shops, shop, categories, category, setCategory, load, add, go, back, count, setSelected, favorite, favorites } = c;
  const s = shops.find((x: any) => x.id === shop);
  const n = Math.max(0, shops.findIndex((x: any) => x.id === shop));
  const list = products.filter((p: any) => p.offers.some((o: any) => o.shopId === shop));
  return (
    <View className="bg-white flex-1">
      <View className="bg-brand px-4 pt-3 pb-3">
        <View className="flex-row items-center justify-between h-12">
          <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={back} className="w-10"><Text className="text-white text-3xl">‹</Text></Pressable>
          <Image source={art.logo} style={{ width: 92, height: 40, resizeMode: "contain" }} />
          <Pressable accessibilityRole="button" accessibilityLabel="السلة" onPress={() => go("cart")} className="w-10 h-10 items-center justify-center">
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className="absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center"><Text className="text-white text-[11px] font-bold">{count}</Text></View>}
          </Pressable>
        </View>
        <View className="bg-white rounded-full h-11 mt-1 px-4 justify-center"><Text className="text-right text-slate-400">ابحث باسم القطعة أو رقمها 🔍</Text></View>
      </View>
      <Image source={shopPhoto(n)} style={{ width: "100%", height: 130, resizeMode: "cover" }} />
      <View className="flex-row-reverse items-center px-4 -mt-7" style={{ zIndex: 2, position: "relative" }}>
        <View className="w-20 h-20 rounded-full bg-orange-50 border-4 border-white items-center justify-center"><Text className="text-4xl">🏪</Text></View>
        <View className="mr-3 mt-6 items-end"><Text className="text-2xl font-extrabold">{s?.name || "المحل"}</Text><Text className="text-slate-500">قطع غيار وصيانة</Text></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-3 flex-grow-0">
        {["", ...categories].map((k: string) => <Chip key={k || "all"} title={k || "الكل"} active={category === k} onPress={() => { setCategory(k); load(k); }} />)}
      </ScrollView>
      <View className="flex-row flex-wrap justify-between px-4 mt-3">
        {list.map((p: any) => {
          const o = p.offers.find((x: any) => x.shopId === shop);
          return (
            <View key={p.id} className="w-[48%] bg-white rounded-2xl border border-slate-200 mb-3 overflow-hidden">
              <Pressable accessibilityRole="button" accessibilityLabel={"مفضلة " + p.title} onPress={() => favorite(p)} className="absolute z-10 top-2 left-2"><Text className="text-lg">{favorites.some((f: any) => f.id === p.id) ? "❤" : "♡"}</Text></Pressable>
              <Image source={img(p.image)} style={{ width: "100%", height: 110, resizeMode: "contain", backgroundColor: "#fbf4ec" }} />
              <View className="p-2 items-end"><Text className="font-bold text-sm text-right" numberOfLines={2}>{p.title}</Text></View>
              <View className="flex-row items-center justify-between p-2">
                <Pressable accessibilityRole="button" accessibilityLabel={"أضف " + p.title} onPress={() => add(p, o)} className="z-10 w-9 h-9 rounded-full bg-accent items-center justify-center"><Text className="text-white text-xl">+</Text></Pressable>
                <Text className="text-accent font-extrabold">{money(o.price)}</Text>
              </View>
            <Pressable accessibilityRole="button" accessibilityLabel={p.title} onPress={() => { setSelected({ ...p, offers: p.offers.filter((x: any) => x.shopId === shop) }); go("product"); }} className="absolute inset-0 z-[5]" />
            </View>
          );
        })}
      </View>
      {!list.length && <Text className="text-center text-slate-500 my-8">لا توجد منتجات في هذا القسم.</Text>}
    </View>
  );
}
