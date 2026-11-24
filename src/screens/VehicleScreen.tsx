import React from "react";
import { View, Text, Image } from "react-native";
import { Cta, Header, Input, Card, ErrorNote } from "../ui/kit";

export function VehicleScreen({ c }: { c: any }) {
  const { vehicle, setVehicle, vehicles, api, run, personal, setNotice, back, go, count, error, notice } = c;
  const fields: [keyof typeof vehicle, string, string, string][] = [
    ["make", "الماركة", "اختر الماركة", "🚘"], ["model", "الموديل", "اختر الموديل", "🚘"],
    ["year", "سنة الصنع", "اختر سنة الصنع", "📅"], ["engine", "المحرك", "اختر المحرك", "⚙"],
  ];
  return (
    <View className="bg-white flex-1" style={{ minHeight: 700 }}>
      <Header back onBack={back} title="اختار عربيتك" subtitle="راجع بيانات عربيتك عشان تختار القطعة المناسبة." onCart={() => go("cart")} count={count} tall />
      <Image source={require("../../assets/ref/car.png")} style={{ width: "100%", height: 170, resizeMode: "cover" }} />
      <View className="p-4">
        <ErrorNote error={error} notice={notice} />
        {fields.map(([k, label, ph, icon]) => (
          <View key={String(k)} className="flex-row items-center mb-3">
            <View className="flex-1"><Input value={String(vehicle[k])} onChange={(v) => setVehicle({ ...vehicle, [k]: v })} placeholder={ph} numeric={k === "year"} /></View>
            <Text className="w-24 text-right font-extrabold mb-3 mr-1">{icon} {label}</Text>
          </View>
        ))}
        <Cta title="حفظ العربية" onPress={() => run(async () => { await api("/vehicles", "POST", { ...vehicle, year: Number(vehicle.year) }); await personal(); setNotice("تم حفظ العربية. التوافق يحتاج مراجعة منفصلة."); })} />
        {vehicles.map((v: any) => <Card key={v.id} className="mt-3"><Text className="text-right font-bold">🚘 {v.make} {v.model} • {v.year} • {v.engine}</Text></Card>)}
      </View>
    </View>
  );
}
