import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, Input, ErrorNote } from "../ui/kit";
import { groupByShop, img } from "../ui/helpers";
import { money } from "../shared";

export function CheckoutScreen({ c }: { c: any }) {
  const { discountCode, setDiscountCode, cart, shops, subtotal, addresses, addressId, deliveryAreas, deliveryAreaId, setDeliveryAreaId, quote, reviewQuote, go, back, count, busy, error, notice } = c;
  const addr = addresses.find((a: any) => a.id === addressId);
  const groups = groupByShop(cart, shops);
  const [codeOpen, setCodeOpen] = React.useState(false);
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header small back onBack={back} title="إتمام الطلب" onCart={() => go("cart")} count={count} />
      <View className="p-3">
        <ErrorNote error={error} notice={notice} />
        <Card className="bg-slate-50">
          <Pressable accessibilityRole="button" accessibilityLabel="اختر عنوان التوصيل" onPress={() => go("addresses")} className="flex-row items-center">
          <Text className="text-slate-400 text-2xl">‹</Text>
          <View className="flex-1 mx-3 items-end"><Text className="font-extrabold">اختر عنوان التوصيل</Text><Text className="text-slate-500 text-sm" numberOfLines={1}>{addr ? `${addr.label} - ${addr.city}` : "لم يتم اختيار عنوان"}</Text></View>
          <Text className="text-brand text-2xl">📍</Text>
          </Pressable>
        <Text className="font-bold text-right text-slate-600 text-xs mt-2 mb-1">منطقة التوصيل</Text>
        <View className="flex-row flex-wrap justify-end" style={{ gap: 6 }}>
          {deliveryAreas.map((a: any) => {
            const on = deliveryAreaId === a.id;
            return (
              <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={`${a.city} ${a.area}`} onPress={() => setDeliveryAreaId(a.id)} className={`flex-row items-center rounded-full px-3 py-2 border ${on ? "border-brand bg-brand-light" : "border-slate-200 bg-slate-50"}`}>
                <Text className="font-bold text-brand ml-2">{money(a.fee)}</Text><Text className="font-bold text-sm">{a.city} • {a.area}</Text>
              </Pressable>
            );
          })}
        </View>
        </Card>
        <Text className="font-extrabold text-right mb-2">المنتجات حسب كل محل</Text>
        {groups.map((g) => (
          <Card key={g.shopId}>
            <View className="flex-row items-center justify-end mb-2"><Text className="font-extrabold ml-2">{g.name}</Text><View className="w-10 h-10 rounded-xl bg-accent items-center justify-center"><Text className="text-white text-lg">🏪</Text></View></View>
            <View className="flex-row mb-2" style={{ gap: 6 }}>{g.items.slice(0, 4).map((i: any) => <Image key={i.offerId} source={img(i.image)} style={{ width: "23.5%", aspectRatio: 1, resizeMode: "cover", backgroundColor: "#f3eee8", borderRadius: 10 }} />)}</View>
            <View className="flex-row items-center bg-brand-light rounded-xl px-2 py-1"><Text className="text-slate-400 text-xl">‹</Text><View className="flex-1 mx-2 items-end"><Text className="font-bold">خيارات التوصيل</Text><Text className="text-slate-500 text-xs">{quote ? "محسوب حسب المنطقة" : "تحدد بعد اختيار المنطقة"}</Text></View><Text>🚚</Text></View>
          </Card>
        ))}
        <Card className="bg-slate-50">
          <View className="flex-row justify-between"><Text className="font-bold">{money(subtotal)}</Text><Text className="text-slate-600">سعر المنتجات</Text></View>
          {!!quote?.discount && <View className="flex-row justify-between mt-1"><Text className="font-bold text-green-700">- {money(quote.discount)}</Text><Text className="text-slate-600">خصم ({quote.discountCode})</Text></View>}
          <View className="flex-row justify-between mt-1"><Text className="font-bold">{quote ? money(quote.total - quote.subtotal) : "يحدد حسب العنوان"}</Text><Text className="text-slate-600">التوصيل</Text></View>
          <View className="flex-row justify-between mt-1"><Text className="font-extrabold">{quote ? money(quote.total) : "يظهر بعد تحديد التوصيل"}</Text><Text className="font-extrabold">الإجمالي</Text></View>
        </Card>
        <Pressable accessibilityRole="button" accessibilityLabel="أضف كود خصم" onPress={() => setCodeOpen(!codeOpen)} className="flex-row items-center justify-between bg-slate-50 rounded-xl p-3 mb-3"><Text className="text-slate-500 text-xl">{codeOpen || discountCode ? "⌄" : "‹"}</Text><Text className="text-slate-600 font-bold">أضف كود خصم  🎟</Text></Pressable>
        {(codeOpen || !!discountCode) && <Input label="كود الخصم" value={discountCode} onChange={setDiscountCode} placeholder="أدخل كود الخصم (اختياري)" />}
        <View className="flex-row" style={{ gap: 8 }}>
          <View className="flex-1"><Cta title="راجع التكلفة النهائية" soft disabled={!addressId || !deliveryAreaId || busy} onPress={reviewQuote} /></View>
          <View className="flex-1"><Cta title="متابعة ‹" disabled={!addressId || !deliveryAreaId || !quote} onPress={() => go("payment")} /></View>
        </View>
      </View>
    </View>
  );
}
