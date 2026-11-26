import { t, cx } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable, TextInput, Platform } from "react-native";
import { Cta, Input, Header, ErrorNote } from "../ui/kit";

export function PhoneLoginScreen({ c }: { c: any }) {
  const { phoneAuth, setPhoneAuth, phoneLogin, setScreen, back, go, hasDevice, unlockDevice, notice, error } = c;
  const step2 = !!phoneAuth.challengeId;
  return (
    <View className={cx("bg-white flex-1")} style={{ minHeight: 760 }}>
      <View className={cx("bg-brand")} style={{ height: 30 }} />
      <View className={cx("px-5 pt-2 items-center bg-white")} style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -14 }}>
        <View className={cx("w-full flex-row items-center justify-center")} style={{ height: 56 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('رجوع')} onPress={back} style={{ position: "absolute", left: 0, top: 0, bottom: 0, justifyContent: "center", zIndex: 5 }}><Text className={cx("text-brand text-3xl")}>‹</Text></Pressable>
          <Pressable accessible={false} delayLongPress={1200} onLongPress={() => go("emaillogin")}><Image source={require("../../assets/ref/logo-blue.png")} style={{ width: 92, height: 46, resizeMode: "contain" }} /></Pressable>
        </View>
        <Text className={cx("font-extrabold text-brand-dark text-center")} style={{ fontSize: 36, lineHeight: 44 }}>{step2 ? t('كود التحقق') : t('رقم موبايلك')}</Text>
        <Text className={cx("text-slate-500 text-center mt-1")}>{step2 ? t('اكتب الكود اللي وصلك') : t('هنرسل لك رمز التحقق على موبايلك')}</Text>
        <Image source={require("../../assets/ref/phone-hero.png")} style={{ width: "100%", height: 184, resizeMode: "contain", marginVertical: 2 }} />
        <View className={cx("w-full")}>
          <ErrorNote error={error} notice={notice} />
          {!step2 ? (
            <View className={cx("flex-row items-center border border-slate-200 rounded-2xl h-16 px-3 bg-white mb-3")}>
              <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 0 }}><Text className={cx("font-extrabold text-lg")}>⌄</Text><View style={{ width: 24, height: 16, marginHorizontal: 6, borderRadius: 2, overflow: "hidden" }}><View style={{ flex: 1, backgroundColor: "#ce1126" }} /><View style={{ flex: 1, backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e2e8f0" }} /><View style={{ flex: 1, backgroundColor: "#000" }} /></View><Text className={cx("font-extrabold text-lg")} numberOfLines={1}>{t('مصر +20')}</Text></View>
              <View className={cx("w-px h-6 bg-slate-200 mx-3")} />
              <TextInput accessibilityLabel={t('رقم الموبايل')} value={phoneAuth.phone} onChangeText={(phone) => setPhoneAuth({ ...phoneAuth, phone })} placeholder={t('ادخل رقم الموبايل')} placeholderTextColor="#94a3b8" keyboardType="phone-pad" className={cx("flex-1 text-right text-base")} style={{ minWidth: 0, width: 0 }} />
            </View>
          ) : (
            <>
              <Input label={t('الاسم')} value={phoneAuth.name} onChange={(name) => setPhoneAuth({ ...phoneAuth, name })} placeholder={t('اسمك (للحساب الجديد)')} />
              <Input label={t('كود التحقق')} value={phoneAuth.code} onChange={(code) => setPhoneAuth({ ...phoneAuth, code })} placeholder="123456" numeric />
            </>
          )}
          <Cta chevronSide="right" title={step2 ? t('تأكيد الكود ‹') : t('إرسال رمز التحقق ‹')} onPress={phoneLogin} />
          {hasDevice && Platform.OS !== "web" && <Cta title={t('فتح بالبصمة')} soft onPress={unlockDevice} />}
          <View className={cx("flex-row items-center my-3")}><View className={cx("flex-1 h-px bg-slate-200")} /><Text className={cx("mx-3 text-slate-500")}>{t('أو')}</Text><View className={cx("flex-1 h-px bg-slate-200")} /></View>
          <Cta title={t('تخطي الآن')} soft onPress={() => setScreen("home")} />
          
        </View>
      </View>
      <View className={cx("bg-white w-full")}>
        <Image source={require("../../assets/ref/skyline.png")} style={{ width: "100%", height: 92, resizeMode: "cover" }} />
        <Text className={cx("text-center text-slate-500 text-xs pb-3")}>{t('غيار .. دايماً معاك على الطريق')}</Text>
      </View>
    </View>
  );
}
