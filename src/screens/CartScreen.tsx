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

export function CartScreen({ c }: { c: any }) {
  const { addressId, addresses, busy, cart, deliveryAreaId, deliveryAreas, go, key, login, order, quote, reviewQuote, screen, setAddressId, setCart, setDeliveryAreaId, shops, subtotal, user } = c;
  return (
    <>
              <>
                <Text style={st.h2}>
                  {screen === "cart" ? "سلة المشتريات" : "إتمام الطلب التجريبي"}
                </Text>
                {!cart.length ? (
                  <View style={st.card}>
                    <Text style={st.body}>السلة فاضية</Text>
                    <Btn title="اختار قطعك" onPress={() => go("home")} />
                  </View>
                ) : (
                  <>
                    <View style={{backgroundColor:'#eaf3ff',borderRadius:15,padding:14,marginBottom:12}}><Text style={st.h3}>{shops.find((s:any)=>s.id===cart[0]?.shopId)?.name || 'منتجات من محل واحد'}</Text><Text style={st.small}>راجع رقم القطعة والتوافق مع البائع</Text></View>
                    {cart.map((i:any) => (
                      <View style={st.card} key={i.offerId}>
                        <View style={st.row}>
                          <Image
                            source={{ uri: imageUrl(i.image) }}
                            style={{
                              width: 122,
                              height: 122,
                              backgroundColor: '#f7f4f0',
                              borderRadius: 12,
                              resizeMode: "contain",
                            }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={st.h3}>{i.title}</Text>
                            <Text style={st.price}>{money(i.price * i.quantity)}</Text>
                            <View style={{flexDirection:'row',borderWidth:1,borderColor:'#d5e2f1',borderRadius:10,alignItems:'center',justifyContent:'space-between',marginTop:12}}><Pressable accessibilityRole="button" accessibilityLabel="تقليل الكمية" disabled={i.quantity<=1} style={{padding:10}} onPress={()=>{setCart(cart.map((x:any)=>x.offerId===i.offerId?{...x,quantity:Math.max(1,x.quantity-1)}:x));key.current='';}}><Text style={{fontSize:22,color:'#173655'}}>−</Text></Pressable><Text>{i.quantity}</Text><Pressable accessibilityRole="button" accessibilityLabel="زيادة الكمية" disabled={i.quantity>=Math.min(i.stock,100)} style={{padding:10}} onPress={()=>{setCart(cart.map((x:any)=>x.offerId===i.offerId?{...x,quantity:Math.min(x.quantity+1,x.stock,100)}:x));key.current='';}}><Text style={{fontSize:22,color:'#173655'}}>+</Text></Pressable></View>
                          </View>
                        </View>
                        <View style={[st.row,{justifyContent:'flex-end'}]}>
                          <Btn
                            title="حذف"
                            alt
                            onPress={() => {
                              setCart(
                                cart.filter((x:any) => x.offerId !== i.offerId),
                              );
                              key.current = "";
                            }}
                          />
                        </View>
                      </View>
                    ))}
                    <View style={st.card}>
                      <Text style={st.body}>المنتجات: {money(subtotal)}</Text>
                      <Text style={st.body}>{quote?'رسوم منطقة التوصيل':'اختار المنطقة لمعرفة الشحن'}: {quote?money(quote.delivery):'غير محدد'}</Text>
                      <Text style={st.price}>
                        الإجمالي التقديري: {money(quote?.total??subtotal)}
                      </Text>
                      <Text style={st.warning}>
                        السعر والمخزون يُراجعان عند التأكيد. لا تحصيل ولا توصيل
                        حقيقي.
                      </Text>
                      {screen === "checkout" ? (
                        <>
                          <Text style={st.h3}>اختار عنوانك</Text>
                          {addresses.map((a:any) => (
                            <Pressable
                              key={a.id}
                              onPress={() => setAddressId(a.id)}
                              style={[
                                st.card,
                                {
                                  borderWidth: 1,
                                  borderColor:
                                    addressId === a.id ? "#0757e9" : "#e0e8f2",
                                },
                              ]}
                            >
                              <Text style={st.body}>
                                {a.label} • {a.city} • {a.details}
                              </Text>
                            </Pressable>
                          ))}
                          <Text style={st.h3}>منطقة التوصيل</Text>{deliveryAreas.map((a:any)=><Pressable accessibilityRole="button" key={a.id} onPress={()=>setDeliveryAreaId(a.id)} style={[st.card,{borderWidth:1,borderColor:deliveryAreaId===a.id?'#0757e9':'#e0e8f2'}]}><Text style={st.body}>{a.city} • {a.area} • {money(a.fee)}</Text></Pressable>)}<Btn title="راجع التكلفة النهائية" alt disabled={!addressId||!deliveryAreaId||busy} onPress={reviewQuote}/>{quote&&<View><Text style={st.h3}>الإجمالي النهائي: {money(quote.total)}</Text>{quote.groups.map((g:any)=><Text style={st.small} key={g.shopId}>{shops.find((s:any)=>s.id===g.shopId)?.name||'محل'}: منتجات {money(g.subtotal)} + شحن {money(g.delivery)} = {money(g.total)}</Text>)}</View>}
                          <Btn
                            title="إضافة عنوان"
                            alt
                            onPress={() => go("profile")}
                          />
                          <Btn
                            title="تأكيد طلب تجريبي"
                            disabled={!addressId || !quote || user?.role !== "CUSTOMER"}
                            onPress={order}
                          />
                        </>
                      ) : (
                        <Btn
                          title={user ? "إتمام الطلب" : "سجّل الدخول للمتابعة"}
                          onPress={() => go(user ? "checkout" : "login")}
                        />
                      )}
                    </View>
                  </>
                )}
              </>
    </>
  );
}
