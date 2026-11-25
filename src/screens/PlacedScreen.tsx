import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Ico } from "../ui/kit";
import { groupByShop, img , thumb} from "../ui/helpers";

export function PlacedScreen({ c }: { c: any }) {
  const { lastPlacedOrder, placedSnapshot, shops, setScreen, go, orders, setDetailId } = c;
  if (!lastPlacedOrder) return null;
  const groups = groupByShop(placedSnapshot, shops);
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header title="تم استلام طلبك" back onBack={() => setScreen("home")} />
      <View className="p-3">
        <View style={{ width: "100%", height: 140, overflow: "hidden" }}><Image source={require("../../assets/ref/confirm.png")} style={{ width: "100%", height: 150, resizeMode: "contain" }} /></View>
        <Text className="text-2xl font-extrabold text-center mt-1">تم استلام طلبك</Text>
        <Text className="text-accent text-lg font-extrabold text-center">طلب تجريبي</Text>
        <Text className="text-center text-slate-600 mt-1">رقم الطلب: {lastPlacedOrder.id.slice(0, 8)}</Text>
        <Text className="bg-brand-light text-brand rounded-xl p-2 text-center my-2 text-sm">ⓘ حالة توضيحية وليست عملية شراء. الدفع كاش عند الاستلام.</Text>
        <Text className="font-extrabold text-right text-lg mb-1">المنتجات من محلات مختلفة</Text>
        {groups.map((g) => (
          <View key={g.shopId} className="flex-row items-center bg-white border border-slate-200 rounded-xl p-1.5 mb-1.5">
            <Text className="text-slate-400 text-xl">‹</Text>
            <View className="flex-row mx-2">{g.items.slice(0, 3).map((i: any) => <Image key={i.offerId} source={thumb(i.image)} style={{ width: 52, height: 44, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 8, marginRight: 3 }} />)}</View>
            <View className="flex-1 items-end"><Text className="font-extrabold text-lg">{g.name}</Text><Text className="text-slate-500 text-xs">{g.items.reduce((a: number, i: any) => a + i.quantity, 0)} منتجات</Text></View>
            <View className="w-9 h-9 rounded-full bg-accent items-center justify-center mr-1"><Ico n="shop" size={20} color="#fff" /></View>
          </View>
        ))}
        <View className="flex-row mt-2" style={{ gap: 10 }}>
          <View className="flex-[1.15]"><Cta title="الرئيسية" soft onPress={() => setScreen("home")} /></View>
          <View className="flex-[1.35]"><Cta title="تتبع الطلب" onPress={() => { const o = orders.find((x: any) => x.checkoutId === lastPlacedOrder.id) || orders[0]; setDetailId(o?.id || ""); go("track"); }} /></View>
        </View>
      </View>
    </View>
  );
}
