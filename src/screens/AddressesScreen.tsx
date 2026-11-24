import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header } from "../ui/kit";

export function AddressesScreen({ c }: { c: any }) {
  const { addresses, addressId, setAddressId, back, go, count } = c;
  return (
    <View className="bg-white flex-1" style={{ minHeight: 700 }}>
      <Header back onBack={back} title="عناويني" subtitle="اختر عنوانك للتوصيل" onCart={() => go("cart")} count={count} tall />
      <View className="p-4">
        {addresses.map((a: any, n: number) => {
          const on = a.id === addressId;
          return (
            <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={"عنوان " + a.label} onPress={() => setAddressId(a.id)} className={`flex-row items-center rounded-2xl p-3 mb-3 border-2 ${on ? "bg-orange-50 border-accent" : "bg-slate-50 border-slate-100"}`}>
              <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${on ? "border-accent" : "border-slate-400"}`}>{on && <View className="w-3.5 h-3.5 rounded-full bg-accent" />}</View>
              <View className="flex-1 mx-3 items-end">
                <Text className="font-extrabold text-base">{a.label}</Text>
                <Text className="text-slate-600 text-sm">📍 المدينة : {a.city}</Text>
                <Text className="text-slate-600 text-sm" numberOfLines={2}>🗺 {a.details}</Text>
              </View>
              <Image source={n % 2 ? require("../../assets/ref/building.png") : require("../../assets/ref/house.png")} style={{ width: 62, height: 58, resizeMode: "contain" }} />
            </Pressable>
          );
        })}
        {!addresses.length && <Text className="text-center text-slate-500 my-6">لسه مفيش عناوين محفوظة.</Text>}
        <Pressable accessibilityRole="button" accessibilityLabel="إضافة عنوان جديد" onPress={() => go("addaddress")} className="flex-row items-center justify-center bg-brand-light rounded-2xl p-4">
          <Text className="text-brand font-extrabold text-base ml-3">إضافة عنوان جديد</Text>
          <View className="w-9 h-9 rounded-full bg-brand items-center justify-center"><Text className="text-white text-2xl">+</Text></View>
        </Pressable>
      </View>
    </View>
  );
}
