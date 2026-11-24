import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Btn, Field } from "../../components/Controls";
import { API, BASE, imageUrl, money, statuses, storage } from "../shared";
import { st } from "../styles";

export function ProfileScreen({ c }: { c: any }) {
  const { address, addresses, api, application, auth, favorite, favorites, go, join, key, login, personal, products, profileName, protectedOptions, run, setAddress, setAddressId, setCart, setHasDevice, setJoin, setNotice, setPendingDevice, setProfileName, setScreen, setSelected, setSupport, setTickets, setToken, setUser, setVehicle, shop, support, tickets, user, vehicle, vehicles } = c;
  return (
    <>
              <>
                {!user ? (
                  <View style={st.card}>
                    <Text style={st.h2}>حسابك معانا</Text>
                    <Btn title="دخول / حساب جديد" onPress={() => go("login")} />
                  </View>
                ) : (
                  <>
                    <View style={st.card}>
                      <Text style={st.h2}>{user.name}</Text>
                      <Text style={st.small}>{user.email}</Text>
                      <Text style={st.small}>
                        لوحة التاجر والإدارة متاحة على موقع Nuxt.
                      </Text>
                      <Btn
                        alt
                        title="خروج"
                        onPress={() =>
                          run(async () => {
                            if(Platform.OS!=='web'){try{const raw=await SecureStore.getItemAsync('ghiyar-device',protectedOptions);if(raw)await api('/auth/devices/'+JSON.parse(raw).id,'DELETE');}finally{await SecureStore.deleteItemAsync('ghiyar-device');await SecureStore.deleteItemAsync('ghiyar-device-present');setHasDevice(false);setPendingDevice(null);}}
                            try{await api("/auth/logout", "POST");}catch{}
                            await storage.clear();
                            setToken("");
                            setUser(null);
                            setCart([]);
                            setScreen("home");
                          })
                        }
                      />
                    </View>
                    <View style={st.card}><Text style={st.h2}>المفضلة والإعدادات والدعم</Text><Field label="اسم الحساب" value={profileName||user.name} onChange={setProfileName}/><Btn title="حفظ اسم الحساب" onPress={()=>run(async()=>{setUser(await api('/me','PATCH',{name:profileName||user.name}));setNotice('تم حفظ الاسم');})}/><Text style={st.h3}>المفضلة</Text>{!favorites.length&&<Text style={st.small}>لا توجد عناصر محفوظة</Text>}{favorites.map((p:any)=><View key={p.id}><Text style={st.body}>{p.title}</Text><Btn title={'تفاصيل '+p.title} alt onPress={()=>run(async()=>{setSelected(await api('/products/'+p.id));go('product');})}/><Btn title={'إزالة '+p.title} alt onPress={()=>favorite(p)}/></View>)}<Text style={st.h3}>رسالة للدعم</Text><Text style={st.small}>رسالة داخل النظام فقط. لا تكتب كلمات سر أو بيانات بطاقات.</Text><Field label="عنوان رسالة الدعم" value={support.subject} onChange={subject=>setSupport({...support,subject})}/><Field label="رسالة الدعم" value={support.message} onChange={message=>setSupport({...support,message})}/><Btn title="إرسال للدعم" onPress={()=>run(async()=>{await api('/support-tickets','POST',support);setTickets(await api('/support-tickets'));setSupport({subject:'',message:''});setNotice('تم تسجيل رسالة الدعم داخل النظام');})}/>{tickets.map((t:any)=><View key={t.id}><Text style={st.body}>{t.subject} • {t.state}</Text><Text style={st.small}>{t.message}</Text>{!!t.reply&&<Text style={st.body}>رد الدعم: {t.reply}</Text>}</View>)}</View>
                    {user.role==='CUSTOMER'&&<View style={st.card}><Text style={st.h2}>انضم كتاجر</Text><Text style={st.small}>لا يمكن البيع قبل مراجعة الإدارة والموافقة.</Text>{application&&<Text style={st.warning}>{application.state} • {application.reviewReason}</Text>}{(!application||application.state==='REJECTED')&&<>{Object.entries({name:'اسم المحل',city:'مدينة المحل',address:'عنوان المحل',phone:'هاتف المحل',details:'تفاصيل النشاط'}).map(([k,label])=><Field key={k} label={label} value={(join as any)[k]} onChange={v=>setJoin({...join,[k]:v})}/>)}<Btn title="إرسال طلب انضمام" onPress={()=>run(async()=>{await api('/shop-applications','POST',join);await personal();setNotice('تم إرسال طلب الانضمام للمراجعة');})}/></>}</View>}
                    <View style={st.card}>
                      <Text style={st.h2}>عناويني</Text>
                      {addresses.map((a:any) => (
                        <Text key={a.id} style={st.body}>
                          {a.label} • {a.city} • {a.details}
                        </Text>
                      ))}
                      {(["label", "city", "details", "phone"] as const).map(
                        (k, n) => (
                          <Field
                            key={k}
                            label={
                              [
                                "اسم العنوان",
                                "المدينة",
                                "تفاصيل العنوان",
                                "رقم التواصل",
                              ][n]
                            }
                            value={address[k]}
                            onChange={(v) => setAddress({ ...address, [k]: v })}
                          />
                        ),
                      )}
                      <Btn
                        title="حفظ عنوان"
                        onPress={() =>
                          run(async () => {
                            const a = await api("/addresses", "POST", address);
                            setAddressId(a.id);
                            await personal();
                            setNotice("تم حفظ العنوان");
                          })
                        }
                      />
                    </View>
                    <View style={st.card}>
                      <Text style={st.h2}>عربياتي</Text>
                      {vehicles.map((v:any) => (
                        <Text key={v.id} style={st.body}>
                          {v.make} {v.model} • {v.year} • {v.engine}
                        </Text>
                      ))}
                      {(["make", "model", "year", "engine"] as const).map(
                        (k, n) => (
                          <Field
                            key={k}
                            label={
                              [
                                "الماركة",
                                "الموديل",
                                "سنة الصنع",
                                "المحرك / الفئة",
                              ][n]
                            }
                            numeric={k === "year"}
                            value={vehicle[k]}
                            onChange={(v) => setVehicle({ ...vehicle, [k]: v })}
                          />
                        ),
                      )}
                      <Btn
                        title="حفظ العربية"
                        onPress={() =>
                          run(async () => {
                            await api("/vehicles", "POST", {
                              ...vehicle,
                              year: Number(vehicle.year),
                            });
                            await personal();
                            setNotice(
                              "تم حفظ العربية. التوافق يحتاج مراجعة منفصلة.",
                            );
                          })
                        }
                      />
                    </View>
                  </>
                )}
              </>
    </>
  );
}
