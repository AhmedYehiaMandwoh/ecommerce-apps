import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Cta, Chev, Ico } from "../ui/kit";

const acctImg: Record<string, any> = {
  car: require("../../assets/acct-car.png"), pin: require("../../assets/acct-pin.png"), heart: require("../../assets/acct-heart.png"),
  headset: require("../../assets/acct-headset.png"), gear: require("../../assets/acct-gear.png"),
};
const rows: [string, string, string, string, string][] = [
  ["vehicle", t('عرباتي'), t('إدارة سياراتك'), "car", "bg-blue-100"],
  ["addresses", t('عناويني'), t('إدارة عناوين التوصيل'), "pin", "bg-orange-100"],
  ["favorites", t('المفضلة'), t('القطع والمنتجات المحفوظة'), "heart", "bg-red-100"],
  ["support", t('المساعدة'), t('مركز الدعم والمساعدة'), "headset", "bg-green-100"],
  ["settings", t('الإعدادات'), t('تخصيص التطبيق'), "gear", "bg-purple-100"],
];
export function AccountScreen({ c }: { c: any }) {
  const { user, go } = c;
  return (
    <View className={cx("bg-white flex-1 px-4 pt-4")} style={{ minHeight: 700 }}>
      <View className={cx("flex-row items-center justify-center")}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('إعدادات التطبيق')} onPress={() => go("settings")} style={{ position: "absolute", right: 4 }}><Ico n="gear" size={26} color="#0f172a" /></Pressable>
        <Text className={cx("text-xl font-extrabold text-center")}>{t('حسابي')}</Text>
      </View>
      <View className={cx("items-center my-2")}>
        <Image accessibilityElementsHidden source={require("../../assets/acct-avatar.png")} style={{ width: 104, height: 104 }} />
        <Text className={cx("text-lg font-extrabold mt-1")}>{user ? user.name : t('ضيف')}</Text>
        <Text className={cx("text-slate-500 text-sm")}>{user ? t('مرحبا بك في غيار') : t('سجّل الدخول عشان تحفظ عربيتك وعناوينك')}</Text>
        {!user && <View className={cx("w-full")}><Cta title={t('تسجيل الدخول')} onPress={() => go("phone")} /></View>}
      </View>
      {rows.map(([s, t, sub, icon, bg]) => (
        <Pressable key={s} accessibilityRole="button" accessibilityLabel={t} onPress={() => go(user || s === "support" ? s : "phone")} className={cx("flex-row items-center bg-slate-50 rounded-2xl p-3 mb-3 border border-slate-100")}>
          <Chev dir={isEn ? "right" : "left"} color="#64748b" size={10} />
          <View className={cx("flex-1 mr-3 items-end")}><Text className={cx("font-extrabold text-base")}>{t}</Text><Text className={cx("text-slate-500 text-sm")}>{sub}</Text></View>
          <Image accessibilityElementsHidden source={acctImg[icon]} style={{ width: 48, height: 48 }} />
        </Pressable>
      ))}
    </View>
  );
}
