import React from "react";
import { View, Text, Pressable } from "react-native";
import { Cta } from "../ui/kit";

const rows: [string, string, string, string, string][] = [
  ["vehicle", "عرباتي", "إدارة سياراتك", "🚗", "bg-blue-100"],
  ["addresses", "عناويني", "إدارة عناوين التوصيل", "📍", "bg-orange-100"],
  ["favorites", "المفضلة", "القطع والمنتجات المحفوظة", "❤", "bg-red-100"],
  ["support", "المساعدة", "مركز الدعم والمساعدة", "🎧", "bg-green-100"],
  ["settings", "الإعدادات", "تخصيص التطبيق", "⚙", "bg-purple-100"],
];
export function AccountScreen({ c }: { c: any }) {
  const { user, go } = c;
  return (
    <View className="bg-white flex-1 px-4 pt-4" style={{ minHeight: 700 }}>
      <Text className="text-xl font-extrabold text-center">حسابي</Text>
      <View className="items-center my-4">
        <View className="w-28 h-28 rounded-full bg-blue-100 items-center justify-center"><Text className="text-6xl text-brand">👤</Text></View>
        <Text className="text-xl font-extrabold mt-3">{user ? user.name : "ضيف"}</Text>
        <Text className="text-slate-500 mt-1">{user ? "مرحبا بك في غيار" : "سجّل الدخول عشان تحفظ عربيتك وعناوينك"}</Text>
        {!user && <View className="w-full"><Cta title="تسجيل الدخول" onPress={() => go("phone")} /></View>}
      </View>
      {rows.map(([s, t, sub, icon, bg]) => (
        <Pressable key={s} accessibilityRole="button" accessibilityLabel={t} onPress={() => go(user || s === "support" ? s : "phone")} className="flex-row items-center bg-slate-50 rounded-2xl p-3 mb-3 border border-slate-100">
          <Text className="text-slate-400 text-2xl ml-2">‹</Text>
          <View className="flex-1 mr-3 items-end"><Text className="font-extrabold text-base">{t}</Text><Text className="text-slate-500 text-sm">{sub}</Text></View>
          <View className={`w-12 h-12 rounded-xl items-center justify-center ${bg}`}><Text className="text-2xl">{icon}</Text></View>
        </Pressable>
      ))}
      <View className="mt-2 mb-4 rounded-2xl bg-slate-50 border border-slate-100 p-3">
        <Text className="text-right font-extrabold text-sm">عن النسخة التجريبية</Text>
        <Text className="text-right text-slate-500 text-xs mt-1">كل المنتجات والأسعار والطلبات للتجربة فقط. الدفع كاش عند الاستلام بدون تحصيل فعلي، والتوصيل غير مفعّل.</Text>
      </View>
    </View>
  );
}
