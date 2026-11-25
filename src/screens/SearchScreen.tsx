import { t, cx } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput, ScrollView } from "react-native";
import { Chip } from "../ui/kit";
import { img } from "../ui/helpers";
import { money } from "../shared";

export function SearchScreen({ c }: { c: any }) {
  const { products, search, setSearch, categories, category, shop, shops, back, load, add, setSelected, go, page, pages, vehicles, fitmentVehicle, setFitmentVehicle, browse, setShop, setCategory } = c;
  const [open, setOpen] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("");
  const brands: string[] = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean)));
  const bestPrice = (p: any) => Math.min(...p.offers.filter((o: any) => !shop || o.shopId === shop).map((o: any) => o.price));
  const list = products.filter((p: any) => p.offers.some((o: any) => !shop || o.shopId === shop) && (!brand || p.brand === brand)).sort((a: any, b: any) => (sort === "asc" ? bestPrice(a) - bestPrice(b) : sort === "desc" ? bestPrice(b) - bestPrice(a) : 0));
  const pills: [string, string, [string, string][], (v: string) => void][] = [
    ["brand", brand || t('الماركة'), [["", t('كل الماركات')], ...brands.map((b): [string, string] => [b, b])], setBrand],
    ["sort", sort === "asc" ? t('الأرخص أولًا') : sort === "desc" ? t('الأغلى أولًا') : t('السعر'), [["", t('بدون ترتيب')], ["asc", t('الأرخص أولًا')], ["desc", t('الأغلى أولًا')]], setSort],
    ["shop", shop ? shops.find((x: any) => x.id === shop)?.name || t('المحل') : t('المحل'), [["", t('كل المحلات')], ...shops.map((x: any): [string, string] => [x.id, x.name])], (v: string) => { setShop(v); browse(search, category, v); }],
  ];
  return (
    <View className={cx("bg-white flex-1")}>
      <View className={cx("bg-brand px-4 pt-3 pb-3")}>
        <View className={cx("flex-row items-center justify-between h-10")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('رجوع')} onPress={back} className={cx("w-10")}><Text className={cx("text-white text-3xl")}>‹</Text></Pressable>
          <Text className={cx("text-white text-2xl font-extrabold")}>{shop ? shops.find((s: any) => s.id === shop)?.name || t('المحل') : t('نتائج البحث')}</Text>
          <View className={cx("w-10")} />
        </View>
        <View className={cx("bg-white rounded-full h-12 mt-2 px-4 flex-row items-center")}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('مسح')} onPress={() => { setSearch(""); browse("", category, shop); }}><Text className={cx("text-slate-500 text-lg ml-2")}>✕</Text></Pressable>
          <TextInput style={{ minWidth: 0, paddingEnd: 8 }} accessibilityLabel={t('البحث في المنتجات')} value={search} onChangeText={setSearch} onSubmitEditing={() => load(category)} placeholder={t('ابحث باسم القطعة أو رقمها')} placeholderTextColor="#94a3b8" className={cx("flex-1 text-right text-lg")} />
          <Pressable accessibilityRole="button" accessibilityLabel={t('بحث')} onPress={() => load(category)}><Text className={cx("text-lg ml-2")}>🔍</Text></Pressable>
        </View>
        <View className={cx("flex-row-reverse mt-2 justify-between")}>
          {pills.map(([k, label, opts, set]) => (
            <Pressable key={k} accessibilityRole="button" accessibilityLabel={t('فلتر {0}', label)} onPress={() => setOpen(open === k ? "" : k)} className={cx("flex-row items-center justify-center bg-white rounded-full px-3 h-9")} style={{ width: "32%" }}>
              <Text className={cx("text-brand-dark font-bold text-sm")} numberOfLines={1}>{label}</Text>
              <Text className={cx("text-brand-dark mr-1")}>⌄</Text>
            </Pressable>
          ))}
        </View>
        {!!category && (
          <Pressable accessibilityRole="button" accessibilityLabel={t('إلغاء قسم')} onPress={() => { setCategory(""); load(""); }} className={cx("self-end mt-2 flex-row items-center bg-white rounded-full px-3 h-8")}>
            <Text className={cx("text-brand-dark font-bold text-xs")}>{t(category)}  ✕</Text>
          </Pressable>
        )}
        {!!open && (
          <View className={cx("bg-white rounded-2xl mt-2 p-1")}>
            {pills.find((x) => x[0] === open)![2].map(([v, lab]) => (
              <Pressable key={v || "none"} accessibilityRole="button" accessibilityLabel={t('خيار {0}', lab)} onPress={() => { pills.find((x) => x[0] === open)![3](v); setOpen(""); }} className={cx("px-4 py-3")}><Text className={cx("text-right text-slate-800 font-bold")}>{lab}</Text></Pressable>
            ))}
          </View>
        )}
      </View>
      {vehicles.length > 0 && (
        <View className={cx("px-4 pt-3 flex-row-reverse items-center flex-wrap")}>
          <Text className={cx("font-bold text-slate-600 ml-2")}>{t('التوافق:')}</Text>
          <Chip title={t('كل العربيات')} active={!fitmentVehicle} onPress={() => { setFitmentVehicle(""); setTimeout(() => load(category), 0); }} />
          {vehicles.map((v: any) => <Chip key={v.id} title={`${v.make} ${v.model}`} active={fitmentVehicle === v.id} onPress={() => { setFitmentVehicle(v.id); setTimeout(() => load(category), 0); }} />)}
        </View>
      )}
      <View className={cx("px-4 pt-3")}>
        <Text className={cx("text-right text-slate-600 text-base font-semibold mb-2")}>{list.length}  {t('نتيجة')}</Text>
        {list.map((p: any) => {
          const offers = p.offers.filter((o: any) => !shop || o.shopId === shop);
          const best = offers.reduce((a: any, o: any) => (o.price < a.price ? o : a), offers[0]);
          return (
            <View key={p.id} className={cx("flex-row bg-white rounded-2xl border border-slate-200 mb-3 overflow-hidden")}>
              <Pressable style={{ position: "relative", zIndex: 10 }} accessibilityRole="button" accessibilityLabel={t('أضف {0}', p.title)} onPress={() => add(p, best)} className={cx("z-10 w-14 h-14 rounded-full bg-accent items-center justify-center self-center mx-2")}><Text className={cx("text-white text-3xl")}>+</Text></Pressable>
              <View className={cx("flex-1 min-w-0 py-3 items-end")}>
                <Text className={cx("font-extrabold text-base text-right")} numberOfLines={2} accessibilityLabel={p.title}>{p.title}</Text>
                <Text className={cx("text-slate-500 text-sm")} numberOfLines={1}>{t('من')} {best?.shop?.name}</Text>
                <Text className={cx("text-accent font-extrabold text-xl")}>{money(best.price)}</Text>
                <Text className={cx("text-slate-500 text-[11px]")} numberOfLines={1}>{p.brand} • {p.partNumber}</Text>
                <View className={cx("bg-slate-100 rounded-lg px-3 py-1 mt-1")}><Text className={cx("text-slate-600 text-xs font-bold")}>{t('راجع التوافق')}</Text></View>
              </View>
              <Image source={img(p.image)} style={{ width: 132, height: 132, resizeMode: "contain", backgroundColor: "#fbf4ec" }} />
            <Pressable accessibilityRole="button" accessibilityLabel={p.title} onPress={() => { setSelected({ ...p, offers }); go("product"); }} className={cx("absolute inset-0 z-[5]")} />
            </View>
          );
        })}
        {!list.length && <Text className={cx("text-center text-slate-500 my-10")}>{t('مفيش نتائج. جرّب كلمة تانية.')}</Text>}
        {pages > 1 && (
          <View className={cx("flex-row justify-between my-3")}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('التالي')} disabled={page >= pages} onPress={() => load(category, page + 1)} className={cx(`px-5 py-3 rounded-xl bg-brand-light ${page >= pages ? "opacity-40" : ""}`)}><Text className={cx("text-brand font-bold")}>{t('التالي')}</Text></Pressable>
            <Text className={cx("self-center")}>{page} / {pages}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={t('السابق')} disabled={page <= 1} onPress={() => load(category, page - 1)} className={cx(`px-5 py-3 rounded-xl bg-brand-light ${page <= 1 ? "opacity-40" : ""}`)}><Text className={cx("text-brand font-bold")}>{t('السابق')}</Text></Pressable>
          </View>
        )}
        <Text className={cx("text-center text-xs text-slate-400 mb-4")}>{t('أسعار توضيحية • راجع رقم القطعة والتوافق قبل الشراء')}</Text>
      </View>
    </View>
  );
}
