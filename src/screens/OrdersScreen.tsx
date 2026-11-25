import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Ico } from "../ui/kit";
import { img , thumb} from "../ui/helpers";
import { statuses } from "../shared";

const done = ["DELIVERED", "CANCELLED"];
export function OrdersScreen({ c }: { c: any }) {
  const { orders, user, go, setDetailId, personal, run, back, count } = c;
  const [tab, setTab] = useState<"now" | "past">("now");
  useEffect(() => { if (user) run(() => personal()); }, []);
  const list = orders.filter((o: any) => (tab === "now") === !done.includes(o.status));
  const tone = (s: string) => s === "DELIVERED" ? "bg-green-100 text-green-800" : s === "SHIPPED" ? "bg-blue-100 text-blue-800" : s === "CANCELLED" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800";
  return (
    <View className="bg-white flex-1">
      <Header back onBack={back} onCart={() => go("cart")} count={count} />
      <View className="bg-white rounded-t-3xl -mt-2 pt-3"><Text className="text-slate-900 text-center text-lg font-extrabold">طلباتي</Text></View>
      <View className="px-4 mt-1">
        <View className="flex-row bg-slate-100 rounded-full p-1">
          {([["past", "السابقة"], ["now", "الحالية"]] as const).map(([k, t]) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={t} onPress={() => setTab(k)} className={`flex-1 items-center py-1 rounded-full ${tab === k ? "bg-brand" : ""}`}><Text className={tab === k ? "text-white font-extrabold" : "text-slate-600 font-bold"}>{t}</Text></Pressable>
          ))}
        </View>
        {!user && <Cta title="سجّل الدخول لمتابعة طلباتك" onPress={() => go("phone")} />}
                {user && !list.length && <Text className="text-center text-slate-500 my-10">{tab === "now" ? "مفيش طلبات حالية." : "مفيش طلبات سابقة."}</Text>}
        {list.map((o: any) => (
          <View key={o.id} className="bg-white rounded-2xl px-2.5 pt-1.5 pb-1 mb-2" style={{ borderWidth: 1, borderColor: "#eef2f7", shadowColor: "#0f172a", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
            <View className="flex-row items-start justify-between">
              <Text numberOfLines={1} className={`px-3 py-1 rounded-lg text-xs font-bold ${tone(o.status)}`} style={{ flexShrink: 0 }}>{statuses[o.status]}</Text>
              <View className="flex-row items-center flex-1 justify-end min-w-0"><View className="items-end ml-2 flex-1 min-w-0"><Text numberOfLines={1} className="font-extrabold text-[15px]">{o.shop.name}</Text><Text className="text-slate-500 text-[11px]" style={{ lineHeight: 14 }}>طلب تجريبي</Text><Text className="text-slate-500 text-[11px]" style={{ lineHeight: 14 }}>{o.id.slice(0, 8)}</Text></View><View className="w-10 h-10 rounded-full bg-accent items-center justify-center"><Ico n="shop" size={22} color="#fff" /></View></View>
            </View>
            <View className="flex-row justify-start my-0.5">{o.items.slice(0, 2).map((i: any) => <Image key={i.id} source={thumb(i.offer?.product?.image)} style={{ width: 84, height: 54, resizeMode: "contain", backgroundColor: "#f8fafc", borderRadius: 8, marginLeft: 6 }} />)}{o.items.length > 2 && <View style={{ width: 52, height: 54, borderRadius: 8, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center", marginLeft: 6 }}><Text className="text-slate-600 font-extrabold">+{o.items.length - 2}</Text></View>}</View>
            <Pressable accessibilityRole="button" accessibilityLabel="عرض التفاصيل" onPress={() => { setDetailId(o.id); go("orderdetail"); }}><View className="flex-row items-center justify-start"><Ico n="chev" size={16} color="#0751e8" /><Text className="text-brand font-bold ml-1">عرض التفاصيل</Text></View></Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
