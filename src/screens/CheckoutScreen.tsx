import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, Input, ErrorNote, Ico } from "../ui/kit";
import { groupByShop, img , thumb} from "../ui/helpers";
import { money } from "../shared";

export function CheckoutScreen({ c }: { c: any }) {
  const { discountCode, setDiscountCode, cart, shops, subtotal, addresses, addressId, deliveryAreas, deliveryAreaId, setDeliveryAreaId, quote, reviewQuote, go, back, count, busy, error, notice } = c;
  const addr = addresses.find((a: any) => a.id === addressId);
  const groups = groupByShop(cart, shops);
  const selArea = deliveryAreas.find((x: any) => x.id === deliveryAreaId);
  const [codeOpen, setCodeOpen] = React.useState(false);
  const [areaOpen, setAreaOpen] = React.useState(false);
  return (
    <View className={cx("bg-white flex-1")} style={{ minHeight: 760 }}>
      <Header small back onBack={back} title={t('إتمام الطلب')} onCart={() => go("cart")} count={count} />
      <View className={cx("px-3 pt-2")}>
        <ErrorNote error={error} notice={notice} />
        <Card className={cx("bg-slate-50 p-1.5 mb-1")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('اختر عنوان التوصيل')} onPress={() => go("addresses")} className="items-center" style={{ flexDirection: "row" }}>
          <Text className={cx("text-slate-400 text-2xl")}>{isEn ? "›" : "‹"}</Text>
          <View className={cx("flex-1 mx-3 items-end")} style={isEn ? { alignItems: "flex-start" } : undefined}><Text className={cx("font-extrabold")}>{t('اختر عنوان التوصيل')}</Text><Text className={cx("text-slate-500 text-sm")} numberOfLines={1}>{addr ? `${addr.label} - ${selArea ? t('{0}، {1}', selArea.area, selArea.city) : addr.city}` : t('لم يتم اختيار عنوان')}</Text></View>
          <Ico n="pin" size={26} color="#0751e8" />
          </Pressable>
        {(() => {
          const sel = deliveryAreas.find((x: any) => x.id === deliveryAreaId);
          const show = areaOpen || !sel;
          return (
            <>
              <Pressable accessibilityRole="button" accessibilityLabel={t('منطقة التوصيل')} onPress={() => setAreaOpen(!areaOpen)} className={cx("flex-row items-center justify-between mt-1 px-1")}>
                <Text className={cx("text-slate-500 text-sm")}>{show ? "⌃" : "⌄"}</Text>
                <Text className={cx("font-bold text-slate-700 text-sm")}>{t('منطقة التوصيل:')} {sel ? `${sel.city} • ${sel.area} (${money(sel.fee)})` : t('اختر المنطقة')}</Text>
              </Pressable>
              {show && (
                <View className={cx("flex-row flex-wrap justify-end mt-1")} style={{ gap: 6 }}>
                  {deliveryAreas.map((a: any) => {
                    const on = deliveryAreaId === a.id;
                    return (
                      <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={`${a.city} ${a.area}`} onPress={() => { setDeliveryAreaId(a.id); setAreaOpen(false); }} className={cx(`flex-row items-center rounded-full px-3 py-1 border ${on ? "border-brand bg-brand-light" : "border-slate-200 bg-slate-50"}`)}>
                        <Text className={cx("font-bold text-brand ml-2")}>{money(a.fee)}</Text><Text className={cx("font-bold text-xs")}>{a.city} • {a.area}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </>
          );
        })()}
        </Card>
        <Text className={cx("font-extrabold text-right mb-1")}>{t('المنتجات حسب كل محل')}</Text>
        {groups.map((g) => (
          <Card key={g.shopId} className={cx("p-1.5 mb-1")}>
            <View className={cx("flex-row items-center justify-end mb-0.5")}><Text className={cx("font-extrabold ml-2")}>{g.name}</Text><View className={cx("w-7 h-7 rounded-lg bg-accent items-center justify-center")}><Ico n="shop" size={16} color="#fff" /></View></View>
            <View className={cx("flex-row mb-0.5")} style={{ gap: 6 }}>{g.items.slice(0, 4).map((i: any) => <Image key={i.offerId} source={thumb(i.image)} style={{ width: "23.5%", height: 36, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 8 }} />)}</View>
            <View className="items-center bg-brand-light rounded-xl px-2" style={{ paddingVertical: 0, flexDirection: "row" }}><Text className={cx("text-slate-400 text-xl")}>{isEn ? "›" : "‹"}</Text><View className={cx("flex-1 mx-2 items-end")} style={isEn ? { alignItems: "flex-start" } : undefined}><Text className={cx("font-bold")}>{t('خيارات التوصيل')}</Text><Text className={cx("text-slate-500 text-xs")}>{quote ? t('محسوب حسب المنطقة') : t('تحدد بعد اختيار المنطقة')}</Text></View><Ico n="truck" size={22} /></View>
          </Card>
        ))}
        <Card className={cx("bg-slate-50 p-1.5 mb-1")}>
          <View className={cx("flex-row justify-between")}><Text className={cx("font-bold")}>{money(subtotal)}</Text><Text className={cx("text-slate-600")}>{t('سعر المنتجات')}</Text></View>
          {!!quote?.discount && <View className={cx("flex-row justify-between mt-1")}><Text className={cx("font-bold text-green-700")}>- {money(quote.discount)}</Text><Text className={cx("text-slate-600")}>{t('خصم (')}{quote.discountCode})</Text></View>}
          <View className={cx("flex-row justify-between mt-1")}><Text className={cx("font-bold")}>{quote ? money(quote.total - quote.subtotal) : t('يحدد حسب العنوان')}</Text><Text className={cx("text-slate-600")}>{t('التوصيل')}</Text></View>
          <View className={cx("flex-row justify-between mt-1")}><Text className={cx("font-extrabold")}>{quote ? money(quote.total) : t('يظهر بعد تحديد التوصيل')}</Text><Text className={cx("font-extrabold")}>{t('الإجمالي')}</Text></View>
        </Card>
        <Pressable accessibilityRole="button" accessibilityLabel={t('أضف كود خصم')} onPress={() => setCodeOpen(!codeOpen)} className={cx("flex-row items-center justify-between bg-slate-50 rounded-xl p-1.5 mb-1")}><Text className={cx("text-slate-500 text-xl")}>{codeOpen || discountCode ? "⌄" : "‹"}</Text><Text className={cx("text-slate-600 font-bold")}>{t('أضف كود خصم')}</Text><View className={cx("ml-2")}><Ico n="ticket" size={24} color="#475569" /></View></Pressable>
        {(codeOpen || !!discountCode) && <Input label={t('كود الخصم')} value={discountCode} onChange={setDiscountCode} placeholder={t('أدخل كود الخصم (اختياري)')} />}
        {(() => { const needsReview = !quote || (discountCode || "").trim().toUpperCase() !== (quote.discountCode || "").toUpperCase(); return <Cta title={needsReview ? t('راجع التكلفة ‹') : t('متابعة ‹')} disabled={!addressId || !deliveryAreaId || busy} onPress={needsReview ? reviewQuote : () => go("payment")} />; })()}
      </View>
    </View>
  );
}
