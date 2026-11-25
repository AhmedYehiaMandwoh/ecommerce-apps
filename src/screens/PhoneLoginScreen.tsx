import React from "react";
import { View, Text, Image, Pressable, TextInput, Platform } from "react-native";
import { Cta, Input, Header, ErrorNote } from "../ui/kit";

export function PhoneLoginScreen({ c }: { c: any }) {
  const { phoneAuth, setPhoneAuth, phoneLogin, setScreen, back, go, hasDevice, unlockDevice, notice, error } = c;
  const step2 = !!phoneAuth.challengeId;
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <View className="bg-brand" style={{ height: 30 }} />
      <View className="px-5 pt-2 items-center bg-white" style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -14 }}>
        <View className="w-full flex-row items-center justify-center" style={{ height: 56 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={back} style={{ position: "absolute", left: 0, top: 0, bottom: 0, justifyContent: "center", zIndex: 5 }}><Text className="text-brand text-3xl">‹</Text></Pressable>
          <Pressable accessible={false} delayLongPress={1200} onLongPress={() => go("emaillogin")}><Image source={require("../../assets/ref/logo-blue.png")} style={{ width: 92, height: 46, resizeMode: "contain" }} /></Pressable>
        </View>
        <Text className="text-3xl font-extrabold text-brand-dark text-center">{step2 ? "كود التحقق" : "رقم موبايلك"}</Text>
        <Text className="text-slate-500 text-center mt-1">{step2 ? "اكتب الكود اللي وصلك" : "هنرسل لك رمز التحقق على موبايلك"}</Text>
        <Image source={require("../../assets/ref/phone-hero.png")} style={{ width: "100%", height: 184, resizeMode: "contain", marginVertical: 2 }} />
        <View className="w-full">
          <ErrorNote error={error} notice={notice} />
          {!step2 ? (
            <View className="flex-row items-center border border-slate-200 rounded-2xl h-16 px-3 bg-white mb-3">
              <Text className="font-extrabold text-lg" numberOfLines={1} style={{ flexShrink: 0 }}>⌄  🇪🇬 مصر +20</Text>
              <View className="w-px h-6 bg-slate-200 mx-3" />
              <TextInput accessibilityLabel="رقم الموبايل" value={phoneAuth.phone} onChangeText={(phone) => setPhoneAuth({ ...phoneAuth, phone })} placeholder="ادخل رقم الموبايل" placeholderTextColor="#94a3b8" keyboardType="phone-pad" className="flex-1 text-right text-base" style={{ minWidth: 0, width: 0 }} />
            </View>
          ) : (
            <>
              <Input label="الاسم" value={phoneAuth.name} onChange={(name) => setPhoneAuth({ ...phoneAuth, name })} placeholder="اسمك (للحساب الجديد)" />
              <Input label="كود التحقق" value={phoneAuth.code} onChange={(code) => setPhoneAuth({ ...phoneAuth, code })} placeholder="123456" numeric />
            </>
          )}
          <Cta chevronSide="right" title={step2 ? "تأكيد الكود ‹" : "إرسال رمز التحقق ‹"} onPress={phoneLogin} />
          {hasDevice && Platform.OS !== "web" && <Cta title="فتح بالبصمة" soft onPress={unlockDevice} />}
          <View className="flex-row items-center my-3"><View className="flex-1 h-px bg-slate-200" /><Text className="mx-3 text-slate-500">أو</Text><View className="flex-1 h-px bg-slate-200" /></View>
          <Cta title="تخطي الآن" soft onPress={() => setScreen("home")} />
          
        </View>
      </View>
      <View className="bg-white w-full">
        <Image source={require("../../assets/ref/skyline.png")} style={{ width: "100%", height: 92, resizeMode: "cover" }} />
        <Text className="text-center text-slate-500 text-xs pb-3">غيار .. دايماً معاك على الطريق</Text>
      </View>
    </View>
  );
}
