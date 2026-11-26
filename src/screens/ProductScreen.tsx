import { t, cx, isEn } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Stepper, Card, art, Ico, Chev } from "../ui/kit";
import { img } from "../ui/helpers";
import { money } from "../shared";

export function ProductScreen({ c }: { c: any }) {
  const { selected, addMany, favorite, favorites, go, back, count, user, vehicles } = c;
  const qty: number = c.productQty; const setQty = c.setProductQty;
  const [tab, setTab] = useState<"details" | "shop">("details");
  if (!selected) return null;
  const offer = selected.offers[0];
  const fav = favorites.some((f: any) => f.id === selected.id);
  return (
    <View className={cx("bg-white flex-1")}>
      <View className={cx("bg-brand px-4 pt-3 pb-2")} style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View className={cx("flex-row items-center justify-between h-12")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('رجوع')} onPress={back} className={cx("w-10")}><Chev dir="left" color="#fff" size={13} /></Pressable>
          <Image source={art.logo} style={{ width: 92, height: 40, resizeMode: "contain" }} />
          <Pressable accessibilityRole="button" accessibilityLabel={t('السلة')} onPress={() => go("cart")} className={cx("w-10 h-10 items-center justify-center")}>
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className={cx("absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center")}><Text className={cx("text-white text-[11px] font-bold")}>{count}</Text></View>}
          </Pressable>
        </View>
      </View>
      <View style={{ overflow: "hidden", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Image source={img(selected.image)} style={{ width: "100%", height: 176, resizeMode: "contain", backgroundColor: "#f3f1ee" }} />
        <Pressable accessibilityRole="button" accessibilityLabel={t('حفظ / إزالة من المفضلة')} onPress={() => favorite(selected)} className={cx("absolute top-3 left-3 w-10 h-10 rounded-full bg-white items-center justify-center")}><Ico n={fav ? "heart-on" : "heart-off"} size={22} color={fav ? "#ef4444" : "#64748b"} /></Pressable>
      </View>
      <View className={cx("px-4 pt-3")}>
        <Text className={cx("text-xl font-extrabold text-right")} numberOfLines={2}>{selected.title}</Text>
        <Text className={cx("text-slate-500 text-right")}>{t('من')} {offer?.shop?.name}</Text>
        <View className={cx("flex-row items-center justify-between my-1")}>
          <Stepper value={qty} onMinus={() => setQty(Math.max(1, qty - 1))} onPlus={() => setQty(Math.min(offer?.stock || 1, qty + 1))} />
          {offer && <Text className={cx("text-accent text-2xl font-extrabold text-right")}>{money(offer.price)}</Text>}
        </View>
        <Card className={cx("flex-row items-center p-2 mb-2")} onPress={() => offer && go("shops")}>
          <Chev dir={isEn ? "right" : "left"} color="#94a3b8" size={10} />
          <View className={cx("flex-1 mx-3 items-end")}><Text className={cx("font-extrabold")}>{offer?.shop?.name}</Text><Text className={cx("text-slate-500 text-sm")}>{t('قطع غيار وصيانة •')} {offer?.shop?.city}</Text></View>
          <View className={cx("w-11 h-11 rounded-full bg-slate-700 items-center justify-center")}><Ico n="shop" size={24} color="#fff" /></View>
        </Card>
        <Card className={cx("bg-brand-light border-brand-light p-2 mb-2")}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ico n="car" size={36} />
            <View className={cx("flex-1 mx-3")}><Text className={cx("font-extrabold text-base")} style={{ textAlign: isEn ? "left" : "right" }}>{t('هل القطعة مناسبة لعربيتك؟')}</Text><Text className={cx("text-slate-600 text-sm")} style={{ textAlign: isEn ? "left" : "right" }}>{t('راجع رقم القطعة مع البائع')}</Text></View>
            <Chev dir="right" color="#0751e8" size={10} />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={t('اختر عربيتك')} onPress={() => go(user ? "vehicle" : "phone")} className={cx("bg-white border border-brand rounded-xl py-2 mt-2 items-center")}><View className={cx("flex-row items-center")}><Ico n="car" size={22} color="#0751e8" /><Text className={cx("text-brand font-extrabold mr-2")}>{vehicles.length ? t('غيّر عربيتك') : t('اختر عربيتك')}</Text></View></Pressable>
        </Card>
        <Card className={cx("flex-row items-center justify-between p-2 mb-1")}><Text className={cx("font-bold")}>{t('جديد')}</Text><View className={cx("flex-row items-center")}><Ico n="gear" size={16} color="#64748b" /><Text className={cx("text-slate-500 ml-1")}>{t('حالة القطعة')}</Text></View></Card>
        <View className={cx("flex-row border-b border-slate-200")}>
          {([["shop", t('المتجر')], ["details", t('التفاصيل')]] as const).map(([k, t]) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={t} onPress={() => setTab(k)} className={cx(`flex-1 items-center py-2 ${tab === k ? "border-b-4 border-brand" : ""}`)}><Text className={cx(tab === k ? "text-brand font-extrabold" : "text-slate-500 font-bold")}>{t}</Text></Pressable>
          ))}
        </View>
        {tab === "details" ? (
          <View><Text className={cx("text-right text-slate-500 mt-2")}>{selected.brand} • {selected.partNumber}</Text><Text className={cx("text-right text-slate-700 leading-7 my-2")}>{selected.description}</Text></View>
        ) : (
          <View className={cx("my-3")}>
            {selected.offers.map((o: any) => (
              <Card key={o.id} className={cx("flex-row items-center justify-between")}>
                <Pressable accessibilityRole="button" accessibilityLabel={t('أضف من {0}', o.shop.name)} disabled={!o.stock} onPress={() => addMany(selected, o, qty)} className={cx(`px-4 py-2 rounded-xl bg-accent ${o.stock ? "" : "opacity-40"}`)}><Text className={cx("text-white font-bold")}>{o.stock ? t('أضف') : t('غير متوفر')}</Text></Pressable>
                <View className={cx("items-end")}><Text className={cx("font-extrabold")}>{o.shop.name}</Text><Text className={cx("text-slate-500 text-xs")}>{o.shop.city}  {t('• المتاح')} {o.stock}</Text><Text className={cx("text-accent font-bold")}>{money(o.price)}</Text></View>
              </Card>
            ))}
          </View>
        )}
        <View className={cx("h-6")} />
      </View>
    </View>
  );
}
