import React from "react";
import { View, Text, Pressable, Image, TextInput } from "react-native";

export const art = {
  logo: require("../../assets/reference-logo.png"),
  cart: require("../../assets/cart-icon.png"),
  car: require("../../assets/car-icon.png"),
  store: require("../../assets/store-white.png"),
};

export function Cta({ title, onPress, disabled, outline, soft, testID, chevron, icon, chevronSide }: { chevron?: boolean; title: string; onPress: () => void; disabled?: boolean; outline?: boolean; soft?: boolean; testID?: string; icon?: string; chevronSide?: "left" | "right" }) {
  const base = "rounded-2xl py-4 px-5 items-center justify-center mt-3";
  const tone = outline ? "bg-white border-2 border-brand" : soft ? "bg-brand-light" : "bg-accent";
  const text = outline || soft ? "text-brand font-extrabold text-lg" : "text-white font-extrabold text-lg";
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} className={`${base} ${tone} ${disabled ? "opacity-50" : ""}`}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>{!!icon && <View style={{ marginRight: 8 }}><Ico n={icon} size={24} color={outline || soft ? "#0751e8" : "#fff"} /></View>}<Text className={text}>{title.replace(/\s*‹$/, "")}</Text></View>
      {(chevron || /‹\s*$/.test(title)) && <View style={{ position: "absolute", [chevronSide === "right" ? "right" : "left"]: 16, top: 0, bottom: 0, justifyContent: "center" }}><View style={chevronSide === "right" ? { transform: [{ scaleX: -1 }] } : undefined}><Ico n="chev" size={22} color="#fff" /></View></View>}
    </Pressable>
  );
}

export const icons: Record<string, any> = {
  chev: require("../../assets/icons/chev.png"), search: require("../../assets/icons/search.png"), home: require("../../assets/icons/home.png"), shop: require("../../assets/icons/shop.png"), truck: require("../../assets/icons/truck.png"), car: require("../../assets/icons/car.png"),
  ticket: require("../../assets/icons/ticket.png"), pin: require("../../assets/icons/pin.png"),
  "f-pin": require("../../assets/icons/f-pin.png"), "f-map": require("../../assets/icons/f-map.png"), "f-road": require("../../assets/icons/f-road.png"),
  "send": require("../../assets/icons/send.png"), "f-doc": require("../../assets/icons/f-doc.png"), "f-landmark": require("../../assets/icons/f-landmark.png"),
  "v-car": require("../../assets/icons/v-car.png"), "v-cal": require("../../assets/icons/v-cal.png"), "v-engine": require("../../assets/icons/v-engine.png"),
};
// Icons are cropped from the supplied PDF and used as tintable masks.
export function Ico({ n, size = 22, color = "#0b2a5b" }: { n: string; size?: number; color?: string }) {
  return <Image accessibilityElementsHidden importantForAccessibility="no-hide-descendants" source={icons[n]} style={{ width: size, height: size, resizeMode: "contain", tintColor: color }} />;
}

export function Header({ title, subtitle, back, onBack, count, onCart, tall, small }: { small?: boolean; title?: string; subtitle?: string; back?: boolean; onBack?: () => void; count?: number; onCart?: () => void; tall?: boolean }) {
  return (
    <View className={`bg-brand px-4 ${tall ? "pb-6" : small ? "pb-3" : "pb-4"} pt-3`} style={tall ? { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 } : undefined}>
      <View className="flex-row items-center justify-between h-12">
        {back ? (
          <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={onBack} className="w-10 h-10 items-center justify-center">
            <Text className="text-white text-3xl">‹</Text>
          </Pressable>
        ) : <View className="w-10" />}
        <Image source={art.logo} style={{ width: 92, height: 40, resizeMode: "contain" }} />
        {onCart ? (
          <Pressable accessibilityRole="button" accessibilityLabel="السلة" onPress={onCart} className="w-10 h-10 items-center justify-center">
            <Image source={art.cart} style={{ width: 28, height: 28, resizeMode: "contain" }} />
            {!!count && <View className="absolute top-0 right-0 bg-accent rounded-full min-w-[18px] h-[18px] items-center justify-center"><Text className="text-white text-[11px] font-bold">{count}</Text></View>}
          </Pressable>
        ) : <View className="w-10" />}
      </View>
      {!!title && <Text className={small ? "text-white text-lg font-extrabold text-center -mt-2" : tall ? "text-white text-3xl font-extrabold text-center mt-1" : "text-white text-2xl font-extrabold text-center mt-1"}>{title}</Text>}
      {!!subtitle && <Text className="text-white/90 text-sm text-center mt-1">{subtitle}</Text>}
    </View>
  );
}

