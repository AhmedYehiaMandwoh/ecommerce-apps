import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta } from "../ui/kit";
import { img } from "../ui/helpers";
import { statuses } from "../shared";

const done = ["DELIVERED", "CANCELLED"];
export function OrdersScreen({ c }: { c: any }) {
  const { orders, user, go, setDetailId, personal, run } = c;
  const [tab, setTab] = useState<"now" | "past">("now");
  const list = orders.filter((o: any) => (tab === "now") === !done.includes(o.status));
  const tone = (s: string) => s === "DELIVERED" ? "bg-green-100 text-green-800" : s === "SHIPPED" ? "bg-blue-100 text-blue-800" : s === "CANCELLED" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800";
  return (
    <View className="bg-white flex-1">
      <View className="bg-brand px-4 pt-3 pb-8"><Text className="text-white text-center text-xl font-extrabold mt-2">طلباتي</Text></View>
      <View className="px-4 -mt-5">
        <View className="flex-row bg-slate-100 rounded-full p-1">
          {([["past", "السابقة"], ["now", "الحالية"]] as const).map(([k, t]) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={t} onPress={() => setTab(k)} className={`flex-1 items-center py-3 rounded-full ${tab === k ? "bg-brand" : ""}`}><Text className={tab === k ? "text-white font-extrabold" : "text-slate-600 font-bold"}>{t}</Text></Pressable>
          ))}
        </View>
        {!user && <Cta title="سجّل الدخول لمتابعة طلباتك" onPress={() => go("phone")} />}
        {user && <Pressable accessibilityRole="button" accessibilityLabel="تحديث" onPress={() => run(() => personal())} className="items-center my-2"><Text className="text-brand text-xs">تحديث</Text></Pressable>}
        {user && !list.length && <Text className="text-center text-slate-500 my-10">{tab === "now" ? "مفيش طلبات حالية." : "مفيش طلبات سابقة."}</Text>}
        {list.map((o: any) => (
          <View key={o.id} className="bg-white rounded-2xl border border-slate-200 p-3 mb-3">
            <View className="flex-row items-center justify-between">
              <Text className={`px-3 py-1 rounded-lg text-xs font-bold ${tone(o.status)}`}>{statuses[o.status]}</Text>
              <View className="flex-row items-center"><View className="items-end ml-2"><Text className="font-extrabold">{o.shop.name}</Text><Text className="text-slate-500 text-xs">طلب تجريبي</Text><Text className="text-slate-500 text-xs">#{o.id.slice(0, 8)}</Text></View><View className="w-10 h-10 rounded-full bg-accent items-center justify-center"><Text className="text-white">🏪</Text></View></View>
            </View>
            <View className="flex-row justify-end my-2">{o.items.slice(0, 3).map((i: any) => <Image key={i.id} source={img(i.offer?.product?.image)} style={{ width: 64, height: 56, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 10, marginLeft: 4 }} />)}</View>
            <Pressable accessibilityRole="button" accessibilityLabel="عرض التفاصيل" onPress={() => { setDetailId(o.id); go("orderdetail"); }}><Text className="text-brand font-bold text-right">‹ عرض التفاصيل</Text></Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
