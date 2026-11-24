import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, ErrorNote } from "../ui/kit";
import { groupByShop, img } from "../ui/helpers";
import { money } from "../shared";

export function CheckoutScreen({ c }: { c: any }) {
  const { cart, shops, subtotal, addresses, addressId, deliveryAreas, deliveryAreaId, setDeliveryAreaId, quote, reviewQuote, go, back, count, busy, error, notice } = c;
  const addr = addresses.find((a: any) => a.id === addressId);
  const groups = groupByShop(cart, shops);
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header back onBack={back} title="إتمام الطلب" onCart={() => go("cart")} count={count} />
      <View className="p-3">
        <ErrorNote error={error} notice={notice} />
        <Card className="flex-row items-center bg-slate-50" onPress={() => go("addresses")}>
          <Text className="text-slate-400 text-2xl">‹</Text>
          <View className="flex-1 mx-3 items-end"><Text className="font-extrabold">اختر عنوان التوصيل</Text><Text className="text-slate-500 text-sm" numberOfLines={1}>{addr ? `${addr.label} - ${addr.city}` : "لم يتم اختيار عنوان"}</Text></View>
          <Text className="text-brand text-2xl">📍</Text>
        </Card>
        <Text className="font-extrabold text-right mb-2">المنتجات حسب كل محل</Text>
        {groups.map((g) => (
          <Card key={g.shopId}>
            <View className="flex-row items-center justify-between mb-2"><View className="flex-row">{g.items.slice(0, 4).map((i: any) => <Image key={i.offerId} source={img(i.image)} style={{ width: 58, height: 58, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 10, marginRight: 4 }} />)}</View>
              <View className="flex-row items-center"><Text className="font-extrabold ml-2">{g.name}</Text><View className="w-9 h-9 rounded-xl bg-accent items-center justify-center"><Text className="text-white">🏪</Text></View></View></View>
            <View className="flex-row items-center bg-brand-light rounded-xl p-2"><Text className="text-slate-400 text-xl">‹</Text><View className="flex-1 mx-2 items-end"><Text className="font-bold">خيارات التوصيل</Text><Text className="text-slate-500 text-xs">{quote ? "محسوب حسب المنطقة" : "تحدد بعد اختيار المنطقة"}</Text></View><Text>🚚</Text></View>
          </Card>
        ))}
        <Text className="font-extrabold text-right mb-2">منطقة التوصيل</Text>
        {deliveryAreas.map((a: any) => {
          const on = deliveryAreaId === a.id;
          return (
            <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={`${a.city} ${a.area}`} onPress={() => setDeliveryAreaId(a.id)} className={`flex-row items-center justify-between rounded-xl p-3 mb-2 border-2 ${on ? "border-brand bg-brand-light" : "border-slate-100 bg-slate-50"}`}>
              <Text className="font-bold text-brand">{money(a.fee)}</Text><Text className="font-bold">{a.city} • {a.area}</Text>
            </Pressable>
          );
        })}
        <Card className="bg-slate-50">
          <View className="flex-row justify-between"><Text className="font-bold">{money(subtotal)}</Text><Text className="text-slate-600">سعر المنتجات</Text></View>
          <View className="flex-row justify-between mt-1"><Text className="font-bold">{quote ? money(quote.total - subtotal) : "يحدد حسب العنوان"}</Text><Text className="text-slate-600">التوصيل</Text></View>
          <View className="flex-row justify-between mt-1"><Text className="font-extrabold">{quote ? money(quote.total) : "يظهر بعد تحديد التوصيل"}</Text><Text className="font-extrabold">الإجمالي</Text></View>
        </Card>
        <View className="flex-row items-center bg-slate-50 rounded-xl p-3 mb-1 opacity-60"><Text className="text-slate-400 text-xl">‹</Text><Text className="flex-1 text-right mr-3 text-slate-500">أضف كود خصم • قريبًا 🎟</Text></View>
        <Cta title="راجع التكلفة النهائية" soft disabled={!addressId || !deliveryAreaId || busy} onPress={reviewQuote} />
        <Cta title="متابعة ‹" disabled={!addressId || !deliveryAreaId || !quote} onPress={() => go("payment")} />
      </View>
    </View>
  );
}
