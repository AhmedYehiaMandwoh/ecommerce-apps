import React from "react";
import { View, Text, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Cta, Header, Input, Card, ErrorNote } from "../ui/kit";
import { storage } from "../shared";

export function SettingsScreen({ c }: { c: any }) {
  const { user, profileName, setProfileName, api, run, setUser, setToken, setCart, setNotice, setScreen, protectedOptions, setHasDevice, setPendingDevice, back, error, notice } = c;
  return (
    <View className="bg-white flex-1" style={{ minHeight: 600 }}>
      <Header back onBack={back} title="الإعدادات" tall />
      <View className="p-4">
        <ErrorNote error={error} notice={notice} />
        {user ? (
          <Card>
            <Text className="text-right text-slate-500 mb-2">{user.email || user.phone}</Text>
            <Input label="اسم الحساب" value={profileName || user.name} onChange={setProfileName} />
            <Cta title="حفظ اسم الحساب" onPress={() => run(async () => { setUser(await api("/me", "PATCH", { name: profileName || user.name })); setNotice("تم حفظ الاسم"); })} />
            <Cta title="خروج" soft onPress={() => run(async () => {
              if (Platform.OS !== "web") { try { const raw = await SecureStore.getItemAsync("ghiyar-device", protectedOptions); if (raw) await api("/auth/devices/" + JSON.parse(raw).id, "DELETE"); } finally { await SecureStore.deleteItemAsync("ghiyar-device"); await SecureStore.deleteItemAsync("ghiyar-device-present"); setHasDevice(false); setPendingDevice(null); } }
              try { await api("/auth/logout", "POST"); } catch {}
              await storage.clear(); setToken(""); setUser(null); setCart([]); setScreen("home");
            })} />
          </Card>
        ) : <Text className="text-center text-slate-500">سجّل الدخول لإدارة حسابك.</Text>}
        <Text className="text-center text-xs text-slate-400 mt-4">غيار • إصدار تطوير 0.1 • لوحة التاجر والإدارة على موقع الويب فقط</Text>
      </View>
    </View>
  );
}
