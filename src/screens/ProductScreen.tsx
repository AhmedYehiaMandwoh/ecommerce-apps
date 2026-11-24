import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Stepper, Card, art, Ico } from "../ui/kit";
import { img } from "../ui/helpers";
import { money } from "../shared";

export function ProductScreen({ c }: { c: any }) {
  const { selected, addMany, favorite, favorites, go, back, count, user, vehicles } = c;
  const qty: number = c.productQty; const setQty = c.setProductQty;
  const [tab, setTab] = useState<"details" | "shop">("details");
  if (!selected) return null;
  const offer = selected.offers[0];
  const fav = favorites.some((f: any) => f.id === selected.id);
  return (
    <View className="bg-white flex-1">
      <View className="bg-brand px-4 pt-3 pb-2">
        <View className="flex-row items-center justify-between h-12">
          <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={back} className="w-10"><Text className="text-white text-3xl">‹</Text></Pressable>
          <Image source={art.logo} style={{ width: 92, height: 40, resizeMode: "contain" }} />
          <Pressable accessibilityRole="button" accessibilityLabel="السلة" onPress={() => go("cart")} className="w-10 h-10 items-center justify-center">
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className="absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center"><Text className="text-white text-[11px] font-bold">{count}</Text></View>}
          </Pressable>
        </View>
      </View>
      <View style={{ overflow: "hidden", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Image source={img(selected.image)} style={{ width: "100%", height: 250, resizeMode: "contain", backgroundColor: "#f3f1ee" }} />
        <Pressable accessibilityRole="button" accessibilityLabel="حفظ / إزالة من المفضلة" onPress={() => favorite(selected)} className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white items-center justify-center"><Text className="text-xl">{fav ? "❤" : "♡"}</Text></Pressable>
      </View>
      <View className="px-4 pt-3">
        <Text className="text-2xl font-extrabold text-right">{selected.title}</Text>
        <Text className="text-slate-500 text-right">من {offer?.shop?.name} • {selected.brand} • {selected.partNumber}</Text>
        {offer && <Text className="text-accent text-2xl font-extrabold text-right mt-1">{money(offer.price)}</Text>}
        <View className="my-2 items-start"><Stepper value={qty} onMinus={() => setQty(Math.max(1, qty - 1))} onPlus={() => setQty(Math.min(offer?.stock || 1, qty + 1))} /></View>
        <Card className="flex-row items-center" onPress={() => offer && go("shops")}>
          <Text className="text-slate-400 text-2xl">‹</Text>
          <View className="flex-1 mx-3 items-end"><Text className="font-extrabold">{offer?.shop?.name}</Text><Text className="text-slate-500 text-sm">قطع غيار وصيانة • {offer?.shop?.city}</Text></View>
          <View className="w-11 h-11 rounded-full bg-slate-700 items-center justify-center"><Ico n="shop" size={24} color="#fff" /></View>
        </Card>
        <Card className="bg-brand-light border-brand-light">
          <View className="flex-row items-center">
            <Text className="text-brand text-2xl">‹</Text>
            <View className="flex-1 mx-3"><Text className="font-extrabold text-base text-right">هل القطعة مناسبة لعربيتك؟</Text><Text className="text-slate-600 text-sm text-right">راجع رقم القطعة مع البائع</Text></View>
            <Ico n="car" size={36} />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="اختر عربيتك" onPress={() => go(user ? "vehicle" : "phone")} className="bg-white border border-brand rounded-xl py-3 mt-3 items-center"><View className="flex-row items-center"><Ico n="car" size={22} color="#0751e8" /><Text className="text-brand font-extrabold mr-2">{vehicles.length ? "غيّر عربيتك" : "اختر عربيتك"}</Text></View></Pressable>
        </Card>
        <Card className="flex-row items-center justify-between"><Text className="font-bold">جديد</Text><Text className="text-slate-500">حالة القطعة ⚙</Text></Card>
        <View className="flex-row border-b border-slate-200">
          {([["shop", "المتجر"], ["details", "التفاصيل"]] as const).map(([k, t]) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={t} onPress={() => setTab(k)} className={`flex-1 items-center py-3 ${tab === k ? "border-b-4 border-brand" : ""}`}><Text className={tab === k ? "text-brand font-extrabold" : "text-slate-500 font-bold"}>{t}</Text></Pressable>
          ))}
        </View>
        {tab === "details" ? (
          <Text className="text-right text-slate-700 leading-7 my-3">{selected.description}</Text>
        ) : (
          <View className="my-3">
            {selected.offers.map((o: any) => (
              <Card key={o.id} className="flex-row items-center justify-between">
                <Pressable accessibilityRole="button" accessibilityLabel={"أضف من " + o.shop.name} disabled={!o.stock} onPress={() => addMany(selected, o, qty)} className={`px-4 py-2 rounded-xl bg-accent ${o.stock ? "" : "opacity-40"}`}><Text className="text-white font-bold">{o.stock ? "أضف" : "غير متوفر"}</Text></Pressable>
                <View className="items-end"><Text className="font-extrabold">{o.shop.name}</Text><Text className="text-slate-500 text-xs">{o.shop.city} • المتاح {o.stock}</Text><Text className="text-accent font-bold">{money(o.price)}</Text></View>
              </Card>
            ))}
          </View>
        )}
        <View className="h-6" />
      </View>
    </View>
  );
}
