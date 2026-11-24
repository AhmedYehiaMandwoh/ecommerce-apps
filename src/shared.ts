import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
export const API = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:4000/api";
export const BASE = process.env.EXPO_PUBLIC_ASSET_URL || "http://10.0.2.2:3000";
export const imageUrl=(path:string)=>path.startsWith('/api/media/')?API.replace(/\/api$/,'')+path:BASE+path;
export const money = (v: number) => `${(v / 100).toLocaleString("ar-EG")} ج.م`;
export const statuses: Record<string, string> = {
  PLACED: "تم الطلب",
  ACCEPTED: "مقبول",
  PREPARING: "قيد التجهيز",
  SHIPPED: "في الطريق",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
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
