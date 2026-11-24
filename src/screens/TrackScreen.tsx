import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header } from "../ui/kit";
import { img } from "../ui/helpers";
import { statuses } from "../shared";

const steps = [["PLACED", "تم الطلب"], ["PREPARING", "جار التجهيز"], ["SHIPPED", "خرج للتوصيل"], ["DELIVERED", "تم التسليم"]];
export function TrackScreen({ c }: { c: any }) {
  const { orders, detailId, back, go, count } = c;
  const o = orders.find((x: any) => x.id === detailId) || orders[0];
  if (!o) return <View className="bg-white flex-1"><Header back onBack={back} title="تتبع الطلب" /><Text className="text-center text-slate-500 my-10">مفيش طلب لعرضه.</Text></View>;
  const idx = Math.max(0, steps.findIndex(([k]) => k === (o.status === "ACCEPTED" ? "PLACED" : o.status)));
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header back onBack={back} title="تتبع الطلب" onCart={() => go("cart")} count={count} />
      <View className="p-3">
        <Image source={require("../../assets/ref/track-map.png")} style={{ width: "100%", height: 150, resizeMode: "cover", borderRadius: 14 }} />
        <View className="flex-row items-center bg-brand-light rounded-2xl p-3 my-3">
          <View className="flex-1 items-end"><Text className="text-xl font-extrabold">{statuses[o.status]}</Text><Text className="text-slate-500 text-xs">حالة توضيحية • #{o.id.slice(0, 8)}</Text></View>
          <Text className="text-3xl mr-3">🚚</Text>
        </View>
        <View className="flex-row-reverse justify-between mb-4">
          {steps.map(([k, t], n) => (
            <View key={k} className="items-center flex-1">
              <View className={`w-7 h-7 rounded-full items-center justify-center ${n <= idx ? "bg-brand" : "bg-slate-300"}`}><Text className="text-white text-xs">{n <= idx ? "✓" : ""}</Text></View>
              <Text className="text-xs mt-1 text-center">{t}</Text>
            </View>
          ))}
        </View>
        <Text className="font-extrabold text-right mb-2">محتويات الطلب</Text>
        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl p-2 mb-2">
          <Text className="text-slate-400 text-xl">‹</Text>
          <View className="flex-row mx-2">{o.items.slice(0, 3).map((i: any) => <Image key={i.id} source={img(i.offer?.product?.image)} style={{ width: 44, height: 44, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 8, marginRight: 3 }} />)}</View>
          <View className="flex-1 items-end"><Text className="font-extrabold">{o.shop.name}</Text><Text className="text-slate-500 text-xs">{o.items.length} قطع</Text></View>
        </View>
        <View className="flex-row mt-2">
          <View className="flex-1 ml-2"><Cta title="تواصل مع الدعم 🎧" outline onPress={() => go("support")} /></View>
          <View className="flex-1"><Cta title="تفاصيل الطلب" onPress={() => go("orderdetail")} /></View>
        </View>
      </View>
    </View>
  );
}
