import { t, cx } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Header, Card, Ico, FavoriteRow } from "../components";
import { img, thumb } from "../ui/helpers";

export function FavoritesScreen({ c }: { c: any }) {
  const { favorites, favorite, api, run, setSelected, go, back } = c;
  return (
    <View className={cx("bg-white flex-1 min-h-[600px]")}>
      <Header back onBack={back} title={t('المفضلة')} subtitle={t('القطع والمنتجات المحفوظة')} tall />
      <View className={cx("p-4")}>
        {!favorites.length && <Text className={cx("text-center text-slate-500 my-8")}>{t('لا توجد عناصر محفوظة')}</Text>}
        {favorites.map((p: any) => (
          <FavoriteRow key={p.id} p={p} onRemove={() => favorite(p)} onOpen={() => run(async () => { setSelected(await api("/products/" + p.id)); go("product"); })} />
        ))}
      </View>
    </View>
  );
}
