import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, art } from "../ui/kit";

export function SplashScreen({ c }: { c: any }) {
  const { go, setScreen } = c;
  return (
    <View className="flex-1 bg-brand px-6 pt-10 pb-6 items-center" style={{ minHeight: 760 }}>
      <Image source={art.logo} style={{ width: 150, height: 70, resizeMode: "contain" }} />
      <Text className="text-white text-4xl font-extrabold text-center mt-4 leading-[48px]">كل اللي عربيتك محتاجاه.</Text>
      <Text className="text-white text-base text-center mt-2">من محلات كتير .. في <Text className="font-extrabold">مكان واحد</Text></Text>
      <Image source={require("../../assets/ref/onboard-hero.png")} style={{ width: "100%", height: 280, resizeMode: "contain", marginTop: 16 }} />
      <View className="flex-row mt-2">
        {[0, 1, 2, 3].map((n) => <View key={n} className={`w-2 h-2 rounded-full mx-1 ${n === 0 ? "bg-white" : "bg-white/40"}`} />)}
      </View>
      <View className="w-full mt-6">
        <Cta title="ابدأ الآن ‹" onPress={() => setScreen("home")} />
        <Cta title="تسجيل الدخول" outline onPress={() => go("phone")} />
      </View>
      <Text className="text-white/90 text-xs mt-6">غيار .. طريق أفضل لعربيتك</Text>
    </View>
  );
}
