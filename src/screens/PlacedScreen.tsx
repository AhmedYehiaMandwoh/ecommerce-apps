import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Ico, Chev } from "../ui/kit";
import { groupByShop, img , thumb} from "../ui/helpers";

export function PlacedScreen({ c }: { c: any }) {
  const { lastPlacedOrder, placedSnapshot, shops, setScreen, go, orders, setDetailId } = c;
  if (!lastPlacedOrder) return null;
  const groups = groupByShop(placedSnapshot, shops);
  return (
    <View className={cx("bg-white flex-1")} style={{ minHeight: 760 }}>
      <Header title={t('تم استلام طلبك')} back onBack={() => setScreen("home")} />
      <View className={cx("p-3")}>
        <View style={{ width: "100%", height: 176, overflow: "hidden" }}><Image source={require("../../assets/ref/confirm.png")} style={{ width: "100%", height: 180, resizeMode: "contain" }} /></View>
        <Text className={cx("text-2xl font-extrabold text-center mt-1")}>{t('تم استلام طلبك')}</Text>
        <Text className={cx("text-accent text-lg font-extrabold text-center")}>{t('طلب تجريبي')}</Text>
        <Text className={cx("text-center text-slate-600 mt-1")}>{t('رقم الطلب:')} {(() => { const mine = orders.filter((x: any) => x.checkoutId === lastPlacedOrder.id); return mine.length ? mine.map((x: any) => x.id.slice(0, 8)).join(t(' ، ')) : lastPlacedOrder.id.slice(0, 8); })()}</Text>
        <Text className={cx("bg-brand-light text-brand rounded-xl p-2 text-center my-2 text-sm")}>{t('ⓘ حالة توضيحية وليست عملية شراء. لا دفع ولا توصيل حقيقي. الدفع كاش عند الاستلام.')}</Text>
        <Text className={cx("font-extrabold text-right text-lg mb-1")}>{t('المنتجات من محلات مختلفة')}</Text>
        {groups.map((g) => (
          <Pressable key={g.shopId} accessibilityRole="button" accessibilityLabel={t('تتبع طلب {0}', g.name)} onPress={() => { const o = orders.find((x: any) => x.checkoutId === lastPlacedOrder.id && x.shopId === g.shopId); if (o) { setDetailId(o.id); go("track"); } }} className={cx("flex-row items-center bg-white border border-slate-200 rounded-xl p-1.5 mb-1.5")}>
            <Chev dir={isEn ? "right" : "left"} color="#94a3b8" size={9} />
            <View className={cx("flex-row mx-2")}>{g.items.slice(0, 3).map((i: any) => <Image key={i.offerId} source={thumb(i.image)} style={{ width: 54, height: 42, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 8, marginRight: 3 }} />)}</View>
            <View className={cx("flex-1 min-w-0 items-end")}><Text className={cx("font-extrabold text-base text-right")} numberOfLines={1} accessibilityLabel={g.name}>{g.name}</Text><Text className={cx("text-slate-500 text-xs")}>{g.items.reduce((a: number, i: any) => a + i.quantity, 0)}  {t('منتجات')}</Text></View>
            <View className={cx("w-9 h-9 rounded-full bg-accent items-center justify-center mr-1")}><Ico n="shop" size={20} color="#fff" /></View>
          </Pressable>
        ))}
        <View className={cx("flex-row mt-2")} style={{ gap: 10 }}>
          <View className={cx("flex-[1.15]")}><Cta title={t('الرئيسية')} icon="home" soft onPress={() => setScreen("home")} /></View>
          <View className={cx("flex-[1.35]")}><Cta title={t('تتبع الطلب')} icon="truck" onPress={() => { const o = orders.find((x: any) => x.checkoutId === lastPlacedOrder.id); setDetailId(o?.id || ""); go("track"); }} /></View>
        </View>
      </View>
    </View>
  );
}
