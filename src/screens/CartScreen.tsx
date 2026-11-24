import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Stepper, Card, Ico } from "../ui/kit";
import { groupByShop, img } from "../ui/helpers";
import { money } from "../shared";

export function CartScreen({ c }: { c: any }) {
  const { cart, setCart, shops, subtotal, go, back, count, user, key } = c;
  const groups = groupByShop(cart, shops);
  const upd = (offerId: string, d: number) => { key.current = ""; setCart(cart.map((i: any) => i.offerId === offerId ? { ...i, quantity: Math.max(1, Math.min(i.stock, i.quantity + d)) } : i)); };
  const del = (offerId: string) => { key.current = ""; setCart(cart.filter((i: any) => i.offerId !== offerId)); };
  return (
    <View className="bg-white flex-1" style={{ minHeight: 700 }}>
      <Header back onBack={back} onCart={() => {}} count={count} />
      <View className="p-3">
        <Text className="text-center font-extrabold text-lg mb-2">السلة</Text>
        {!cart.length && <Text className="text-center text-slate-500 my-10">السلة فاضية.</Text>}
        {groups.map((g) => (
          <Card key={g.shopId} className="bg-slate-50">
            <View className="flex-row items-center bg-slate-100 rounded-xl p-2 mb-2">
              <Text className="text-slate-400 text-xl">‹</Text>
              <View className="flex-1 mx-2 items-end"><Text className="font-extrabold">{g.name}</Text><Text className="text-slate-500 text-xs">قطع غيار وصيانة</Text></View>
              <View className="w-9 h-9 rounded-full bg-slate-700 items-center justify-center"><Ico n="shop" size={22} color="#fff" /></View>
            </View>
            {g.items.map((i: any) => (
              <View key={i.offerId} className="flex-row items-center py-2">
                <Pressable accessibilityRole="button" accessibilityLabel={"حذف " + i.title} onPress={() => del(i.offerId)} className="w-9 h-9 items-center justify-center"><Text className="text-slate-400 text-xl">🗑</Text></Pressable>
                <View className="flex-1 mx-2 items-end">
                  <Text className="font-bold text-right">{i.title}</Text>
                  <Text className="text-accent font-extrabold">{money(i.price)}</Text>
                  <Stepper value={i.quantity} onMinus={() => upd(i.offerId, -1)} onPlus={() => upd(i.offerId, 1)} />
                </View>
                <Image source={img(i.image)} style={{ width: 92, height: 76, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 12 }} />
              </View>
            ))}
          </Card>
        ))}
        {!!cart.length && (
          <>
            <Card><View className="flex-row justify-between"><Text className="text-xl font-extrabold">{money(subtotal)}</Text><Text className="text-slate-600">إجمالي المنتجات</Text></View>
              <View className="flex-row justify-between mt-2"><Text className="font-bold text-slate-700">يحدد عند إتمام الطلب</Text><Text className="text-slate-600">مصاريف التوصيل</Text></View></Card>
            {groups.length > 1 && <Text className="bg-amber-50 text-amber-900 rounded-xl p-3 text-right mb-2">ⓘ قد تصل منتجات كل محل في شحنة منفصلة.</Text>}
            <Cta title="متابعة الطلب" onPress={() => go(user ? "checkout" : "phone")} />
          </>
        )}
      </View>
    </View>
  );
}
