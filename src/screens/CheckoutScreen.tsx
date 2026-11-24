import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, Input, ErrorNote, Ico } from "../ui/kit";
import { groupByShop, img } from "../ui/helpers";
import { money } from "../shared";

export function CheckoutScreen({ c }: { c: any }) {
  const { discountCode, setDiscountCode, cart, shops, subtotal, addresses, addressId, deliveryAreas, deliveryAreaId, setDeliveryAreaId, quote, reviewQuote, go, back, count, busy, error, notice } = c;
  const addr = addresses.find((a: any) => a.id === addressId);
  const groups = groupByShop(cart, shops);
  const [codeOpen, setCodeOpen] = React.useState(false);
  const [areaOpen, setAreaOpen] = React.useState(false);
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header small back onBack={back} title="إتمام الطلب" onCart={() => go("cart")} count={count} />
      <View className="px-3 pt-2">
        <ErrorNote error={error} notice={notice} />
        <Card className="bg-slate-50 p-1.5 mb-1">
          <Pressable accessibilityRole="button" accessibilityLabel="اختر عنوان التوصيل" onPress={() => go("addresses")} className="flex-row items-center">
          <Text className="text-slate-400 text-2xl">‹</Text>
          <View className="flex-1 mx-3 items-end"><Text className="font-extrabold">اختر عنوان التوصيل</Text><Text className="text-slate-500 text-sm" numberOfLines={1}>{addr ? `${addr.label} - ${addr.city}` : "لم يتم اختيار عنوان"}</Text></View>
          <Ico n="pin" size={26} color="#0751e8" />
          </Pressable>
        {(() => {
          const sel = deliveryAreas.find((x: any) => x.id === deliveryAreaId);
          const show = areaOpen || !sel;
          return (
            <>
              <Pressable accessibilityRole="button" accessibilityLabel="منطقة التوصيل" onPress={() => setAreaOpen(!areaOpen)} className="flex-row items-center justify-between mt-1 px-1">
                <Text className="text-slate-500 text-sm">{show ? "⌃" : "⌄"}</Text>
                <Text className="font-bold text-slate-700 text-sm">منطقة التوصيل: {sel ? `${sel.city} • ${sel.area} (${money(sel.fee)})` : "اختر المنطقة"}</Text>
              </Pressable>
              {show && (
                <View className="flex-row flex-wrap justify-end mt-1" style={{ gap: 6 }}>
                  {deliveryAreas.map((a: any) => {
                    const on = deliveryAreaId === a.id;
                    return (
                      <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={`${a.city} ${a.area}`} onPress={() => { setDeliveryAreaId(a.id); setAreaOpen(false); }} className={`flex-row items-center rounded-full px-3 py-1 border ${on ? "border-brand bg-brand-light" : "border-slate-200 bg-slate-50"}`}>
                        <Text className="font-bold text-brand ml-2">{money(a.fee)}</Text><Text className="font-bold text-xs">{a.city} • {a.area}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </>
          );
        })()}
        </Card>
        <Text className="font-extrabold text-right mb-1">المنتجات حسب كل محل</Text>
        {groups.map((g) => (
          <Card key={g.shopId} className="p-2 mb-1">
            <View className="flex-row items-center justify-end mb-1"><Text className="font-extrabold ml-2">{g.name}</Text><View className="w-8 h-8 rounded-lg bg-accent items-center justify-center"><Ico n="shop" size={18} color="#fff" /></View></View>
            <View className="flex-row mb-1" style={{ gap: 6 }}>{g.items.slice(0, 4).map((i: any) => <Image key={i.offerId} source={img(i.image)} style={{ width: "23.5%", aspectRatio: 2.8, resizeMode: "cover", backgroundColor: "#f3eee8", borderRadius: 10 }} />)}</View>
            <View className="flex-row items-center bg-brand-light rounded-xl px-2 py-1"><Text className="text-slate-400 text-xl">‹</Text><View className="flex-1 mx-2 items-end"><Text className="font-bold">خيارات التوصيل</Text><Text className="text-slate-500 text-xs">{quote ? "محسوب حسب المنطقة" : "تحدد بعد اختيار المنطقة"}</Text></View><Ico n="truck" size={26} /></View>
          </Card>
        ))}
        <Card className="bg-slate-50 p-1.5 mb-1">
          <View className="flex-row justify-between"><Text className="font-bold">{money(subtotal)}</Text><Text className="text-slate-600">سعر المنتجات</Text></View>
          {!!quote?.discount && <View className="flex-row justify-between mt-1"><Text className="font-bold text-green-700">- {money(quote.discount)}</Text><Text className="text-slate-600">خصم ({quote.discountCode})</Text></View>}
          <View className="flex-row justify-between mt-1"><Text className="font-bold">{quote ? money(quote.total - quote.subtotal) : "يحدد حسب العنوان"}</Text><Text className="text-slate-600">التوصيل</Text></View>
          <View className="flex-row justify-between mt-1"><Text className="font-extrabold">{quote ? money(quote.total) : "يظهر بعد تحديد التوصيل"}</Text><Text className="font-extrabold">الإجمالي</Text></View>
        </Card>
        <Pressable accessibilityRole="button" accessibilityLabel="أضف كود خصم" onPress={() => setCodeOpen(!codeOpen)} className="flex-row items-center justify-between bg-slate-50 rounded-xl p-1.5 mb-1"><Text className="text-slate-500 text-xl">{codeOpen || discountCode ? "⌄" : "‹"}</Text><Text className="text-slate-600 font-bold">أضف كود خصم</Text><View className="ml-2"><Ico n="ticket" size={24} color="#475569" /></View></Pressable>
        {(codeOpen || !!discountCode) && <Input label="كود الخصم" value={discountCode} onChange={setDiscountCode} placeholder="أدخل كود الخصم (اختياري)" />}
        {(() => { const needsReview = !quote || (discountCode || "").trim().toUpperCase() !== (quote.discountCode || "").toUpperCase(); return <Cta title={needsReview ? "راجع التكلفة ‹" : "متابعة ‹"} disabled={!addressId || !deliveryAreaId || busy} onPress={needsReview ? reviewQuote : () => go("payment")} />; })()}
      </View>
    </View>
  );
}
