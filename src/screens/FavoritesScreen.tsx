import { t, cx } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Header, Card, Ico } from "../ui/kit";
import { img } from "../ui/helpers";

export function FavoritesScreen({ c }: { c: any }) {
  const { favorites, favorite, api, run, setSelected, go, back } = c;
  return (
    <View className={cx("bg-white flex-1")} style={{ minHeight: 600 }}>
      <Header back onBack={back} title={t('المفضلة')} subtitle={t('القطع والمنتجات المحفوظة')} tall />
      <View className={cx("p-4")}>
        {!favorites.length && <Text className={cx("text-center text-slate-500 my-8")}>{t('لا توجد عناصر محفوظة')}</Text>}
        {favorites.map((p: any) => (
          <Card key={p.id} className={cx("flex-row items-center")}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('إزالة {0}', p.title)} onPress={() => favorite(p)} className={cx("w-10 h-10 items-center justify-center")}><Ico n="heart-on" size={22} color="#ef4444" /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={t('تفاصيل {0}', p.title)} className={cx("flex-1 flex-row items-center")} onPress={() => run(async () => { setSelected(await api("/products/" + p.id)); go("product"); })}>
              <View className={cx("flex-1 items-end mx-2")}><Text className={cx("font-bold text-right")}>{p.title}</Text></View>
              <Image source={img(p.image)} style={{ width: 70, height: 60, resizeMode: "contain", backgroundColor: "#f3eee8", borderRadius: 10 }} />
            </Pressable>
          </Card>
        ))}
      </View>
    </View>
  );
}
