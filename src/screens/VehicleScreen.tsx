import { t, cx, isEn } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Card, ErrorNote, Ico } from "../components";

export function VehicleScreen({ c }: { c: any }) {
  const { vehicleCatalog, vehicle, setVehicle, vehicles, api, run, personal, setNotice, back, go, count, error, notice } = c;
  const [open, setOpen] = React.useState("");
  const fields: [keyof typeof vehicle, string, string, string][] = [
    ["make", t('الماركة'), t('اختر الماركة'), "🚘"], ["model", t('الموديل'), t('اختر الموديل'), "🚘"],
    ["year", t('سنة الصنع'), t('اختر سنة الصنع'), "📅"], ["engine", t('المحرك'), t('اختر المحرك'), "⚙"],
  ];
  return (
    <View className={cx("bg-white flex-1 min-h-[700px]")}>
      <Header back onBack={back} title={t('اختار عربيتك')} subtitle={t('راجع بيانات عربيتك عشان تختار القطعة المناسبة.')} onCart={() => go("cart")} count={count} tall />
      <View style={{ backgroundColor: "#0751e8", marginTop: -14, paddingTop: 14, paddingBottom: 22 }}><Image source={require("../../assets/ref/car-full.png")} style={{ width: "100%", height: 160, resizeMode: "contain" }} /></View>
      <View className={cx("p-4 bg-white -mt-[22px]")} style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
        <ErrorNote error={error} notice={notice} />
        {(() => {
          const makes: any[] = vehicleCatalog?.makes || [];
          const mk = makes.find((m) => m.make === vehicle.make);
          const md = mk?.models.find((m: any) => m.model === vehicle.model);
          const years: number[] = md ? Array.from({ length: md.to - md.from + 1 }, (_, i) => md.to - i) : [];
          const rows: [string, string, string[], (v: string) => void, string][] = [
            [t('الماركة'), vehicle.make, makes.map((m) => m.make), (v) => setVehicle({ ...vehicle, make: v, model: "", year: "", engine: "" }), "make"],
            [t('الموديل'), vehicle.model, mk ? mk.models.map((m: any) => m.model) : [], (v) => setVehicle({ ...vehicle, model: v, year: "", engine: "" }), "model"],
            [t('سنة الصنع'), String(vehicle.year || ""), years.map(String), (v) => setVehicle({ ...vehicle, year: v }), "year"],
            [t('المحرك'), vehicle.engine, md ? md.engines : [], (v) => setVehicle({ ...vehicle, engine: v }), "engine"],
          ];
          return rows.map(([label, val, opts, onPick, k]) => {
            const isOpen = open === k;
            const placeholder = k === "make" ? t('اختر الماركة') : k === "model" ? t('اختر الموديل') : k === "year" ? t('اختر سنة الصنع') : t('اختر المحرك');
            return (
              <View key={k} className={cx("mb-2.5")}>
                <View className={cx("flex-row-reverse items-center")}>
                  <View className={cx("flex-row-reverse items-center rounded-2xl w-[142px] bg-[#eef3fb] px-[10px] h-[54px]")} style={{ justifyContent: "flex-start" }}><Ico n={k === "year" ? "v-cal" : k === "engine" ? "v-engine" : "v-car"} size={26} /><Text className={cx("font-extrabold text-base")} style={isEn ? { marginLeft: 8 } : { marginRight: 8 }}>{label}</Text></View>
                  <Pressable accessibilityRole="button" accessibilityLabel={`${placeholder}${val ? ": " + val : ""}`} onPress={() => setOpen(isOpen ? "" : k)} className={cx("flex-1 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 ml-2")} style={{ height: 54, shadowColor: "#0f172a", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
                    <Text className={cx("text-slate-400")}>{isOpen ? "▲" : "▼"}</Text>
                    <Text className={cx(val ? "text-slate-900 font-bold flex-1 text-right text-base" : "text-slate-400 flex-1 text-right text-base")}>{val || placeholder}</Text>
                  </Pressable>
                </View>
                {isOpen ? (
                  <View className={cx("mt-1 rounded-xl border border-slate-200 bg-white overflow-hidden")}>
                    {opts.length ? opts.map((o) => (
                      <Pressable key={o} accessibilityRole="button" accessibilityLabel={o} onPress={() => { onPick(o); setOpen(""); }} className={cx(`px-4 py-3 border-b border-slate-100 ${val === o ? "bg-brand-light" : ""}`)}>
                        <Text className={cx(`text-right ${val === o ? "font-extrabold text-brand" : "text-slate-700"}`)}>{o}</Text>
                      </Pressable>
                    )) : <Text className={cx("text-slate-400 text-sm text-right p-3")}>{k === "make" ? t('لا توجد ماركات متاحة') : t('اختر الحقل السابق أولًا')}</Text>}
                  </View>
                ) : null}
              </View>
            );
          });
        })()}
        <Cta title={t('حفظ العربية')} disabled={!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.engine} onPress={() => run(async () => { await api("/vehicles", "POST", { ...vehicle, year: Number(vehicle.year) }); await personal(); setNotice(t('تم حفظ العربية. التوافق يحتاج مراجعة منفصلة.')); })} />
        {vehicles.map((v: any) => <Card key={v.id} className={cx("mt-3")}><Text className={cx("text-right font-bold")}>{v.make} {v.model} • {v.year} • {v.engine}</Text></Card>)}
      </View>
    </View>
  );
}
