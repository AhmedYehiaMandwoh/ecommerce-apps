import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header, Input, Chip, ErrorNote } from "../ui/kit";

const kinds: [string, string, string][] = [["مشكلة في الطلب", "⚠", "bg-red-50"], ["استبدال أو إرجاع", "🔁", "bg-blue-50"], ["سؤال عن قطعة", "💬", "bg-orange-50"]];
export function SupportScreen({ c }: { c: any }) {
  const { support, setSupport, orders, api, run, setTickets, tickets, setNotice, back, go, count, user, error, notice } = c;
  const [kind, setKind] = useState("");
  const [orderId, setOrderId] = useState("");
  const send = () => run(async () => {
    const subject = [kind || "مساعدة", orderId && "طلب #" + orderId.slice(0, 8)].filter(Boolean).join(" - ");
    await api("/support-tickets", "POST", { subject, message: support.message });
    setTickets(await api("/support-tickets")); setSupport({ subject: "", message: "" }); setKind(""); setOrderId("");
    setNotice("تم تسجيل رسالة الدعم داخل النظام");
  });
  return (
    <View className="bg-white flex-1" style={{ minHeight: 760 }}>
      <Header back onBack={back} onCart={() => go("cart")} count={count} />
      <View className="p-3">
        <Text className="text-center font-extrabold text-lg mb-2">المساعدة</Text>
        <ErrorNote error={error} notice={notice} />
        <View className="flex-row bg-brand-light rounded-2xl p-3 items-center">
          <View className="flex-1 items-end"><Text className="text-2xl font-extrabold text-right">نحن هنا لمساعدتك</Text><Text className="text-slate-500 text-sm text-right">اختر نوع المشكلة وسيتم الرد عليك قريبًا.</Text></View>
          <Image source={require("../../assets/ref/agent.png")} style={{ width: 90, height: 110, resizeMode: "contain" }} />
        </View>
        <View className="flex-row-reverse justify-between my-3">
          {kinds.map(([t, icon, bg]) => (
            <Pressable key={t} accessibilityRole="button" accessibilityLabel={t} onPress={() => setKind(t)} className={`w-[31%] rounded-2xl items-center py-4 px-1 border-2 ${bg} ${kind === t ? "border-accent" : "border-transparent"}`}><Text className="text-2xl">{icon}</Text><Text className="font-bold text-xs text-center mt-1">{t}</Text></Pressable>
          ))}
        </View>
        {!!user && !!orders.length && (<>
          <Text className="font-extrabold text-right mb-1">اختر الطلب</Text>
          <View className="flex-row-reverse flex-wrap mb-2">{orders.slice(0, 6).map((o: any) => <Chip key={o.id} title={"#" + o.id.slice(0, 8)} active={orderId === o.id} onPress={() => setOrderId(orderId === o.id ? "" : o.id)} />)}</View>
        </>)}
        <Input label="اكتب رسالتك" icon="✏" multiline value={support.message} onChange={(message) => setSupport({ ...support, message })} placeholder="اكتب رسالتك هنا..." />
        <View className="border border-dashed border-slate-300 rounded-xl p-3 mb-2 opacity-60"><Text className="text-right text-slate-500">📎 أضف صورة • قريبًا</Text></View>
        <Cta title="إرسال الطلب ➤" disabled={!user || !support.message} onPress={send} />
        {!user && <Text className="text-center text-slate-500 text-xs mt-2">سجّل الدخول عشان تبعت رسالة.</Text>}
        {tickets.map((t: any) => (
          <View key={t.id} className="bg-slate-50 rounded-xl p-3 mt-3"><Text className="text-right font-bold">{t.subject} • {t.state}</Text><Text className="text-right text-slate-600 text-sm">{t.message}</Text>{!!t.reply && <Text className="text-right text-brand text-sm mt-1">رد الدعم: {t.reply}</Text>}</View>
        ))}
      </View>
    </View>
  );
}
