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
import { Btn, Field } from "../../components/Controls";
import { API, BASE, imageUrl, money, statuses, storage } from "../shared";
import { st } from "../styles";

export function OrderDetailScreen({ c }: { c: any }) {
  const { detailId, back, api, cancelReasons, go, key, lastPlacedOrder, login, orders, personal, returnForm, run, setCancelReasons, setLastPlacedOrder, setNotice, setReturn, shop, user } = c;
  return (
    <>
              <>
                                <Btn title="رجوع" alt onPress={back} /><Text style={st.h2}>تفاصيل الطلب</Text>
                {!user ? (
                  <Btn title="سجّل الدخول" onPress={() => go("login")} />
                ) : (
                  <>
                    <Btn
                      title="تحديث"
                      alt
                      onPress={() => run(() => personal())}
                    />
                    {!orders.filter((o:any)=>o.id===detailId).length && (
                      <Text style={st.card}>لسه مفيش طلبات.</Text>
                    )}
                    {orders.filter((o:any)=>o.id===detailId).map((o:any) => (
                      <View key={o.id} style={st.card}>
                        <Text style={st.h3}>طلب #{o.id.slice(0, 8)}</Text>
                        <Text style={st.link}>{statuses[o.status]}</Text>
                        <Text style={st.price}>{money(o.total)}</Text>
                        <Text style={st.small}>{o.shop.name} • طلب تجريبي</Text>
                        {o.items.map((i: any) => (
                          <View key={i.id} style={[st.row,{backgroundColor:'#f7f9fc',borderRadius:12,padding:8,marginVertical:6}]}>{i.offer?.product?.image&&<Image source={{uri:imageUrl(i.offer.product.image)}} style={{width:70,height:65,resizeMode:'contain',borderRadius:10}}/>}<View style={{flex:1}}><Text style={st.body}>{i.title} × {i.quantity}</Text><Text style={st.small}>{money(i.unitPrice*i.quantity)}</Text></View></View>
                        ))}
                        {o.settlementFrozen&&<Text style={st.warning}>حسابات الطلب مجمدة أثناء المراجعة</Text>}
                        {o.status==='SHIPPED'&&!o.settlementFrozen&&<><Field label="سبب طلب الإلغاء" value={cancelReasons[o.id]||''} onChange={v=>setCancelReasons({...cancelReasons,[o.id]:v})}/><Btn title="طلب إلغاء من الإدارة" alt onPress={()=>run(async()=>{await api('/orders/'+o.id+'/cancellation-requests','POST',{reason:cancelReasons[o.id]||''});await personal();setNotice('تم إرسال طلب الإلغاء للمراجعة');})}/></>}
                        {o.cancellationReviews?.map((r:any)=><Text key={r.id} style={st.small}>إلغاء: {r.state} • {r.decisionReason}</Text>)}
                        {o.status==='DELIVERED'&&!o.settlementFrozen&&<><Text style={st.h3}>طلب إرجاع للمراجعة</Text><Text style={st.small}>لا قبول أو رد تلقائي. الإدارة تراجع كل طلب تجريبي.</Text>{o.items.map((i:any)=><Field key={i.id} label={'كمية إرجاع: '+i.title} value={String(returnForm(o).items[i.id]||0)} numeric onChange={v=>setReturn(o,{items:{...returnForm(o).items,[i.id]:Number(v)||0}})}/>)}<Field label="سبب الإرجاع" value={returnForm(o).reason} onChange={v=>setReturn(o,{reason:v})}/><Btn title="إرسال طلب إرجاع" alt onPress={()=>run(async()=>{const f=returnForm(o);await api('/orders/'+o.id+'/returns','POST',{reason:f.reason,items:Object.entries(f.items).filter(([id,q])=>Number(q)>0).map(([orderItemId,quantity])=>({orderItemId,quantity:Number(quantity)}))});await personal();setNotice('تم إرسال الإرجاع للمراجعة، لا رد أموال تلقائي');})}/></>}
                        {o.returns?.map((r:any)=><View key={r.id}><Text style={st.small}>إرجاع: {r.state} • {r.decisionReason}</Text>{r.state==='APPROVED'&&<Text style={st.small}>رد معتمد: {money(r.refundAmount)} • {r.refundedAt?'إثبات الرد مسجل':'بانتظار إثبات الرد'}</Text>}</View>)}
                        {o.events.map((e: any) => (
                          <Text key={e.id} style={st.small}>
                            ✓ {statuses[e.status]} •{" "}
                            {new Date(e.createdAt).toLocaleDateString("ar-EG")}
                          </Text>
                        ))}
                        {["PLACED","ACCEPTED","PREPARING"].includes(o.status) && !o.settlementFrozen && (
                          <Btn
                            title="إلغاء الطلب"
                            alt
                            onPress={() =>
                              run(async () => {
                                await api(
                                  "/orders/" + o.id + "/status",
                                  "PATCH",
                                  { status: "CANCELLED" },
                                );
                                await personal();
                              })
                            }
                          />
                        )}
                      </View>
                    ))}
                  </>
                )}
              </>
    </>
  );
}
