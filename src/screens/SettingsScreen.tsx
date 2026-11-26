import { t, cx, lang, setLang } from "../i18n";
import React from "react";
import { View, Text, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Cta, Header, Input, Card, ErrorNote } from "../components";
import { storage } from "../shared";

export function SettingsScreen({ c }: { c: any }) {
  const { user, profileName, setProfileName, api, run, setUser, setToken, setCart, setNotice, setScreen, protectedOptions, setHasDevice, setPendingDevice, back, error, notice } = c;
  return (
    <View className={cx("bg-white flex-1 min-h-[600px]")}>
      <Header back onBack={back} title={t('الإعدادات')} tall />
      <View className={cx("p-4")}>
        <ErrorNote error={error} notice={notice} />
        {user ? (
          <Card>
            <Text className={cx("text-right text-slate-500 mb-2")}>{user.email || user.phone}</Text>
            <Input label={t('اسم الحساب')} value={profileName || user.name} onChange={setProfileName} />
            <Cta title={t('حفظ اسم الحساب')} onPress={() => run(async () => { setUser(await api("/me", "PATCH", { name: profileName || user.name })); setNotice(t('تم حفظ الاسم')); })} />
            <Cta title={t('خروج')} soft onPress={() => run(async () => {
              if (Platform.OS !== "web") { try { const raw = await SecureStore.getItemAsync("ghiyar-device", protectedOptions); if (raw) await api("/auth/devices/" + JSON.parse(raw).id, "DELETE"); } finally { await SecureStore.deleteItemAsync("ghiyar-device"); await SecureStore.deleteItemAsync("ghiyar-device-present"); setHasDevice(false); setPendingDevice(null); } }
              try { await api("/auth/logout", "POST"); } catch {}
              await storage.clear(); setToken(""); setUser(null); setCart([]); setScreen("home");
            })} />
          </Card>
        ) : <Text className={cx("text-center text-slate-500")}>{t('سجّل الدخول لإدارة حسابك.')}</Text>}
        <View className={cx("mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-3")}>
          <Text className={cx("text-right font-extrabold text-sm mb-2")}>{t('اللغة')}</Text>
          <Cta title="العربية" soft={lang !== "ar"} onPress={() => setLang("ar")} />
          <Cta title="English" soft={lang !== "en"} onPress={() => setLang("en")} />
          {Platform.OS !== "web" && <Text className={cx("text-right text-slate-500 text-xs")}>{t('يتم تطبيق اللغة بعد إعادة فتح التطبيق.')}</Text>}
        </View>
        <View className={cx("mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-3")}>
          <Text className={cx("text-right font-extrabold text-sm")}>{t('عن النسخة التجريبية')}</Text>
          <Text className={cx("text-right text-slate-500 text-xs mt-1")}>{t('كل المنتجات والأسعار والطلبات للتجربة فقط. الدفع كاش عند الاستلام بدون تحصيل فعلي، والتوصيل غير مفعّل.')}</Text>
        </View>
        <Text className={cx("text-center text-xs text-slate-400 mt-4")}>{t('غيار • إصدار تطوير 0.1 • لوحة التاجر والإدارة على موقع الويب فقط')}</Text>
      </View>
    </View>
  );
}
