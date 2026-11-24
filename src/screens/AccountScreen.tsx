import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Cta } from "../ui/kit";

const acctImg: Record<string, any> = {
  car: require("../../assets/acct-car.png"), pin: require("../../assets/acct-pin.png"), heart: require("../../assets/acct-heart.png"),
  headset: require("../../assets/acct-headset.png"), gear: require("../../assets/acct-gear.png"),
};
const rows: [string, string, string, string, string][] = [
  ["vehicle", "عرباتي", "إدارة سياراتك", "car", "bg-blue-100"],
  ["addresses", "عناويني", "إدارة عناوين التوصيل", "pin", "bg-orange-100"],
  ["favorites", "المفضلة", "القطع والمنتجات المحفوظة", "heart", "bg-red-100"],
  ["support", "المساعدة", "مركز الدعم والمساعدة", "headset", "bg-green-100"],
  ["settings", "الإعدادات", "تخصيص التطبيق", "gear", "bg-purple-100"],
];
export function AccountScreen({ c }: { c: any }) {
  const { user, go } = c;
  return (
    <View className="bg-white flex-1 px-4 pt-4" style={{ minHeight: 700 }}>
      <View className="flex-row items-center justify-center">
        <Pressable accessibilityRole="button" accessibilityLabel="إعدادات التطبيق" onPress={() => go("settings")} style={{ position: "absolute", right: 4 }}><Text style={{ fontSize: 28, color: "#0f172a" }}>⚙︎</Text></Pressable>
        <Text className="text-xl font-extrabold text-center">حسابي</Text>
      </View>
      <View className="items-center my-2">
        <Image accessibilityElementsHidden source={require("../../assets/acct-avatar.png")} style={{ width: 92, height: 92 }} />
        <Text className="text-lg font-extrabold mt-1">{user ? user.name : "ضيف"}</Text>
        <Text className="text-slate-500 text-sm">{user ? "مرحبا بك في غيار" : "سجّل الدخول عشان تحفظ عربيتك وعناوينك"}</Text>
        {!user && <View className="w-full"><Cta title="تسجيل الدخول" onPress={() => go("phone")} /></View>}
      </View>
      {rows.map(([s, t, sub, icon, bg]) => (
        <Pressable key={s} accessibilityRole="button" accessibilityLabel={t} onPress={() => go(user || s === "support" ? s : "phone")} className="flex-row items-center bg-slate-50 rounded-2xl p-2 mb-2 border border-slate-100">
          <Text className="text-slate-500 text-2xl ml-2">‹</Text>
          <View className="flex-1 mr-3 items-end"><Text className="font-extrabold text-base">{t}</Text><Text className="text-slate-500 text-sm">{sub}</Text></View>
          <Image accessibilityElementsHidden source={acctImg[icon]} style={{ width: 44, height: 44 }} />
        </Pressable>
      ))}
    </View>
  );
}
