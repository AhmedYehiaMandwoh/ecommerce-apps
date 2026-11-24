import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, ErrorNote, Ico } from "../ui/kit";
import { money } from "../shared";

export function PaymentScreen({ c }: { c: any }) {
  const { addresses, addressId, order, quote, back, busy, error, notice, go } = c;
  const addr = addresses.find((a: any) => a.id === addressId);
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header back onBack={back} title="طريقة الدفع" onCart={() => go("cart")} count={c.count} tall />
      <View className="p-3">
        <ErrorNote error={error} notice={notice} />
        <Card className="flex-row items-center bg-brand-light p-5" onPress={() => go("addresses")}>
          <Text className="text-slate-400 text-2xl">‹</Text>
          <View className="flex-1 mx-3 items-end"><Text className="font-extrabold text-xl">عنوان التوصيل</Text><Text className="text-slate-500 text-base" numberOfLines={1}>{addr ? `${addr.label} - ${addr.city}` : "-"}</Text></View>
          <Ico n="pin" size={26} color="#0751e8" />
        </Card>
        <Text className="font-extrabold text-2xl text-brand-dark text-right my-3">اختر طريقة الدفع</Text>
        <View className="flex-row items-center bg-orange-50 rounded-2xl p-4 mb-3 border-2 border-accent">
          <View className="w-7 h-7 rounded-full border-2 border-accent items-center justify-center"><View className="w-3.5 h-3.5 rounded-full bg-accent" /></View>
          <View className="flex-1 mx-3 items-end"><Text className="font-extrabold text-2xl">الدفع عند الاستلام</Text><Text className="text-slate-500 text-base">ادفع نقدًا عند استلام طلبك</Text></View>
          <Image source={require("../../assets/ref/cash.png")} style={{ width: 130, height: 96, resizeMode: "cover", borderRadius: 12 }} />
        </View>
        <View className="flex-row items-center bg-orange-50 rounded-2xl p-4 mb-3 opacity-60" accessibilityLabel="بطاقة بنكية قريبًا">
          <View className="w-7 h-7 rounded-full border-2 border-slate-400" />
          <View className="flex-1 mx-3 items-end"><Text className="font-extrabold text-2xl">بطاقة بنكية</Text><Text className="text-slate-500 text-base">قريبًا • غير متاحة الآن</Text></View>
          <Image source={require("../../assets/ref/card.png")} style={{ width: 120, height: 96, resizeMode: "cover", borderRadius: 12 }} />
        </View>
        <View className="bg-brand-light rounded-xl p-3 mb-3"><Text className="text-right text-brand text-sm">ⓘ الدفع كاش عند الاستلام فقط حاليًا. الإجمالي: {quote ? money(quote.total) : "-"}</Text></View>
        <Cta title="مراجعة الطلب وتأكيده ‹" disabled={!quote || busy} onPress={order} />
      </View>
    </View>
  );
}
