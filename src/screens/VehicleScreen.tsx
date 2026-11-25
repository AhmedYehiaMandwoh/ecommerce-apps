import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, ErrorNote, Ico } from "../ui/kit";

export function VehicleScreen({ c }: { c: any }) {
  const { vehicleCatalog, vehicle, setVehicle, vehicles, api, run, personal, setNotice, back, go, count, error, notice } = c;
  const [open, setOpen] = React.useState("");
  const fields: [keyof typeof vehicle, string, string, string][] = [
    ["make", "الماركة", "اختر الماركة", "🚘"], ["model", "الموديل", "اختر الموديل", "🚘"],
    ["year", "سنة الصنع", "اختر سنة الصنع", "📅"], ["engine", "المحرك", "اختر المحرك", "⚙"],
  ];
  return (
    <View className="bg-white flex-1" style={{ minHeight: 700 }}>
      <Header back onBack={back} title="اختار عربيتك" subtitle="راجع بيانات عربيتك عشان تختار القطعة المناسبة." onCart={() => go("cart")} count={count} tall />
      <View style={{ backgroundColor: "#0751e8", marginTop: -14, paddingTop: 14 }}><Image source={require("../../assets/ref/car.png")} style={{ width: "100%", height: 205, resizeMode: "contain" }} /></View>
      <View className="p-4 bg-white" style={{ marginTop: -22, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
        <ErrorNote error={error} notice={notice} />
        {(() => {
          const makes: any[] = vehicleCatalog?.makes || [];
          const mk = makes.find((m) => m.make === vehicle.make);
          const md = mk?.models.find((m: any) => m.model === vehicle.model);
          const years: number[] = md ? Array.from({ length: md.to - md.from + 1 }, (_, i) => md.to - i) : [];
          const rows: [string, string, string[], (v: string) => void, string][] = [
            ["الماركة", vehicle.make, makes.map((m) => m.make), (v) => setVehicle({ ...vehicle, make: v, model: "", year: "", engine: "" }), "make"],
            ["الموديل", vehicle.model, mk ? mk.models.map((m: any) => m.model) : [], (v) => setVehicle({ ...vehicle, model: v, year: "", engine: "" }), "model"],
            ["سنة الصنع", String(vehicle.year || ""), years.map(String), (v) => setVehicle({ ...vehicle, year: v }), "year"],
            ["المحرك", vehicle.engine, md ? md.engines : [], (v) => setVehicle({ ...vehicle, engine: v }), "engine"],
          ];
          return rows.map(([label, val, opts, onPick, k]) => {
            const isOpen = open === k;
            const placeholder = k === "make" ? "اختر الماركة" : k === "model" ? "اختر الموديل" : k === "year" ? "اختر سنة الصنع" : "اختر المحرك";
            return (
              <View key={k} className="mb-2">
                <View className="flex-row-reverse items-center">
                  <View className="w-32 flex-row-reverse items-center justify-start"><Ico n={k === "year" ? "v-cal" : k === "engine" ? "v-engine" : "v-car"} size={22} /><Text className="font-extrabold mr-2 text-base">{label}</Text></View>
                  <Pressable accessibilityRole="button" accessibilityLabel={`${placeholder}${val ? ": " + val : ""}`} onPress={() => setOpen(isOpen ? "" : k)} className="flex-1 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 ml-3">
                    <Text className="text-slate-400">{isOpen ? "▲" : "▼"}</Text>
                    <Text className={val ? "text-slate-900 font-bold flex-1 text-right text-base" : "text-slate-400 flex-1 text-right text-base"}>{val || placeholder}</Text>
                  </Pressable>
                </View>
                {isOpen ? (
                  <View className="mt-1 rounded-xl border border-slate-200 bg-white overflow-hidden">
                    {opts.length ? opts.map((o) => (
                      <Pressable key={o} accessibilityRole="button" accessibilityLabel={o} onPress={() => { onPick(o); setOpen(""); }} className={`px-4 py-3 border-b border-slate-100 ${val === o ? "bg-brand-light" : ""}`}>
                        <Text className={`text-right ${val === o ? "font-extrabold text-brand" : "text-slate-700"}`}>{o}</Text>
                      </Pressable>
                    )) : <Text className="text-slate-400 text-sm text-right p-3">{k === "make" ? "لا توجد ماركات متاحة" : "اختر الحقل السابق أولًا"}</Text>}
                  </View>
                ) : null}
              </View>
            );
          });
        })()}
        <Cta title="حفظ العربية" disabled={!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.engine} onPress={() => run(async () => { await api("/vehicles", "POST", { ...vehicle, year: Number(vehicle.year) }); await personal(); setNotice("تم حفظ العربية. التوافق يحتاج مراجعة منفصلة."); })} />
        {vehicles.map((v: any) => <Card key={v.id} className="mt-3"><Text className="text-right font-bold">{v.make} {v.model} • {v.year} • {v.engine}</Text></Card>)}
      </View>
    </View>
  );
}
