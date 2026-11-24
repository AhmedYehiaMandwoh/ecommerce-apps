import React from "react";
import { View, Text, Image } from "react-native";
import { Cta, art } from "../ui/kit";

export function SplashScreen({ c }: { c: any }) {
  const { go, setScreen } = c;
  return (
    <View className="flex-1 bg-brand pt-10 pb-6 items-center" style={{ minHeight: 760 }}>
      <Image source={art.logo} style={{ width: 170, height: 78, resizeMode: "contain" }} />
      <Text className="text-white font-extrabold text-center mt-5 px-8" style={{ fontSize: 44, lineHeight: 54 }}>كل اللي عربيتك{"\n"}محتاجاه.</Text>
      <Text className="text-white text-lg text-center mt-3">من محلات كتير .. في <Text className="font-extrabold">مكان واحد</Text></Text>
      <Image source={require("../../assets/ref/onboard-hero.png")} style={{ width: "100%", height: 300, resizeMode: "cover", marginTop: 18 }} />
      <View className="flex-row mt-3">
        {[0, 1, 2, 3].map((n) => <View key={n} className={`w-2 h-2 rounded-full mx-1 ${n === 0 ? "bg-white" : "bg-white/40"}`} />)}
      </View>
      <View className="w-full px-6 mt-4">
        <Cta title="ابدأ الآن ‹" onPress={() => setScreen("home")} />
        <Cta title="تسجيل الدخول" outline onPress={() => go("phone")} />
      </View>
      <View className="w-full bg-white mt-5">
        <Image source={require("../../assets/ref/skyline.png")} style={{ width: "100%", height: 110, resizeMode: "cover" }} />
        <Text className="text-center text-slate-600 text-xs">غيار .. طريق أفضل لعربيتك</Text>
        <Text className="text-center text-slate-400 text-[11px] pb-2">نسخة تجريبية • الدفع والتوصيل غير مفعّلين</Text>
      </View>
    </View>
  );
}
