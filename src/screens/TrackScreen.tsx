import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Ico, Chev } from "../ui/kit";
import { img , thumb} from "../ui/helpers";
import { statuses } from "../shared";

const steps = [["PLACED", t('تم الطلب')], ["PREPARING", t('جار التجهيز')], ["SHIPPED", t('خرج للتوصيل')], ["DELIVERED", t('تم التسليم')]];
export function TrackScreen({ c }: { c: any }) {
  const { orders, detailId, back, go, count } = c;
  const o = orders.find((x: any) => x.id === detailId) || orders[0];
  if (!o) return <View className={cx("bg-white flex-1")}><Header back onBack={back} title={t('تتبع الطلب')} /><Text className={cx("text-center text-slate-500 my-10")}>{t('مفيش طلب لعرضه.')}</Text></View>;
  const idx = Math.max(0, steps.findIndex(([k]) => k === (o.status === "ACCEPTED" ? "PLACED" : o.status)));
  return (
    <View className={cx("bg-white flex-1")} style={{ minHeight: 760 }}>
      <Header back onBack={back} onCart={() => go("cart")} count={count} />
      <View className={cx("bg-white rounded-t-3xl -mt-2 pt-3")}><Text className={cx("text-slate-900 text-center text-lg font-extrabold")}>{t('تتبع الطلب')}</Text></View>
      <View className={cx("px-3 pb-3 pt-1")} style={{ minHeight: 400 }}>
        <View><Image source={require("../../assets/ref/track-map.png")} style={{ width: "100%", height: 168, resizeMode: "cover", borderRadius: 16 }} /><Text className={cx("absolute bottom-2 left-2 bg-white/90 text-slate-700 text-xs px-2 py-1 rounded-lg")}>{t('رسم توضيحي ثابت، ليس تتبعًا مباشرًا')}</Text></View>
        <View className={cx("flex-row items-center bg-brand-light rounded-2xl p-3 my-2")}>
          <View className={cx("w-14 h-14 rounded-full bg-white items-center justify-center")}><Ico n="truck" size={38} color="#0751e8" /></View>
          <View className={cx("flex-1 items-end")}><Text className={cx("text-xl font-extrabold text-brand-dark")} style={{ color: "#0b3fb8" }}>{statuses[o.status]}</Text><Text className={cx("text-slate-600 text-sm")}>{t('حالة توضيحية • #')}{o.id.slice(0, 8)}</Text></View>
        </View>
        <View className={cx("mb-4")} style={{ paddingTop: 2 }}>
          <View style={{ position: "absolute", top: 13, left: "12%", right: "12%", height: 3, backgroundColor: "#cbd5e1" }} />
          <View style={{ position: "absolute", top: 13, right: "12%", width: `${(Math.max(0, idx) / 3) * 76}%`, height: 3, backgroundColor: "#0b3fb8" }} />
          <View className={cx("flex-row-reverse justify-between")}>
          {steps.map(([k, t], n) => (
            <View key={k} className={cx("items-center flex-1")}>
              <View className={cx(`w-7 h-7 rounded-full items-center justify-center ${n <= idx ? "bg-brand" : "bg-slate-300"}`)}><Text className={cx("text-white text-sm")}>{n <= idx ? "✓" : ""}</Text></View>
              <Text className={cx(`text-xs mt-1 text-center ${n <= idx ? "font-bold" : ""}`)}>{t}</Text>
            </View>
          ))}
          </View>
        </View>
        <Text className={cx("font-extrabold text-right mb-2")}>{t('محتويات الطلب')}</Text>
        <View className={cx("flex-row items-center bg-white border border-slate-200 rounded-xl p-2 mb-2")}>
          <Chev dir={isEn ? "right" : "left"} color="#94a3b8" size={9} />
          <View className={cx("flex-row mx-2")}>{o.items.slice(0, 3).map((i: any) => <Image key={i.id} source={thumb(i.offer?.product?.image)} style={{ width: 52, height: 52, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 8, marginRight: 3 }} />)}</View>
          <View className={cx("flex-1 items-end")}><Text className={cx("font-extrabold")}>{o.shop.name}</Text><Text className={cx("text-slate-500 text-xs")}>{o.items.length}  {isEn && o.items.length === 1 ? 'part' : t('قطع')}</Text></View>
        </View>
        <View className={cx("flex-row")} style={{ gap: 10, marginTop: 16, marginBottom: 8 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('تواصل مع الدعم')} onPress={() => go("support")} className={cx("flex-1 bg-white border-2 border-brand rounded-2xl items-center justify-center")} style={{ height: 52 }}><View style={{ flexDirection: "row", alignItems: "center" }}><Ico n="headset" size={20} color="#0751e8" /><Text className={cx("text-brand font-extrabold text-base ml-2")}>{t('تواصل مع الدعم')}</Text></View></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('تفاصيل الطلب')} onPress={() => go("orderdetail")} className={cx("flex-1 bg-accent rounded-2xl items-center justify-center")} style={{ height: 52 }}><Text className={cx("text-white font-extrabold text-base")}>{t('تفاصيل الطلب')}</Text></Pressable>
        </View>
      </View>
    </View>
  );
}
