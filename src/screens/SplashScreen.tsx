import { t, cx } from "../i18n";
import React from "react";
import { View, Text, Image } from "react-native";
import { Cta, art } from "../components";

export function SplashScreen({ c }: { c: any }) {
  const { go, setScreen } = c;
  return (
    <View className={cx("flex-1 bg-white items-center min-h-[760px]")}>
      <View className={cx("w-full bg-brand items-center pt-6 pb-2")}>
        <Image source={art.logo} style={{ width: 150, height: 68, resizeMode: "contain" }} />
        <Text className={cx("text-white font-extrabold text-center mt-3 px-8 text-[40px] leading-[50px]")}>{t('كل اللي عربيتك')}{"\n"}{t('محتاجاه.')}</Text>
        <Text className={cx("text-white text-base text-center mt-2")}>{t('من محلات كتير .. في')} <Text className={cx("font-extrabold")}>{t('مكان واحد')}</Text></Text>
      </View>
      <View className={cx("w-full h-[224px]")}>
        <Image source={require("../../assets/ref/onboard-hero.png")} style={{ width: "100%", height: 224, resizeMode: "cover" }} />
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
          {Array.from({ length: 10 }, (_, i) => <View key={i} style={{ height: 6, backgroundColor: "#0751e8", opacity: 1 - i / 10 }} />)}
        </View>
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          {Array.from({ length: 14 }, (_, i) => <View key={i} style={{ height: 6, backgroundColor: "#ffffff", opacity: i / 14 }} />)}
        </View>
      </View>
      <View className={cx("flex-row mt-0")}>
        {[0, 1, 2, 3].map((n) => <View key={n} className={cx(`w-2 h-2 rounded-full mx-1 ${n === 0 ? "bg-brand" : "bg-slate-300"}`)} />)}
      </View>
      <View className={cx("w-full px-6 mt-0")} style={{ marginTop: -4 }}>
        <Cta chevron chevronSide="right" title={t('ابدأ الآن ‹')} onPress={() => setScreen("home")} />
        <Cta title={t('تسجيل الدخول')} outline onPress={() => go("phone")} />
      </View>
      <View className={cx("w-full bg-white mt-3")}>
        <Image source={require("../../assets/ref/skyline.png")} style={{ width: "100%", height: 96, resizeMode: "cover" }} />
        <Text className={cx("text-center text-slate-600 text-xs")}>{t('غيار .. طريق أفضل لعربيتك')}</Text>
        <Text className={cx("text-center text-slate-400 text-[11px] pb-2")}>{t('نسخة تجريبية • الدفع والتوصيل غير مفعّلين')}</Text>
      </View>
    </View>
  );
}
