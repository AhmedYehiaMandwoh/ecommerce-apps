import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Ico } from "../ui/kit";
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
      <View className="p-3" style={{ minHeight: 400 }}>
        <View><Image source={require("../../assets/ref/track-map.png")} style={{ width: "100%", height: 150, resizeMode: "cover", borderRadius: 16 }} /><Text className="absolute bottom-2 left-2 bg-white/90 text-slate-700 text-xs px-2 py-1 rounded-lg">رسم توضيحي ثابت، ليس تتبعًا مباشرًا</Text></View>
        <View className="flex-row items-center bg-brand-light rounded-2xl p-3 my-2">
          <View className="w-14 h-14 rounded-full bg-white items-center justify-center"><Ico n="truck" size={38} color="#0751e8" /></View>
          <View className="flex-1 items-end"><Text className="text-xl font-extrabold text-brand-dark" style={{ color: "#0b3fb8" }}>{statuses[o.status]}</Text><Text className="text-slate-600 text-sm">حالة توضيحية • #{o.id.slice(0, 8)}</Text></View>
        </View>
        <View className="mb-4" style={{ paddingTop: 2 }}>
          <View style={{ position: "absolute", top: 13, left: "12%", right: "12%", height: 3, backgroundColor: "#cbd5e1" }} />
          <View className="flex-row-reverse justify-between">
          {steps.map(([k, t], n) => (
            <View key={k} className="items-center flex-1">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${n <= idx ? "bg-brand" : "bg-slate-300"}`}><Text className="text-white text-sm">{n <= idx ? "✓" : ""}</Text></View>
              <Text className={`text-xs mt-1 text-center ${n <= idx ? "font-bold" : ""}`}>{t}</Text>
            </View>
          ))}
          </View>
        </View>
        <Text className="font-extrabold text-right mb-2">محتويات الطلب</Text>
        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl p-2 mb-2">
          <Text className="text-slate-400 text-xl">‹</Text>
          <View className="flex-row mx-2">{o.items.slice(0, 3).map((i: any) => <Image key={i.id} source={img(i.offer?.product?.image)} style={{ width: 44, height: 44, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 8, marginRight: 3 }} />)}</View>
          <View className="flex-1 items-end"><Text className="font-extrabold">{o.shop.name}</Text><Text className="text-slate-500 text-xs">{o.items.length} قطع</Text></View>
        </View>
        <View className="flex-row" style={{ gap: 10, marginTop: 16, marginBottom: 8 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="تواصل مع الدعم 🎧" onPress={() => go("support")} className="flex-1 bg-white border-2 border-brand rounded-2xl items-center justify-center" style={{ height: 52 }}><Text className="text-brand font-extrabold text-base">تواصل مع الدعم 🎧</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="تفاصيل الطلب" onPress={() => go("orderdetail")} className="flex-1 bg-accent rounded-2xl items-center justify-center" style={{ height: 52 }}><Text className="text-white font-extrabold text-base">تفاصيل الطلب</Text></Pressable>
        </View>
      </View>
    </View>
  );
}
