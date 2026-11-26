import { t, cx } from "../i18n";
import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { Cta, Header, Input, ErrorNote } from "../components";

export function AddAddressScreen({ c }: { c: any }) {
  const { address, setAddress, api, run, personal, setAddressId, setNotice, back, go, count, error, notice, user } = c;
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const save = () => run(async () => {
    const details = [area && t('المنطقة: {0}', area), street && t('الشارع: {0}', street), address.details, landmark && t('معلم قريب: {0}', landmark)].filter(Boolean).join(" • ");
    const a = await api("/addresses", "POST", { ...address, phone: address.phone, details: details || address.details });
    setAddressId(a.id); await personal(); setNotice(t('تم حفظ العنوان')); back();
  });
  return (
    <View className={cx("bg-white flex-1 min-h-[700px]")}>
      <Header back onBack={back} title={t('أضف عنوان')} subtitle={t('أدخل بيانات العنوان بالكامل')} onCart={() => go("cart")} count={count} tall />
      <Image source={require("../../assets/ref/map-small.png")} style={{ width: "100%", height: 112, resizeMode: "cover" }} />
      <View className={cx("px-4 pt-3 pb-2 -mt-3 bg-white rounded-t-3xl")}>
        <ErrorNote error={error} notice={notice} />
        <Input inline label={t('المدينة')} icon="f-pin" value={address.city} onChange={(city) => setAddress({ ...address, city })} placeholder={t('اختر المدينة')} />
        <Input inline label={t('المنطقة')} icon="f-map" value={area} onChange={setArea} placeholder={t('اختر المنطقة')} />
        <Input inline label={t('الشارع')} icon="f-road" value={street} onChange={setStreet} placeholder={t('أدخل اسم الشارع')} />
        <Input inline label={t('تفاصيل العنوان')} icon="f-doc" value={address.details} onChange={(details) => setAddress({ ...address, details })} placeholder={t('أدخل تفاصيل العنوان')} />
        <Input inline label={t('معلم قريب (اختياري)')} icon="f-landmark" value={landmark} onChange={setLandmark} placeholder={t('أدخل المعلم')} />
        <Input inline label={t('رقم التواصل')} icon="phone" numeric value={address.phone} onChange={(phone) => setAddress({ ...address, phone })} placeholder="01XXXXXXXXX" />
        <Cta title={t('حفظ العنوان')} onPress={save} />
      </View>
    </View>
  );
}
