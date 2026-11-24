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

export function CatalogScreen({ c }: { c: any }) {
  const { busy, categories, category, fitmentVehicle, go, key, load, page, pages, products, search, setCategory, setFitmentVehicle, setNotice, setSearch, setSelected, shop, user, vehicles } = c;
  return (
    <>
              <>
                <View style={{backgroundColor:'#0751e8',padding:12,borderRadius:16,marginBottom:12}}><TextInput style={[st.input,{borderRadius:28}]} accessibilityLabel="البحث في المنتجات" placeholder="ابحث باسم القطعة أو رقمها" value={search} onChangeText={setSearch} onSubmitEditing={()=>load()}/><Btn title="بحث المنتجات" onPress={()=>load()}/></View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:10}}>{['',...categories].map(c=><Pressable accessibilityRole="button" key={c} onPress={()=>{setCategory(c);load(c);}} style={[st.chip,category===c&&{backgroundColor:'#0751e8'}]}><Text style={{color:category===c?'white':'#173655'}}>{c||'الكل'}</Text></Pressable>)}</ScrollView>
                <Text style={st.h2}>اختار قطع غيارك</Text>
                {user&&vehicles.length>0&&<View style={st.card}><Text style={st.h3}>التوافق المعتمد لعربيتي</Text><Text style={st.small}>اختيار فلتر لا يثبت التوافق بذاته. يعرض سجلات الإدارة المعتمدة فقط.</Text><Btn title="بدون تصفية عربية" alt onPress={()=>{setFitmentVehicle('');setNotice('اختار تحديث البحث لتطبيق الفلتر');}}/>{vehicles.map((v:any)=><Btn key={v.id} title={(fitmentVehicle===v.id?'✓ ':'')+v.make+' '+v.model+' '+v.year} alt onPress={()=>{setFitmentVehicle(v.id);setNotice('اختار تحديث البحث لتطبيق الفلتر');}}/>)}<Btn title="تحديث البحث" onPress={()=>load()}/></View>}
                <View style={st.grid}>
                  {products
                    .filter((p:any) =>
                      p.offers.some((o: any) => !shop || o.shopId === shop),
                    )
                    .map((p:any) => (
                      <Pressable
                        accessibilityRole="button"
                        key={p.id}
                        style={st.product}
                        onPress={() => {
                          setSelected({
                            ...p,
                            offers: p.offers.filter(
                              (o: any) => !shop || o.shopId === shop,
                            ),
                          });
                          go("product");
                        }}
                      >
                        <Image
                          source={{ uri: imageUrl(p.image) }}
                          style={st.productImage}
                        />
                        <Text style={st.small}>
                          {p.brand} • {p.partNumber}
                        </Text>
                        <Text style={st.h3}>{p.title}</Text>
                        <Text style={st.price}>
                          {money(
                            Math.min(
                              ...p.offers
                                .filter((o: any) => !shop || o.shopId === shop)
                                .map((o: any) => o.price),
                            ),
                          )}
                        </Text>
                        <Text style={st.link}>عرض التفاصيل ←</Text>
                      </Pressable>
                    ))}
                </View>
                {!products.length && !busy && (
                  <Text style={st.card}>لا توجد منتجات مطابقة.</Text>
                )}
                {pages > 1 && (
                  <View style={st.row}>
                    <Btn
                      title="السابق"
                      alt
                      disabled={page <= 1}
                      onPress={() => load(category, page - 1)}
                    />
                    <Text>
                      {page}/{pages}
                    </Text>
                    <Btn
                      title="التالي"
                      alt
                      disabled={page >= pages}
                      onPress={() => load(category, page + 1)}
                    />
                  </View>
                )}
              </>
    </>
  );
}
