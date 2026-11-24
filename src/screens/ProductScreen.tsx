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

export function ProductScreen({ c }: { c: any }) {
  const { add, favorite, go, key, login, selected, shop, user } = c;
  return (
    <>
              <>
                <Btn title="رجوع للمنتجات" alt onPress={() => go("catalog")} />
                <View style={st.card}>
                  <Image
                    source={{ uri: imageUrl(selected.image) }}
                    style={{width:"100%",height:240,resizeMode:"contain",borderRadius:17,backgroundColor:'#f9f6f1'}}
                  />
                  <Text style={st.h2}>{selected.title}</Text>
                  {selected.offers[0]&&<View><View style={[st.row,{justifyContent:'space-between'}]}><Text style={st.price}>{money(selected.offers[0].price)}</Text><Btn title={selected.offers[0].stock?'أضف للسلة':'غير متوفر'} disabled={!selected.offers[0].stock} onPress={()=>add(selected,selected.offers[0])}/></View><View style={{backgroundColor:'#edf4fc',padding:12,borderRadius:13,marginVertical:12}}><Text style={st.h3}>{selected.offers[0].shop.name}</Text><Text style={st.small}>قطع غيار وصيانة</Text></View></View>}
                  <Text style={st.small}>
                    {selected.brand} • {selected.partNumber}
                  </Text>
                  <Text style={st.body}>{selected.description}</Text>
                  <Pressable accessibilityRole="button" onPress={()=>go(user?'profile':'login')} style={{backgroundColor:'#eaf3ff',borderRadius:15,padding:14,marginTop:15}}><Text style={{color:'#153e7e',fontWeight:'800',fontSize:17,textAlign:'right'}}>هل القطعة مناسبة لعربيتك؟</Text><Text style={[st.small,{fontSize:13,lineHeight:22}]}>راجع رقم القطعة والمحرك مع البائع. بيانات التوافق غير مؤكدة في النسخة التجريبية.</Text><Text style={{color:'#0757e9',textAlign:'center',fontWeight:'800',borderRadius:20,borderWidth:1,borderColor:'#0757e9',padding:9,marginTop:7}}>اختار عربيتك</Text></Pressable>
                </View>
                <Text style={st.h2}>عروض المحلات</Text>
                <Btn title="حفظ / إزالة من المفضلة" alt onPress={()=>favorite(selected)}/>
                {selected.offers.map((o: any) => (
                  <View key={o.id} style={st.card}>
                    <Text style={st.h3}>{o.shop.name}</Text>
                    <Text style={st.small}>
                      {o.shop.city} • المتاح {o.stock}
                    </Text>
                    <Text style={st.price}>{money(o.price)}</Text>
                    <Btn
                      title={o.stock ? "أضف للسلة" : "غير متوفر"}
                      disabled={!o.stock}
                      onPress={() => add(selected, o)}
                    />
                  </View>
                ))}
              </>
    </>
  );
}
