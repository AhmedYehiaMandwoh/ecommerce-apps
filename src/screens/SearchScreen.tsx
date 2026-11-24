import React from "react";
import { View, Text, Image, Pressable, TextInput, ScrollView } from "react-native";
import { Chip } from "../ui/kit";
import { img } from "../ui/helpers";
import { money } from "../shared";

export function SearchScreen({ c }: { c: any }) {
  const { products, search, setSearch, categories, category, shop, shops, back, load, add, setSelected, go, page, pages, vehicles, fitmentVehicle, setFitmentVehicle, browse, setShop, setCategory } = c;
  const list = products.filter((p: any) => p.offers.some((o: any) => !shop || o.shopId === shop));
  return (
    <View className="bg-white flex-1">
      <View className="bg-brand px-4 pt-3 pb-4">
        <View className="flex-row items-center justify-between h-10">
          <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={back} className="w-10"><Text className="text-white text-3xl">‹</Text></Pressable>
          <Text className="text-white text-xl font-extrabold">{shop ? shops.find((s: any) => s.id === shop)?.name || "المحل" : "نتائج البحث"}</Text>
          <View className="w-10" />
        </View>
        <View className="bg-white rounded-full h-12 mt-2 px-4 flex-row items-center">
          <Pressable accessibilityRole="button" accessibilityLabel="مسح" onPress={() => { setSearch(""); browse("", category, shop); }}><Text className="text-slate-500 text-lg ml-2">✕</Text></Pressable>
          <TextInput accessibilityLabel="البحث في المنتجات" value={search} onChangeText={setSearch} onSubmitEditing={() => load(category)} placeholder="ابحث باسم القطعة أو رقمها" placeholderTextColor="#94a3b8" className="flex-1 text-right text-base" />
          <Pressable accessibilityRole="button" accessibilityLabel="بحث" onPress={() => load(category)}><Text className="text-lg ml-2">🔍</Text></Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {["", ...categories].map((k: string) => <Chip key={k || "all"} title={k || "كل الأقسام"} active={category === k} onPress={() => { setCategory(k); load(k); }} />)}
        </ScrollView>
      </View>
      {vehicles.length > 0 && (
        <View className="px-4 pt-3 flex-row-reverse items-center flex-wrap">
          <Text className="font-bold text-slate-600 ml-2">التوافق:</Text>
          <Chip title="كل العربيات" active={!fitmentVehicle} onPress={() => { setFitmentVehicle(""); setTimeout(() => load(category), 0); }} />
          {vehicles.map((v: any) => <Chip key={v.id} title={`${v.make} ${v.model}`} active={fitmentVehicle === v.id} onPress={() => { setFitmentVehicle(v.id); setTimeout(() => load(category), 0); }} />)}
        </View>
      )}
      <View className="px-4 pt-3">
        <Text className="text-right text-slate-500 text-xs mb-2">{list.length} نتيجة</Text>
        {list.map((p: any) => {
          const offers = p.offers.filter((o: any) => !shop || o.shopId === shop);
          const best = offers.reduce((a: any, o: any) => (o.price < a.price ? o : a), offers[0]);
          return (
            <View key={p.id} className="flex-row bg-white rounded-2xl border border-slate-200 mb-3 overflow-hidden">
              <Pressable accessibilityRole="button" accessibilityLabel={"أضف " + p.title} onPress={() => add(p, best)} className="z-10 w-11 h-11 rounded-full bg-accent items-center justify-center self-center mx-3"><Text className="text-white text-2xl">+</Text></Pressable>
              <View className="flex-1 py-3 items-end">
                <Text className="font-extrabold text-base text-right">{p.title}</Text>
                <Text className="text-slate-500 text-xs">من {best?.shop?.name}</Text>
                <Text className="text-accent font-extrabold text-lg">{money(best.price)}</Text>
                <Text className="text-slate-500 text-xs">{p.brand} • {p.partNumber}</Text>
              </View>
              <Image source={img(p.image)} style={{ width: 120, height: 120, resizeMode: "contain", backgroundColor: "#fbf4ec" }} />
            <Pressable accessibilityRole="button" accessibilityLabel={p.title} onPress={() => { setSelected({ ...p, offers }); go("product"); }} className="absolute inset-0 z-[5]" />
            </View>
          );
        })}
        {!list.length && <Text className="text-center text-slate-500 my-10">مفيش نتائج. جرّب كلمة تانية.</Text>}
        {pages > 1 && (
          <View className="flex-row justify-between my-3">
            <Pressable accessibilityRole="button" accessibilityLabel="التالي" disabled={page >= pages} onPress={() => load(category, page + 1)} className={`px-5 py-3 rounded-xl bg-brand-light ${page >= pages ? "opacity-40" : ""}`}><Text className="text-brand font-bold">التالي</Text></Pressable>
            <Text className="self-center">{page} / {pages}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="السابق" disabled={page <= 1} onPress={() => load(category, page - 1)} className={`px-5 py-3 rounded-xl bg-brand-light ${page <= 1 ? "opacity-40" : ""}`}><Text className="text-brand font-bold">السابق</Text></Pressable>
          </View>
        )}
        <Text className="text-center text-xs text-slate-400 mb-4">أسعار توضيحية • راجع رقم القطعة والتوافق قبل الشراء</Text>
      </View>
    </View>
  );
}
