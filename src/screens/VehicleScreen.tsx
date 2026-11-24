import React from "react";
import { View, Text, Image } from "react-native";
import { Cta, Header, Chip, Card, ErrorNote } from "../ui/kit";

export function VehicleScreen({ c }: { c: any }) {
  const { vehicleCatalog, vehicle, setVehicle, vehicles, api, run, personal, setNotice, back, go, count, error, notice } = c;
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
        {(() => {
          const makes: any[] = vehicleCatalog?.makes || [];
          const mk = makes.find((m) => m.make === vehicle.make);
          const md = mk?.models.find((m: any) => m.model === vehicle.model);
          const years: number[] = md ? Array.from({ length: md.to - md.from + 1 }, (_, i) => md.to - i) : [];
          const rows: [string, string, string[], (v: string) => void, string][] = [
            ["🚘 الماركة", vehicle.make, makes.map((m) => m.make), (v) => setVehicle({ ...vehicle, make: v, model: "", year: "", engine: "" }), "make"],
            ["🚘 الموديل", vehicle.model, mk ? mk.models.map((m: any) => m.model) : [], (v) => setVehicle({ ...vehicle, model: v, year: "", engine: "" }), "model"],
            ["📅 سنة الصنع", String(vehicle.year || ""), years.map(String), (v) => setVehicle({ ...vehicle, year: v }), "year"],
            ["⚙ المحرك", vehicle.engine, md ? md.engines : [], (v) => setVehicle({ ...vehicle, engine: v }), "engine"],
          ];
          return rows.map(([label, val, opts, onPick, k]) => (
            <View key={k} className="mb-3">
              <Text className="text-right font-extrabold mb-1">{label}</Text>
              <View className="flex-row-reverse flex-wrap">
                {opts.length ? opts.map((o) => <Chip key={o} title={o} active={val === o} onPress={() => onPick(o)} />) : <Text className="text-slate-400 text-sm text-right">{k === "make" ? "لا توجد ماركات متاحة" : "اختر الحقل السابق أولًا"}</Text>}
              </View>
            </View>
          ));
        })()}
        <Cta title="حفظ العربية" disabled={!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.engine} onPress={() => run(async () => { await api("/vehicles", "POST", { ...vehicle, year: Number(vehicle.year) }); await personal(); setNotice("تم حفظ العربية. التوافق يحتاج مراجعة منفصلة."); })} />
        {vehicles.map((v: any) => <Card key={v.id} className="mt-3"><Text className="text-right font-bold">🚘 {v.make} {v.model} • {v.year} • {v.engine}</Text></Card>)}
      </View>
    </View>
  );
}
