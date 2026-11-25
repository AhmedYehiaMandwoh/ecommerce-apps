import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Ico } from "../ui/kit";
import { img , thumb} from "../ui/helpers";
import { statuses } from "../shared";

const done = ["DELIVERED", "CANCELLED"];
export function OrdersScreen({ c }: { c: any }) {
  const { orders, user, go, setDetailId, personal, run, back, count } = c;
  const [tab, setTab] = useState<"now" | "past">("now");
  const list = orders.filter((o: any) => (tab === "now") === !done.includes(o.status));
  const tone = (s: string) => s === "DELIVERED" ? "bg-green-100 text-green-800" : s === "SHIPPED" ? "bg-blue-100 text-blue-800" : s === "CANCELLED" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800";
  return (
    <View className="bg-white flex-1">
      <Header back onBack={back} onCart={() => go("cart")} count={count} />
      <View className="bg-white rounded-t-3xl -mt-2 pt-3"><Text className="text-slate-900 text-center text-lg font-extrabold">طلباتي</Text></View>
      <View className="px-4 mt-1">
        <View className="flex-row bg-slate-100 rounded-full p-1">
          {([["past", "السابقة"], ["now", "الحالية"]] as const).map(([k, t]) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={t} onPress={() => setTab(k)} className={`flex-1 items-center py-2 rounded-full ${tab === k ? "bg-brand" : ""}`}><Text className={tab === k ? "text-white font-extrabold" : "text-slate-600 font-bold"}>{t}</Text></Pressable>
          ))}
        </View>
        {!user && <Cta title="سجّل الدخول لمتابعة طلباتك" onPress={() => go("phone")} />}
        {user && <Pressable accessibilityRole="button" accessibilityLabel="تحديث" onPress={() => run(() => personal())} className="items-center my-1"><Text className="text-brand text-xs">تحديث</Text></Pressable>}
        {user && !list.length && <Text className="text-center text-slate-500 my-10">{tab === "now" ? "مفيش طلبات حالية." : "مفيش طلبات سابقة."}</Text>}
        {list.map((o: any) => (
          <View key={o.id} className="bg-white rounded-2xl border border-slate-200 p-2 mb-2">
            <View className="flex-row items-center justify-between">
              <Text className={`px-3 py-1 rounded-lg text-xs font-bold ${tone(o.status)}`}>{statuses[o.status]}</Text>
              <View className="flex-row items-center"><View className="items-end ml-2"><Text className="font-extrabold">{o.shop.name}</Text><Text className="text-slate-500 text-xs">طلب تجريبي</Text><Text className="text-slate-500 text-xs">#{o.id.slice(0, 8)}</Text></View><View className="w-12 h-12 rounded-full bg-accent items-center justify-center"><Ico n="shop" size={26} color="#fff" /></View></View>
            </View>
            <View className="flex-row justify-start my-1">{o.items.slice(0, 3).map((i: any) => <Image key={i.id} source={thumb(i.offer?.product?.image)} style={{ width: 60, height: 50, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 10, marginLeft: 4 }} />)}</View>
            <Pressable accessibilityRole="button" accessibilityLabel="عرض التفاصيل" onPress={() => { setDetailId(o.id); go("orderdetail"); }}><Text className="text-brand font-bold text-left">‹ عرض التفاصيل</Text></Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
