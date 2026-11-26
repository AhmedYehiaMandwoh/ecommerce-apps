import { t, cx, ENDITEMS, isEn } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Cta, Header, Input, Chip, ErrorNote, Ico } from "../components";

const kinds: [string, any, string][] = [[t('مشكلة في الطلب'), require("../../assets/icons/s-warn.png"), "#fcf1eb"], [t('استبدال أو إرجاع'), require("../../assets/icons/s-swap.png"), "#ecf5fe"], [t('سؤال عن قطعة'), require("../../assets/icons/s-chat.png"), "#faf5f1"]];
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
    if ((a.base64?.length || 0) > 1500000) { c.setError(t('الصورة كبيرة جدًا. اختر صورة أصغر.')); return; }
    setPhoto(`data:${mime};base64,${a.base64}`);
  };
  const send = () => run(async () => {
    const subject = [kind || t('مساعدة'), orderId && t('طلب #{0}', orderId.slice(0, 8))].filter(Boolean).join(" - ");
    await api("/support-tickets", "POST", { subject, message: support.message, ...(photo ? { attachment: photo } : {}) });
    setTickets(await api("/support-tickets")); setSupport({ subject: "", message: "" }); setKind(""); setOrderId(""); setPhoto("");
    setNotice(t('تم تسجيل رسالة الدعم داخل النظام'));
  });
  return (
    <View className={cx("bg-white flex-1 min-h-[760px]")}>
      <Header small sheet back onBack={back} onCart={() => go("cart")} count={count} />
      <View className={cx("px-3 pt-1")}>
        <Text className={cx("text-center font-extrabold text-brand text-[26px]")}>{t('المساعدة')}</Text>
        <ErrorNote error={error} notice={notice} />
        <View className={cx("flex-row rounded-2xl overflow-hidden items-center bg-[#f4f8fd] h-[124px] mt-[2px]")}>
          <Image source={require("../../assets/ref/support-hero.png")} style={{ width: "52%", height: 124, resizeMode: "contain" }} />
          <View className={cx("flex-1 items-end px-3")}><Text className={cx("font-extrabold text-right text-brand")} style={{ fontSize: isEn ? 17 : 24, lineHeight: isEn ? 21 : 30 }}>{t('نحن هنا')}{"\n"}{t('لمساعدتك')}</Text><Text className={cx("text-slate-500 text-right mt-1")} style={{ fontSize: isEn ? 12 : 14, lineHeight: isEn ? 16 : 20 }}>{t('اختر نوع المشكلة')}{"\n"}{t('وسيتم الرد عليك قريبًا')}</Text></View>
        </View>
        <View className={cx("flex-row-reverse justify-between")} style={{ marginVertical: 8 }}>
          {kinds.map(([t, icon, bg]) => (
            <Pressable key={t} accessibilityRole="button" accessibilityLabel={t} onPress={() => setKind(t)} className={cx(`w-[31.5%] rounded-2xl items-center justify-center border-2 ${kind === t ? "border-accent" : "border-transparent"}`)} style={{ backgroundColor: bg, height: isEn ? 108 : 92 }}><Image source={icon} style={{ width: 42, height: 42, resizeMode: "contain" }} /><Text className={cx("font-bold text-xs text-center mt-1")} numberOfLines={isEn ? 2 : 1}>{t}</Text><Text className={cx("text-accent text-xl leading-[20px]")}>›</Text></Pressable>
          ))}
        </View>
        {!!user && !!orders.length && (<>
          <Text className={cx("font-extrabold text-right text-base mb-1")}>{t('اختر الطلب')}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={t('اختر الطلب')} onPress={() => setOrderOpen(!orderOpen)} className={cx("flex-row-reverse items-center justify-between border border-slate-400 rounded-xl px-3 mb-2 h-[44px]")}>
            <View className={cx("flex-row-reverse items-center flex-1")}><Ico n="f-doc" size={22} color="#0b2a5b" /><Text className={cx(orderId ? "text-slate-900 font-bold mr-2 flex-1 text-right" : "text-slate-400 mr-2 flex-1 text-right")}>{orderId ? "#" + orderId.slice(0, 8) : t('اختر الطلب')}</Text></View>
            <Text className={cx("text-slate-500")}>{orderOpen ? "⌃" : "⌄"}</Text>
          </Pressable>
          {orderOpen && <View className={cx("flex-row-reverse flex-wrap mb-2")}>{orders.slice(0, 6).map((o: any) => <Chip key={o.id} title={"#" + o.id.slice(0, 8)} active={orderId === o.id} onPress={() => { setOrderId(orderId === o.id ? "" : o.id); setOrderOpen(false); }} />)}</View>}
        </>)}
        <View className={cx("mb-2")}><Text className={cx("text-right font-bold text-slate-900 mb-1")}>{t('اكتب رسالتك')}</Text><View style={{ position: "relative" }}><TextInput accessibilityLabel={t('اكتب رسالتك')} value={support.message} onChangeText={(message: string) => setSupport({ ...support, message })} placeholder={t('اكتب رسالتك هنا...')} placeholderTextColor="#94a3b8" multiline textAlign="right" className={cx("border border-slate-300 rounded-xl px-3 py-2 text-base text-right min-h-[56px]")} style={{ paddingRight: 36 }} /><Text pointerEvents="none" style={{ position: "absolute", right: 12, top: 8, fontSize: 18, color: "#0b2a5b" }}>✎</Text></View></View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('أضف صورة')} onPress={pick} className={cx("border border-dashed border-slate-300 rounded-xl p-2 mb-1 flex-row-reverse items-center")}><Ico n="clip" size={18} color="#64748b" /><Text className={cx("text-right text-slate-600 flex-1 mx-[8px]")}>{photo ? t('تم اختيار صورة • اضغط للتغيير') : t('أضف صورة')}</Text></Pressable>
        {!!photo && <Image source={{ uri: photo }} style={{ width: 90, height: 90, borderRadius: 10, marginBottom: 8, alignSelf: ENDITEMS }} />}
        <Pressable accessibilityRole="button" accessibilityLabel={t('إرسال الطلب')} disabled={!user || !support.message} onPress={send} className={cx(`rounded-2xl py-3 px-5 items-center justify-center mt-2 bg-accent ${!user || !support.message ? "opacity-50" : ""}`)} style={{ flexDirection: "row-reverse", justifyContent: "center" }}><Ico n="send" size={22} color="#ffffff" /><Text className={cx("text-white font-extrabold text-lg mr-[8px]")}>{t('إرسال الطلب')}</Text></Pressable>
        {!user && <Text className={cx("text-center text-slate-500 text-xs mt-2")}>{t('سجّل الدخول عشان تبعت رسالة.')}</Text>}
        {tickets.map((t: any) => (
          <View key={t.id} className={cx("bg-slate-50 rounded-xl p-3 mt-3")}><Text className={cx("text-right font-bold")}>{t.subject} • {t.state}</Text><Text className={cx("text-right text-slate-600 text-sm")}>{t.message}</Text>{!!t.attachment && <Image source={{ uri: t.attachment }} style={{ width: 90, height: 90, borderRadius: 10, marginTop: 6, alignSelf: 'flex-end' }} />}{!!t.reply && <Text className={cx("text-right text-brand text-sm mt-1")}>{t('رد الدعم:')} {t.reply}</Text>}</View>
        ))}
      </View>
    </View>
  );
}
