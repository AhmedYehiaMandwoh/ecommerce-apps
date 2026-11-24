import React from "react";
import { View, Text, Pressable, Image, TextInput } from "react-native";

export const art = {
  logo: require("../../assets/reference-logo.png"),
  cart: require("../../assets/cart-icon.png"),
  car: require("../../assets/car-icon.png"),
  store: require("../../assets/store-white.png"),
};

export function Cta({ title, onPress, disabled, outline, soft, testID }: { title: string; onPress: () => void; disabled?: boolean; outline?: boolean; soft?: boolean; testID?: string }) {
  const base = "rounded-2xl py-4 px-5 items-center justify-center mt-3";
  const tone = outline ? "bg-white border-2 border-brand" : soft ? "bg-brand-light" : "bg-accent";
  const text = outline || soft ? "text-brand font-extrabold text-lg" : "text-white font-extrabold text-lg";
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} className={`${base} ${tone} ${disabled ? "opacity-50" : ""}`}>
      <Text className={text}>{title}</Text>
    </Pressable>
  );
}

export function Header({ title, subtitle, back, onBack, count, onCart, tall }: { title?: string; subtitle?: string; back?: boolean; onBack?: () => void; count?: number; onCart?: () => void; tall?: boolean }) {
  return (
    <View className={`bg-brand px-4 ${tall ? "pb-6" : "pb-4"} pt-3`} style={tall ? { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 } : undefined}>
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
      {!!title && <Text className="text-white text-2xl font-extrabold text-center mt-1">{title}</Text>}
      {!!subtitle && <Text className="text-white/90 text-sm text-center mt-1">{subtitle}</Text>}
    </View>
  );
}

export function Card({ children, className = "", onPress }: { children: React.ReactNode; className?: string; onPress?: () => void }) {
  const cls = `bg-white rounded-2xl border border-slate-200 p-3 mb-3 ${className}`;
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} className={cls}>{children}</Pressable> : <View className={cls}>{children}</View>;
}

export function Input({ label, icon, value, onChange, placeholder, numeric, secure, multiline }: { label?: string; icon?: string; value: string; onChange: (t: string) => void; placeholder?: string; numeric?: boolean; secure?: boolean; multiline?: boolean }) {
  return (
    <View className="mb-3">
      {!!label && <Text className="text-right font-bold text-slate-900 mb-1">{icon ? icon + "  " : ""}{label}</Text>}
      <TextInput accessibilityLabel={label || placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94a3b8" keyboardType={numeric ? "numeric" : "default"} secureTextEntry={secure} multiline={multiline} className={`bg-white border border-slate-200 rounded-xl px-4 text-right text-base ${multiline ? "py-3 min-h-[90px]" : "h-12"}`} />
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
      <Pressable accessibilityRole="button" accessibilityLabel="زيادة" onPress={onPlus} className="w-10 h-10 items-center justify-center"><Text className="text-xl text-brand">+</Text></Pressable>
      <Text className="w-10 text-center font-bold">{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="تقليل" onPress={onMinus} className="w-10 h-10 items-center justify-center"><Text className="text-xl text-brand">−</Text></Pressable>
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
