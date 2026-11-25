import { t, cx } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable, ScrollView, TextInput } from "react-native";
import { Chip, art, Ico, Chev } from "../ui/kit";
import { img, shopCover, shopGallery } from "../ui/helpers";
import { money } from "../shared";

export function ShopScreen({ c }: { c: any }) {
  const { products, shops, shop, categories, category, setCategory, load, add, go, back, count, setSelected, favorite, favorites } = c;
  const s = shops.find((x: any) => x.id === shop);
  const n = Math.max(0, shops.findIndex((x: any) => x.id === shop));
  const list = products.filter((p: any) => p.offers.some((o: any) => o.shopId === shop));
  return (
    <View className={cx("bg-white flex-1")}>
      <View className={cx("bg-brand px-4 pt-3 pb-3")}>
        <View className={cx("flex-row items-center justify-between h-12")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('رجوع')} onPress={back} className={cx("w-10")}><Chev dir="left" color="#fff" size={13} /></Pressable>
          <Image source={art.logo} style={{ width: 92, height: 40, resizeMode: "contain" }} />
          <Pressable accessibilityRole="button" accessibilityLabel={t('السلة')} onPress={() => go("cart")} className={cx("w-10 h-10 items-center justify-center")}>
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className={cx("absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center")}><Text className={cx("text-white text-[11px] font-bold")}>{count}</Text></View>}
          </Pressable>
        </View>
        <View className={cx("bg-white rounded-full h-12 mt-1 px-4 justify-center")}><Text className={cx("text-right text-slate-400 text-base")}>{t('ابحث باسم القطعة أو رقمها 🔍')}</Text></View>
      </View>
      <View>
        <Image source={shopCover(s, n).source} style={{ width: "100%", height: 150, resizeMode: "cover" }} />
        {shopCover(s, n).demo && <View className={cx("absolute bottom-3 left-3 bg-slate-900/80 rounded px-2")}><Text className={cx("text-white text-[11px]")}>{t('صورة تجريبية')}</Text></View>}
      </View>
      {shopGallery(s).length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false} className={cx("px-4 pt-2 flex-grow-0")} style={{ flexGrow: 0 }}>{shopGallery(s).map((p: any) => <Image key={p.id} source={img(p.url)} style={{ width: 72, height: 54, borderRadius: 8, marginLeft: 8 }} />)}</ScrollView>}
      <View className={cx("flex-row items-center px-4 -mt-9")} style={{ zIndex: 2, position: "relative" }}>
        <View className={cx("w-20 h-20 rounded-full bg-orange-50 border-4 border-white items-center justify-center")}><Ico n="shop" size={44} color="#0b2a5b" /></View>
        <View className={cx("flex-1 ml-3 mt-8 items-end")}><Text className={cx("text-xl font-extrabold text-right")} numberOfLines={2} accessibilityLabel={s?.name || t('المحل')}>{s?.name || t('المحل')}</Text><Text className={cx("text-slate-500 text-base")}>{s?.description || t('قطع غيار وصيانة')}</Text>{!!s?.workingHours && <Text className={cx("text-slate-500 text-sm")}>{t('مواعيد العمل:')} {s.workingHours}</Text>}</View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className={cx("px-4 mt-3 flex-grow-0")}>
        {["", ...categories].map((k: string) => <Chip key={k || "all"} title={k || t('الكل')} active={category === k} onPress={() => { setCategory(k); load(k); }} />)}
      </ScrollView>
      <View className={cx("flex-row flex-wrap justify-between px-4 mt-3")}>
        {list.map((p: any) => {
          const o = p.offers.find((x: any) => x.shopId === shop);
          return (
            <View key={p.id} className={cx("w-[48%] bg-white rounded-2xl border border-slate-200 mb-3 overflow-hidden")}>
              <Pressable style={{ zIndex: 10 }} accessibilityRole="button" accessibilityLabel={t('مفضلة {0}', p.title)} onPress={() => favorite(p)} className={cx("absolute z-10 top-2 left-2")}><Text className={cx("text-lg")}>{favorites.some((f: any) => f.id === p.id) ? "❤" : "♡"}</Text></Pressable>
              <Image source={img(p.image)} style={{ width: "100%", height: 120, resizeMode: "cover", backgroundColor: "#fbf4ec" }} />
              <View className={cx("p-2 items-end")}><Text className={cx("font-bold text-sm text-right")} numberOfLines={2}>{p.title}</Text></View>
              <View className={cx("flex-row items-center justify-between p-2")} style={{ zIndex: 10 }}>
                <Pressable style={{ position: "relative", zIndex: 10 }} accessibilityRole="button" accessibilityLabel={t('أضف {0}', p.title)} onPress={() => add(p, o)} className={cx("z-10 w-9 h-9 rounded-full bg-accent items-center justify-center")}><Text className={cx("text-white text-xl")}>+</Text></Pressable>
                <Text className={cx("text-accent font-extrabold")}>{money(o.price)}</Text>
              </View>
            <Pressable accessibilityRole="button" accessibilityLabel={p.title} onPress={() => { setSelected({ ...p, offers: p.offers.filter((x: any) => x.shopId === shop) }); go("product"); }} className={cx("absolute inset-0 z-[5]")} />
            </View>
          );
        })}
      </View>
      {!list.length && <Text className={cx("text-center text-slate-500 my-8")}>{t('لا توجد منتجات في هذا القسم.')}</Text>}
    </View>
  );
}
