import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Stepper, Card, Ico } from "../ui/kit";
import { groupByShop, img } from "../ui/helpers";
import { money } from "../shared";

function Trash() {
  const g = "#6b7280";
  return (
    <View style={{ width: 26, height: 28, alignItems: "center" }}>
      <View style={{ width: 10, height: 4, borderWidth: 2, borderBottomWidth: 0, borderColor: g, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
      <View style={{ width: 24, height: 3, backgroundColor: g, borderRadius: 2 }} />
      <View style={{ width: 18, height: 18, borderWidth: 2.5, borderTopWidth: 0, borderColor: g, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, flexDirection: "row", justifyContent: "space-evenly", paddingTop: 3 }}>
        <View style={{ width: 2, height: 9, backgroundColor: g, borderRadius: 1 }} /><View style={{ width: 2, height: 9, backgroundColor: g, borderRadius: 1 }} />
      </View>
    </View>
  );
}
export function CartScreen({ c }: { c: any }) {
  const { cart, setCart, shops, subtotal, go, back, count, user, key } = c;
  const groups = groupByShop(cart, shops);
  const upd = (offerId: string, d: number) => { key.current = ""; setCart(cart.map((i: any) => i.offerId === offerId ? { ...i, quantity: Math.max(1, Math.min(i.stock, i.quantity + d)) } : i)); };
  const del = (offerId: string) => { key.current = ""; setCart(cart.filter((i: any) => i.offerId !== offerId)); };
  return (
    <View className="bg-white flex-1" style={{ minHeight: 700 }}>
      <Header back onBack={back} onCart={() => {}} count={count} />
      <View className="p-2">
        <Text className="text-center font-extrabold text-lg mb-1">السلة</Text>
        {!cart.length && <Text className="text-center text-slate-500 my-10">السلة فاضية.</Text>}
        {groups.map((g) => (
          <Card key={g.shopId} className="bg-slate-50 p-2 mb-2">
            <View className="flex-row items-center bg-slate-50 rounded-xl p-2 mb-1">
              <View className="w-9 h-9 rounded-xl bg-slate-700 items-center justify-center"><Ico n="shop" size={24} color="#fff" /></View>
              <View className="flex-1 mx-2 items-end"><Text className="font-extrabold text-lg">{g.name}</Text><Text className="text-slate-500 text-sm">قطع غيار وصيانة</Text></View>
              <Text className="text-slate-700 text-3xl">›</Text>
            </View>
            {g.items.map((i: any) => (
              <View key={i.offerId} className="flex-row items-center py-1">
                <Pressable accessibilityRole="button" accessibilityLabel={"حذف " + i.title} onPress={() => del(i.offerId)} className="w-9 h-9 items-center justify-center"><Trash /></Pressable>
                <Image source={img(i.image)} style={{ width: 104, height: 76, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 12, marginLeft: 4 }} />
                <View className="flex-1 min-w-0 mx-2 items-end">
                  <Text className="font-extrabold text-right text-base" numberOfLines={2} accessibilityLabel={i.title}>{i.title}</Text>
                  <Text className="text-accent font-extrabold text-lg">{money(i.price)}</Text>
                  <Stepper value={i.quantity} onMinus={() => upd(i.offerId, -1)} onPlus={() => upd(i.offerId, 1)} />
                </View>
              </View>
            ))}
          </Card>
        ))}
        {!!cart.length && (
          <>
            <Card className="p-2 mb-2"><View className="flex-row justify-between"><Text className="text-xl font-extrabold">{money(subtotal)}</Text><Text className="text-slate-600">إجمالي المنتجات</Text></View>
              <View className="flex-row justify-between mt-2"><View className="flex-row items-center"><Text className="font-bold text-slate-700">يحدد عند إتمام الطلب</Text><Text className="text-slate-500 text-lg ml-1">🚚</Text></View><Text className="text-slate-600">مصاريف التوصيل</Text></View></Card>
            {groups.length > 1 && <Text className="bg-amber-100 text-amber-900 rounded-xl p-2 text-right mb-1 font-semibold">قد تصل منتجات كل محل في شحنة منفصلة.</Text>}
            <Cta title="متابعة الطلب" onPress={() => go(user ? "checkout" : "phone")} />
          </>
        )}
      </View>
    </View>
  );
}
