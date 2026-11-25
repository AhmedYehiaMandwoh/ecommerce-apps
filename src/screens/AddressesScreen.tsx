import { t, cx } from "../i18n";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Cta, Header } from "../ui/kit";

export function AddressesScreen({ c }: { c: any }) {
  const { addresses, addressId, setAddressId, back, go, count, api, run, personal, setNotice } = c;
  const [menu, setMenu] = React.useState("");
  return (
    <View className={cx("bg-white flex-1")} style={{ minHeight: 700 }}>
      <Header back onBack={back} title={t('عناويني')} subtitle={t('اختر عنوانك للتوصيل')} onCart={() => go("cart")} count={count} tall />
      <View className={cx("p-4")}>
        {addresses.map((a: any, n: number) => {
          const on = a.id === addressId;
          return (
            <View key={a.id} className={cx(`flex-row items-center rounded-2xl p-4 mb-3 border-2 ${on ? "bg-orange-50 border-accent" : "bg-slate-50 border-slate-100"}`)}>
              <Pressable accessibilityRole="button" accessibilityLabel={t('عنوان {0}', a.label)} onPress={() => setAddressId(a.id)} className={cx("flex-1 flex-row items-center")}>
              <View className={cx(`w-7 h-7 rounded-full border-2 items-center justify-center ${on ? "border-accent" : "border-slate-400"}`)}>{on && <View className={cx("w-3.5 h-3.5 rounded-full bg-accent")} />}</View>
              <View className={cx("flex-1 mx-3 items-end")}>
                <Text className={cx("font-extrabold text-lg")}>{a.label}</Text>
                <Text className={cx("text-slate-600 text-sm")} numberOfLines={1}>{t('المدينة :')} {a.city}</Text>
                <Text className={cx("text-slate-600 text-sm")} numberOfLines={1}>{a.details}</Text>
              </View>
              <Image source={n % 2 ? require("../../assets/ref/building.png") : require("../../assets/ref/house.png")} style={{ width: 92, height: 86, resizeMode: "contain" }} />
              </Pressable>
              <View>
                <Pressable accessibilityRole="button" accessibilityLabel={t('خيارات عنوان {0}', a.label)} hitSlop={8} onPress={() => setMenu(menu === a.id ? "" : a.id)} className={cx("items-center justify-center")} style={{ width: 28, height: 28 }}><Text className={cx("text-slate-500 font-extrabold text-lg")}>⋮</Text></Pressable>
                {menu === a.id && (
                  <Pressable accessibilityRole="button" accessibilityLabel={t('حذف عنوان {0}', a.label)} onPress={() => run(async () => { await api("/addresses/" + a.id, "DELETE"); if (addressId === a.id) setAddressId(""); await personal(); setMenu(""); setNotice(t('تم حذف العنوان')); })} className={cx("bg-white border border-red-200 rounded-lg px-3 py-1 mt-1")}><Text className={cx("text-red-600 font-bold text-xs")}>{t('حذف العنوان')}</Text></Pressable>
                )}
              </View>
            </View>
          );
        })}
        {!addresses.length && <Text className={cx("text-center text-slate-500 my-6")}>{t('لسه مفيش عناوين محفوظة.')}</Text>}
        <Pressable accessibilityRole="button" accessibilityLabel={t('إضافة عنوان جديد')} onPress={() => go("addaddress")} className={cx("flex-row items-center justify-center bg-brand-light rounded-2xl p-6")}>
          <Text className={cx("text-brand font-extrabold text-base")} style={{ marginHorizontal: 12 }}>{t('إضافة عنوان جديد')}</Text>
          <View className={cx("w-9 h-9 rounded-full bg-brand items-center justify-center")}><Text className={cx("text-white text-2xl")}>+</Text></View>
        </Pressable>
      </View>
    </View>
  );
}
