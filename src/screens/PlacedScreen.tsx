import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Ico, Chev } from "../components";
import { groupByShop, img , thumb} from "../ui/helpers";

export function PlacedScreen({ c }: { c: any }) {
  const { lastPlacedOrder, placedSnapshot, shops, setScreen, go, orders, setDetailId } = c;
  if (!lastPlacedOrder) return null;
  const groups = groupByShop(placedSnapshot, shops);
  return (
    <View className={cx("bg-white flex-1 min-h-[760px]")}>
      <Header sheet title={t('تم استلام طلبك')} back onBack={() => setScreen("home")} />
      <View className={cx("px-3 pb-3")}>
        <View style={{ marginHorizontal: -12, marginTop: 0, height: 196, overflow: "hidden" }}><Image source={require("../../assets/ref/confirm.png")} style={{ width: "100%", height: 196, resizeMode: "cover" }} /></View>
        <Text className={cx("font-extrabold text-center mt-1 text-[30px] leading-[38px]")} style={{ fontWeight: "900", color: "#0b2a5b" }}>{t('تم استلام طلبك')}</Text>
        <Text className={cx("text-accent font-extrabold text-center text-[22px] leading-[28px]")}>{t('طلب تجريبي')}</Text>
        <Text className={cx("text-center text-slate-600 mt-1")}>{t('رقم الطلب:')} {(() => { const mine = orders.filter((x: any) => x.checkoutId === lastPlacedOrder.id); return mine.length ? mine.map((x: any) => x.id.slice(0, 8)).join(t(' ، ')) : lastPlacedOrder.id.slice(0, 8); })()}</Text>
        <View className={cx("flex-row items-center my-1 bg-[#eaf1fd] rounded-[14px]")} style={{ padding: 8 }}><Text className={cx("flex-1 text-brand text-center text-sm mx-2")}>{t('حالة توضيحية وليست عملية شراء. لا دفع ولا توصيل حقيقي. الدفع كاش عند الاستلام.')}</Text><View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: "#0751e8", alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#0751e8", fontWeight: "800", fontSize: 13 }}>i</Text></View></View>
        <Text className={cx("font-extrabold text-right text-lg mb-1")}>{t('المنتجات من محلات مختلفة')}</Text>
        {groups.map((g) => (
          <Pressable key={g.shopId} accessibilityRole="button" accessibilityLabel={t('تتبع طلب {0}', g.name)} onPress={() => { const o = orders.find((x: any) => x.checkoutId === lastPlacedOrder.id && x.shopId === g.shopId); if (o) { setDetailId(o.id); go("track"); } }} className={cx("flex-row items-center bg-white border border-slate-200 p-1.5 mb-1.5 rounded-[16px]")}>
            <View className={cx("w-9 h-9 rounded-full bg-accent items-center justify-center")}><Ico n="shop" size={22} color="#fff" /></View>
            <View className={cx("flex-1 min-w-0 mx-2 items-end")}><Text className={cx("font-extrabold text-base text-right")} numberOfLines={1} accessibilityLabel={g.name}>{g.name}</Text><Text className={cx("text-slate-500 text-xs")}>{g.items.reduce((a: number, i: any) => a + i.quantity, 0)}  {t('منتجات')}</Text></View>
            <View className={cx("flex-row mx-2")}>{g.items.slice(0, 3).map((i: any) => <Image key={i.offerId} source={thumb(i.image)} style={{ width: 40, height: 48, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 6, marginRight: 3 }} />)}</View>
            <Chev dir="right" color="#475569" size={10} />
          </Pressable>
        ))}
        <View className={cx("flex-row mt-0")} style={{ gap: 10 }}>
          <View className={cx("flex-[1.15]")}><Cta title={t('الرئيسية')} icon="home" soft onPress={() => setScreen("home")} /></View>
          <View className={cx("flex-[1.35]")}><Cta title={t('تتبع الطلب')} icon="truck" onPress={() => { const o = orders.find((x: any) => x.checkoutId === lastPlacedOrder.id); setDetailId(o?.id || ""); go("track"); }} /></View>
        </View>
      </View>
    </View>
  );
}
