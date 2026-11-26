import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, ErrorNote, Ico, Chev } from "../ui/kit";
import { money } from "../shared";

export function PaymentScreen({ c }: { c: any }) {
  const { addresses, addressId, order, quote, back, busy, error, notice, go } = c;
  const addr = addresses.find((a: any) => a.id === addressId);
  return (
    <View className={cx("bg-white flex-1")} style={{ minHeight: 760 }}>
      <Header sheet back onBack={back} title={t('طريقة الدفع')} />
      <View className={cx("px-3 pb-3")}>
        <ErrorNote error={error} notice={notice} />
        <Pressable accessibilityRole="button" accessibilityLabel={t('عنوان التوصيل')} onPress={() => go("addresses")} className={cx("flex-row items-center")} style={{ backgroundColor: "#eef3fb", borderRadius: 16, padding: 12, marginBottom: 6 }}>
          <Ico n="pin" size={28} color="#0751e8" />
          <View className={cx("flex-1 mx-3 items-end")}><Text className={cx("font-extrabold text-base")}>{t('عنوان التوصيل')}</Text><Text className={cx("text-slate-500 text-sm")} numberOfLines={1}>{addr ? `${addr.label} - ${addr.city}` : "-"}</Text></View>
          <Chev dir="right" color="#1e293b" size={11} />
        </Pressable>
        <Text className={cx("font-extrabold text-base text-brand-dark text-right my-2")}>{t('اختر طريقة الدفع')}</Text>
        <View className={cx("flex-row items-center mb-3")} style={{ backgroundColor: "#e9f1fd", borderRadius: 18, padding: 14, minHeight: 104, borderWidth: 1.5, borderColor: "#ffb28a" }}>
          <View className={cx("w-7 h-7 rounded-full border-2 border-accent items-center justify-center")}><View className={cx("w-3.5 h-3.5 rounded-full bg-accent")} /></View>
          <View className={cx("flex-1 mx-3 items-end")}><Text className={cx("font-extrabold text-lg")}>{t('الدفع عند الاستلام')}</Text><Text className={cx("text-slate-500 text-sm")}>{t('ادفع نقدًا عند استلام طلبك')}</Text></View>
          <Image source={require("../../assets/ref/cash.png")} style={{ width: 118, height: 88, resizeMode: "contain", mixBlendMode: "multiply" } as any} />
        </View>
        <View className={cx("flex-row items-center mb-3 opacity-60")} style={{ backgroundColor: "#fdf1e7", borderRadius: 18, padding: 14, minHeight: 104 }} accessibilityLabel={t('بطاقة بنكية قريبًا')}>
          <View className={cx("w-7 h-7 rounded-full border-2 border-slate-400")} />
          <View className={cx("flex-1 mx-3 items-end")}><Text className={cx("font-extrabold text-lg")}>{t('بطاقة بنكية')}</Text><Text className={cx("text-slate-500 text-sm")}>{t('قريبًا • غير متاحة الآن')}</Text></View>
          <Image source={require("../../assets/ref/card.png")} style={{ width: 118, height: 88, resizeMode: "contain", mixBlendMode: "multiply" } as any} />
        </View>
        <View className={cx("flex-row items-center mb-3")} style={{ backgroundColor: "#eaf1fd", borderRadius: 14, padding: 12 }}><Text className={cx("flex-1 text-right text-brand text-sm mx-2")}>{t('الدفع كاش عند الاستلام فقط حاليًا. الإجمالي:')} {quote ? money(quote.total) : "-"}</Text><View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: "#0751e8", alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#0751e8", fontWeight: "800", fontSize: 13 }}>i</Text></View></View>
        <Cta title={t('مراجعة الطلب وتأكيده ‹')} disabled={!quote || busy} onPress={order} />
      </View>
    </View>
  );
}
