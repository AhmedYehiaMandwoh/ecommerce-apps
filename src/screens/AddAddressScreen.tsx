import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { Cta, Header, Input, ErrorNote } from "../ui/kit";

export function AddAddressScreen({ c }: { c: any }) {
  const { address, setAddress, api, run, personal, setAddressId, setNotice, back, go, count, error, notice, user } = c;
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const save = () => run(async () => {
    const details = [area && "المنطقة: " + area, street && "الشارع: " + street, address.details, landmark && "معلم قريب: " + landmark].filter(Boolean).join(" • ");
    const a = await api("/addresses", "POST", { ...address, phone: address.phone, details: details || address.details });
    setAddressId(a.id); await personal(); setNotice("تم حفظ العنوان"); back();
  });
  return (
    <View className="bg-white flex-1" style={{ minHeight: 700 }}>
      <Header back onBack={back} title="أضف عنوان" subtitle="أدخل بيانات العنوان بالكامل" onCart={() => go("cart")} count={count} />
      <Image source={require("../../assets/ref/map-small.png")} style={{ width: "100%", height: 92, resizeMode: "cover" }} />
      <View className="px-4 pt-3 pb-2 -mt-3 bg-white rounded-t-3xl">
        <ErrorNote error={error} notice={notice} />
        <Input inline label="المدينة" icon="f-pin" value={address.city} onChange={(city) => setAddress({ ...address, city })} placeholder="اختر المدينة" />
        <Input inline label="المنطقة" icon="f-map" value={area} onChange={setArea} placeholder="اختر المنطقة" />
        <Input inline label="الشارع" icon="f-road" value={street} onChange={setStreet} placeholder="أدخل اسم الشارع" />
        <Input inline label="تفاصيل العنوان" icon="f-doc" value={address.details} onChange={(details) => setAddress({ ...address, details })} placeholder="أدخل تفاصيل العنوان" />
        <Input inline label="معلم قريب (اختياري)" icon="f-landmark" value={landmark} onChange={setLandmark} placeholder="أدخل المعلم" />
        <Input inline label="رقم التواصل" icon="📞" numeric value={address.phone} onChange={(phone) => setAddress({ ...address, phone })} placeholder="01XXXXXXXXX" />
        <Cta title="حفظ العنوان" onPress={save} />
      </View>
    </View>
  );
}
