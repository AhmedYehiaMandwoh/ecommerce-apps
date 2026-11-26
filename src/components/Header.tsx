import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { t, cx } from "../i18n";
import { art, Chev } from "./Icons";

export function Header({ title, subtitle, back, onBack, count, onCart, tall, small, sheet }: { sheet?: boolean; small?: boolean; title?: string; subtitle?: string; back?: boolean; onBack?: () => void; count?: number; onCart?: () => void; tall?: boolean }) {
  const hdr = (
    <View className={cx(`bg-brand px-4 ${tall ? "pb-6" : small ? "pb-3" : "pb-4"} pt-3`)} style={{ ...(tall ? { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 } : {}), ...(sheet ? { paddingBottom: 26 } : {}) }}>
      <View className={cx("flex-row items-center justify-between h-12")}>
        {back ? (
          <Pressable accessibilityRole="button" accessibilityLabel={t('رجوع')} onPress={onBack} className={cx("w-10 h-10 items-center justify-center")}>
            <Chev dir="left" color="#fff" size={13} />
          </Pressable>
        ) : <View className={cx("w-10")} />}
        <Image source={art.logo} style={{ width: 92, height: 40, resizeMode: "contain" }} />
        {onCart ? (
          <Pressable accessibilityRole="button" accessibilityLabel={t('السلة')} onPress={onCart} className={cx("w-10 h-10 items-center justify-center")}>
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className={cx("absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center")}><Text className={cx("text-white text-[11px] font-bold")}>{count}</Text></View>}
          </Pressable>
        ) : <View className={cx("w-10")} />}
      </View>
      {!!title && <Text className={cx(small ? "text-white text-lg font-extrabold text-center -mt-2" : tall ? "text-white text-3xl font-extrabold text-center mt-1" : "text-white text-2xl font-extrabold text-center mt-1")}>{title}</Text>}
      {!!subtitle && <Text className={cx("text-white/90 text-sm text-center mt-1")}>{subtitle}</Text>}
    </View>
  );
  return sheet ? <View style={{ backgroundColor: "#0057d9" }}>{hdr}<View style={{ height: 22, marginTop: -22, backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24 }} /></View> : hdr;
}