export function Card({ children, className = "", onPress }: { children: React.ReactNode; className?: string; onPress?: () => void }) {
  const cls = `${/\bbg-/.test(className) ? "" : "bg-white "}rounded-2xl border ${/\bborder-/.test(className) ? "" : "border-slate-200 "}${/\bp-\d/.test(className) ? "" : "p-3 "}${/\bmb-/.test(className) ? "" : "mb-3 "}${className}`;
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} className={cls}>{children}</Pressable> : <View className={cls}>{children}</View>;
}

export function Input({ label, icon, value, onChange, placeholder, numeric, secure, multiline, inline, compact }: { compact?: boolean; inline?: boolean; label?: string; icon?: string; value: string; onChange: (t: string) => void; placeholder?: string; numeric?: boolean; secure?: boolean; multiline?: boolean }) {
  if (inline) return (
    <View className="flex-row-reverse items-center bg-white border border-slate-200 rounded-2xl px-3 mb-1.5 overflow-hidden" style={{ height: 46, shadowColor: "#0f172a", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}>
      <View className="flex-row-reverse items-center" style={{ maxWidth: "64%" }}>{icon && icons[icon] ? <View className="ml-2"><Ico n={icon} size={24} /></View> : icon ? <Text className="ml-2">{icon}</Text> : null}<Text className={`text-right font-bold text-slate-900 ${(label || "").length > 12 ? "text-sm" : "text-base"}`} numberOfLines={1}>{label}</Text></View>
      <TextInput accessibilityLabel={label || placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94a3b8" keyboardType={numeric ? "numeric" : "default"} secureTextEntry={secure} className="flex-1 mr-3 text-base" style={{ textAlign: "left", height: 48, minWidth: 0, width: 0, outlineStyle: "none", outlineWidth: 0 } as any} />
    </View>
  );
  return (
    <View className="mb-3">
      {!!label && <View className="flex-row items-center mb-1">{icon && icons[icon] ? <View className="ml-2"><Ico n={icon} size={18} /></View> : null}<Text className="text-right font-bold text-slate-900">{icon && !icons[icon] ? icon + "  " : ""}{label}</Text></View>}
      <TextInput accessibilityLabel={label || placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94a3b8" keyboardType={numeric ? "numeric" : "default"} secureTextEntry={secure} multiline={multiline} className={`bg-white border border-slate-200 rounded-xl px-4 text-right text-base ${multiline ? (compact ? "py-1 min-h-[52px]" : "py-2 min-h-[70px]") : "h-12"}`} />
    </View>
  );
}

export function Chip({ title, active, onPress }: { title: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} className={`px-4 py-2 rounded-xl ml-2 ${active ? "bg-brand" : "bg-brand-light"}`}>
      <Text className={active ? "text-white font-bold" : "text-slate-700 font-bold"}>{title}</Text>
    </Pressable>
  );
}

export function Stepper({ value, onMinus, onPlus }: { value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <View className="flex-row items-center border border-slate-300 rounded-xl overflow-hidden self-start">
      <Pressable accessibilityRole="button" accessibilityLabel="تقليل" onPress={onMinus} className="w-10 h-10 items-center justify-center"><Text className="text-xl text-brand">−</Text></Pressable>
      <Text className="w-10 text-center font-bold">{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="زيادة" onPress={onPlus} className="w-10 h-10 items-center justify-center"><Text className="text-xl text-brand">+</Text></Pressable>
    </View>
  );
}

export function ErrorNote({ error, notice }: { error?: string; notice?: string }) {
  return (
    <>
      {!!error && <Text accessibilityRole="alert" className="bg-red-50 text-red-700 rounded-xl p-3 mb-3 text-right">{error}</Text>}
      {!!notice && <Text className="bg-green-50 text-green-800 rounded-xl p-3 mb-3 text-right">{notice}</Text>}
    </>
  );
}
