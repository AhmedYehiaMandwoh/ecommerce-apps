import { t, isEn } from "./i18n";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
export const API = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:4000/api";
export const BASE = process.env.EXPO_PUBLIC_ASSET_URL || "http://10.0.2.2:3000";
export const imageUrl=(path:string)=>path.startsWith('/api/media/')?API.replace(/\/api$/,'')+path:BASE+path;
export const money = (v: number) => t('{0} ج.م', (v / 100).toLocaleString(isEn ? "en-US" : "ar-EG"));
export const statuses: Record<string, string> = {
  PLACED: t('تم الطلب'),
  ACCEPTED: t('مقبول'),
  PREPARING: t('قيد التجهيز'),
  SHIPPED: t('في الطريق'),
  DELIVERED: t('تم التسليم'),
  CANCELLED: t('ملغي'),
};
export const storage = {
  get: async () =>
    Platform.OS === "web"
      ? sessionStorage.getItem("ghiyar-token")
      : SecureStore.getItemAsync("token"),
  set: async (t: string) =>
    Platform.OS === "web"
      ? sessionStorage.setItem("ghiyar-token", t)
      : SecureStore.setItemAsync("token", t),
  clear: async () =>
    Platform.OS === "web"
      ? sessionStorage.removeItem("ghiyar-token")
      : SecureStore.deleteItemAsync("token"),
};

export const egPhone = (raw: string) => {
  const t = raw.trim();
  if (t.startsWith("+")) return "+" + t.replace(/\D/g, "");
  const d = t.replace(/\D/g, "").replace(/^0+/, "").replace(/^20/, "");
  return "+20" + d;
};
