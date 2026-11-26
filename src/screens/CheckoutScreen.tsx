import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, Input, ErrorNote, Ico, Chev } from "../components";
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
    <View className={cx("bg-white flex-1 min-h-[760px]")}>
      <Header small sheet back onBack={back} title={t('إتمام الطلب')} onCart={() => go("cart")} count={count} />
      <View className={cx("px-3 pt-0")}>
        <ErrorNote error={error} notice={notice} />
        <View style={{ backgroundColor: "#eef3fb", borderRadius: 16, padding: 9, marginBottom: 10 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('اختر عنوان التوصيل')} onPress={() => go("addresses")} className={cx("flex-row items-center")}>
          <Ico n="pin" size={26} color="#0751e8" />
          <View className={cx("flex-1 mx-3 items-end")} style={isEn ? { alignItems: "flex-start" } : undefined}><Text className={cx("font-extrabold")}>{t('اختر عنوان التوصيل')}</Text><Text className={cx("text-slate-500 text-sm")} numberOfLines={1}>{addr ? `${addr.label} - ${selArea ? t('{0}، {1}', selArea.area, selArea.city) : addr.city}` : t('لم يتم اختيار عنوان')}</Text></View>
          <Chev dir="right" color="#1e293b" size={11} />
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
        </View>
        <Text className={cx("font-extrabold text-right mb-1 text-[16px]")}>{t('المنتجات حسب كل محل')}</Text>
        {groups.map((g) => (
          <Card key={g.shopId} className={cx("p-2 mb-2")}>
            <View className={cx("flex-row items-center justify-end mb-0.5")}><Text className={cx("font-extrabold ml-2")}>{g.name}</Text><View className={cx("bg-accent items-center justify-center w-[34px] h-[34px] rounded-[17px]")}><Ico n="shop" size={18} color="#fff" /></View></View>
            <View className={cx("flex-row mb-0.5")} style={{ gap: 6 }}>{g.items.slice(0, 4).map((i: any) => <Image key={i.offerId} source={thumb(i.image)} style={{ width: "23.5%", height: 62, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 8 }} />)}</View>
            <View className={cx("flex-row items-center rounded-xl px-2 py-[4px] bg-[#eef3fb]")}><Ico n="truck" size={28} /><View className={cx("flex-1 mx-2 items-end")} style={isEn ? { alignItems: "flex-start" } : undefined}><Text className={cx("font-bold")}>{t('خيارات التوصيل')}</Text><Text className={cx("text-slate-500 text-xs")}>{quote ? t('محسوب حسب المنطقة') : t('تحدد بعد اختيار المنطقة')}</Text></View><Chev dir="right" color="#475569" size={10} /></View>
          </Card>
        ))}
        <Card className={cx("bg-white p-2 mb-2")}>
          <View className={cx("flex-row justify-between")}><Text className={cx("font-bold")}>{money(subtotal)}</Text><Text className={cx("text-slate-600")}>{t('سعر المنتجات')}</Text></View>
          {!!quote?.discount && <View className={cx("flex-row justify-between mt-1")}><Text className={cx("font-bold text-green-700")}>- {money(quote.discount)}</Text><Text className={cx("text-slate-600")}>{t('خصم (')}{quote.discountCode})</Text></View>}
          <View className={cx("flex-row justify-between mt-1")}><Text className={cx("font-bold")}>{quote ? money(quote.total - quote.subtotal) : t('يحدد حسب العنوان')}</Text><Text className={cx("text-slate-600")}>{t('التوصيل')}</Text></View>
          <View className={cx("flex-row justify-between mt-1")}><Text className={cx("font-extrabold")}>{quote ? money(quote.total) : t('يظهر بعد تحديد التوصيل')}</Text><Text className={cx("font-extrabold")}>{t('الإجمالي')}</Text></View>
        </Card>
        <Pressable accessibilityRole="button" accessibilityLabel={t('أضف كود خصم')} onPress={() => setCodeOpen(!codeOpen)} className={cx("flex-row items-center rounded-xl p-2 mb-1 bg-[#eef3fb]")}><Ico n="ticket" size={26} color="#475569" /><Text className={cx("text-slate-600 font-bold flex-1 text-right mx-2")}>{t('أضف كود خصم')}</Text><Text className={cx("text-slate-800 text-xl")}>{codeOpen || discountCode ? "⌄" : "›"}</Text></Pressable>
        {(codeOpen || !!discountCode) && <Input label={t('كود الخصم')} value={discountCode} onChange={setDiscountCode} placeholder={t('أدخل كود الخصم (اختياري)')} />}
        {(() => { const needsReview = !quote || (discountCode || "").trim().toUpperCase() !== (quote.discountCode || "").toUpperCase(); return <Cta title={needsReview ? t('راجع التكلفة ‹') : t('متابعة ‹')} disabled={!addressId || !deliveryAreaId || busy} onPress={needsReview ? reviewQuote : () => go("payment")} />; })()}
      </View>
    </View>
  );
}
