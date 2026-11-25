import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Cta, Header, Input, Chip, ErrorNote, Ico } from "../ui/kit";

const kinds: [string, any, string][] = [["مشكلة في الطلب", require("../../assets/icons/s-warn.png"), "#fcf1eb"], ["استبدال أو إرجاع", require("../../assets/icons/s-swap.png"), "#ecf5fe"], ["سؤال عن قطعة", require("../../assets/icons/s-chat.png"), "#faf5f1"]];
export function SupportScreen({ c }: { c: any }) {
  const { support, setSupport, orders, api, run, setTickets, tickets, setNotice, back, go, count, user, error, notice } = c;
  const [kind, setKind] = useState("");
  const [orderId, setOrderId] = useState("");
  const [photo, setPhoto] = useState("");
  const [orderOpen, setOrderOpen] = useState(false);
  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], base64: true, quality: 0.5, allowsEditing: false });
    if (r.canceled || !r.assets?.[0]?.base64) return;
    const a = r.assets[0]; const mime = a.mimeType === "image/png" || a.mimeType === "image/webp" ? a.mimeType : "image/jpeg";
    if ((a.base64?.length || 0) > 1500000) { c.setError("الصورة كبيرة جدًا. اختر صورة أصغر."); return; }
    setPhoto(`data:${mime};base64,${a.base64}`);
  };
  const send = () => run(async () => {
    const subject = [kind || "مساعدة", orderId && "طلب #" + orderId.slice(0, 8)].filter(Boolean).join(" - ");
    await api("/support-tickets", "POST", { subject, message: support.message, ...(photo ? { attachment: photo } : {}) });
    setTickets(await api("/support-tickets")); setSupport({ subject: "", message: "" }); setKind(""); setOrderId(""); setPhoto("");
    setNotice("تم تسجيل رسالة الدعم داخل النظام");
  });
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header small back onBack={back} onCart={() => go("cart")} count={count} />
      <View className="px-3 pt-1">
        <Text className="text-center font-extrabold text-lg">المساعدة</Text>
        <ErrorNote error={error} notice={notice} />
        <View className="flex-row rounded-2xl overflow-hidden items-center" style={{ backgroundColor: "#f4f8fd", height: 126, marginTop: 2 }}>
          <Image source={require("../../assets/ref/support-hero.png")} style={{ width: "52%", height: 126, resizeMode: "contain" }} />
          <View className="flex-1 items-end px-3"><Text className="font-extrabold text-right text-brand" style={{ fontSize: 24, lineHeight: 30 }}>نحن هنا{"\n"}لمساعدتك</Text><Text className="text-slate-500 text-right text-sm mt-1">اختر نوع المشكلة{"\n"}وسيتم الرد عليك قريبًا</Text></View>
        </View>
        <View className="flex-row-reverse justify-between" style={{ marginVertical: 8 }}>
          {kinds.map(([t, icon, bg]) => (
            <Pressable key={t} accessibilityRole="button" accessibilityLabel={t} onPress={() => setKind(t)} className={`w-[31.5%] rounded-2xl items-center justify-center border-2 ${kind === t ? "border-accent" : "border-transparent"}`} style={{ backgroundColor: bg, height: 94 }}><Image source={icon} style={{ width: 42, height: 42, resizeMode: "contain" }} /><Text className="font-bold text-xs text-center mt-1" numberOfLines={1}>{t}</Text><Text className="text-accent text-xl" style={{ lineHeight: 20 }}>›</Text></Pressable>
          ))}
        </View>
        {!!user && !!orders.length && (<>
          <Text className="font-extrabold text-right text-base mb-1">اختر الطلب</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="اختر الطلب" onPress={() => setOrderOpen(!orderOpen)} className="flex-row-reverse items-center justify-between border border-slate-400 rounded-xl px-3 mb-2" style={{ height: 44 }}>
            <View className="flex-row-reverse items-center flex-1"><Ico n="f-doc" size={22} color="#0b2a5b" /><Text className={orderId ? "text-slate-900 font-bold mr-2 flex-1 text-right" : "text-slate-400 mr-2 flex-1 text-right"}>{orderId ? "#" + orderId.slice(0, 8) : "اختر الطلب"}</Text></View>
            <Text className="text-slate-500">{orderOpen ? "⌃" : "⌄"}</Text>
          </Pressable>
          {orderOpen && <View className="flex-row-reverse flex-wrap mb-2">{orders.slice(0, 6).map((o: any) => <Chip key={o.id} title={"#" + o.id.slice(0, 8)} active={orderId === o.id} onPress={() => { setOrderId(orderId === o.id ? "" : o.id); setOrderOpen(false); }} />)}</View>}
        </>)}
        <View className="mb-2"><Text className="text-right font-bold text-slate-900 mb-1">اكتب رسالتك</Text><View style={{ position: "relative" }}><TextInput accessibilityLabel="اكتب رسالتك" value={support.message} onChangeText={(message: string) => setSupport({ ...support, message })} placeholder="اكتب رسالتك هنا..." placeholderTextColor="#94a3b8" multiline textAlign="right" className="border border-slate-300 rounded-xl px-3 py-2 text-base text-right" style={{ minHeight: 56, paddingRight: 36 }} /><Text pointerEvents="none" style={{ position: "absolute", right: 12, top: 8, fontSize: 18, color: "#0b2a5b" }}>✎</Text></View></View>
        <Pressable accessibilityRole="button" accessibilityLabel="أضف صورة" onPress={pick} className="border border-dashed border-slate-300 rounded-xl p-2 mb-1"><Text className="text-right text-slate-600">{photo ? "📎 تم اختيار صورة • اضغط للتغيير" : "📎 أضف صورة"}</Text></Pressable>
        {!!photo && <Image source={{ uri: photo }} style={{ width: 90, height: 90, borderRadius: 10, marginBottom: 8, alignSelf: "flex-end" }} />}
        <Pressable accessibilityRole="button" accessibilityLabel="إرسال الطلب" disabled={!user || !support.message} onPress={send} className={`rounded-2xl py-3 px-5 items-center justify-center mt-3 bg-accent ${!user || !support.message ? "opacity-50" : ""}`} style={{ flexDirection: "row-reverse", justifyContent: "center" }}><Text className="text-white font-extrabold text-lg">إرسال الطلب</Text><Text className="text-white font-extrabold text-lg" style={{ marginRight: 8, transform: [{ scaleX: -1 }] }}>➤</Text></Pressable>
        {!user && <Text className="text-center text-slate-500 text-xs mt-2">سجّل الدخول عشان تبعت رسالة.</Text>}
        {tickets.map((t: any) => (
          <View key={t.id} className="bg-slate-50 rounded-xl p-3 mt-3"><Text className="text-right font-bold">{t.subject} • {t.state}</Text><Text className="text-right text-slate-600 text-sm">{t.message}</Text>{!!t.attachment && <Image source={{ uri: t.attachment }} style={{ width: 90, height: 90, borderRadius: 10, marginTop: 6, alignSelf: 'flex-end' }} />}{!!t.reply && <Text className="text-right text-brand text-sm mt-1">رد الدعم: {t.reply}</Text>}</View>
        ))}
      </View>
    </View>
  );
}
