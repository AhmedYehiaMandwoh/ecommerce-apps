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
      <Header back onBack={back} title={t('طريقة الدفع')} onCart={() => go("cart")} count={c.count} />
      <View className={cx("p-3")}>
        <ErrorNote error={error} notice={notice} />
        <Card className={cx("flex-row items-center bg-brand-light p-3")} onPress={() => go("addresses")}>
          <Chev dir={isEn ? "right" : "left"} color="#94a3b8" size={10} />
          <View className={cx("flex-1 mx-3 items-end")}><Text className={cx("font-extrabold text-lg")}>{t('عنوان التوصيل')}</Text><Text className={cx("text-slate-500 text-base")} numberOfLines={1}>{addr ? `${addr.label} - ${addr.city}` : "-"}</Text></View>
          <Ico n="pin" size={26} color="#0751e8" />
        </Card>
        <Text className={cx("font-extrabold text-base text-brand-dark text-right my-2")}>{t('اختر طريقة الدفع')}</Text>
        <View className={cx("flex-row items-center bg-orange-50 rounded-2xl p-3 mb-3 border-2 border-accent")}>
          <View className={cx("w-7 h-7 rounded-full border-2 border-accent items-center justify-center")}><View className={cx("w-3.5 h-3.5 rounded-full bg-accent")} /></View>
          <View className={cx("flex-1 mx-3 items-end")}><Text className={cx("font-extrabold text-lg")}>{t('الدفع عند الاستلام')}</Text><Text className={cx("text-slate-500 text-sm")}>{t('ادفع نقدًا عند استلام طلبك')}</Text></View>
          <Image source={require("../../assets/ref/cash.png")} style={{ width: 90, height: 66, resizeMode: "cover", borderRadius: 12 }} />
        </View>
        <View className={cx("flex-row items-center bg-orange-50 rounded-2xl p-3 mb-3 opacity-60")} accessibilityLabel={t('بطاقة بنكية قريبًا')}>
          <View className={cx("w-7 h-7 rounded-full border-2 border-slate-400")} />
          <View className={cx("flex-1 mx-3 items-end")}><Text className={cx("font-extrabold text-lg")}>{t('بطاقة بنكية')}</Text><Text className={cx("text-slate-500 text-sm")}>{t('قريبًا • غير متاحة الآن')}</Text></View>
          <Image source={require("../../assets/ref/card.png")} style={{ width: 90, height: 66, resizeMode: "cover", borderRadius: 12 }} />
        </View>
        <View className={cx("bg-brand-light rounded-xl p-3 mb-3")}><Text className={cx("text-right text-brand text-sm")}>{t('ⓘ الدفع كاش عند الاستلام فقط حاليًا. الإجمالي:')} {quote ? money(quote.total) : "-"}</Text></View>
        <Cta title={t('مراجعة الطلب وتأكيده ‹')} disabled={!quote || busy} onPress={order} />
      </View>
    </View>
  );
}
