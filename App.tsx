import {Btn,Field} from "./components/Controls";
import { MarketplaceHome } from "./components/MarketplaceHome";
import React, { useState, useEffect } from "react";
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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";
const API = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:4000/api";
const BASE = process.env.EXPO_PUBLIC_ASSET_URL || "http://10.0.2.2:3000";
const imageUrl=(path:string)=>path.startsWith('/api/media/')?API.replace(/\/api$/,'')+path:BASE+path;
const money = (v: number) => `${(v / 100).toLocaleString("ar-EG")} ج.م`;
const statuses: Record<string, string> = {
  PLACED: "تم الطلب",
  ACCEPTED: "مقبول",
  PREPARING: "قيد التجهيز",
  SHIPPED: "في الطريق",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};
const storage = {
  get: async () =>
    Platform.OS === "web"
      ? sessionStorage.getItem("ghiyar-token")
      : SecureStore.getItemAsync("token"),
  set: async (t: string) =>
    Platform.OS === "web"
      ? sessionStorage.setItem("ghiyar-token", t)
      : SecureStore.setItemAsync("token", t),
  clear: async () =>
    Platform.OS === "web"
      ? sessionStorage.removeItem("ghiyar-token")
      : SecureStore.deleteItemAsync("token"),
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [shop, setShop] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [cartReady,setCartReady]=useState(false);
  const [favorites,setFavorites]=useState<any[]>([]);
  const [tickets,setTickets]=useState<any[]>([]);
  const [profileName,setProfileName]=useState('');
  const [support,setSupport]=useState({subject:'',message:''});
  async function favorite(p:any){if(!user){go('login');return;}await run(async()=>{const saved=await api('/favorites');await api('/favorites/'+p.id,saved.some((f:any)=>f.id===p.id)?'DELETE':'POST');setFavorites(await api('/favorites'));setNotice('تم تحديث المفضلة');});}
  const [returnForms,setReturnForms]=useState<Record<string,any>>({});
  const [cancelReasons,setCancelReasons]=useState<Record<string,string>>({});
  const [join,setJoin]=useState({name:'',city:'',address:'',phone:'',details:''});
  const [application,setApplication]=useState<any>(null);
  function returnForm(o:any){return returnForms[o.id]||{reason:'',items:Object.fromEntries(o.items.map((i:any)=>[i.id,0]))};}
  function setReturn(o:any,patch:any){setReturnForms({...returnForms,[o.id]:{...returnForm(o),...patch}});}
  useEffect(()=>{(async()=>{try{const raw=await AsyncStorage.getItem('ghiyar-cart');if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length<=50)setCart(parsed.filter(i=>typeof i.offerId==='string'&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=100&&Number.isInteger(i.price)&&i.price>0));}}catch{}finally{setCartReady(true);}})();},[]);
  useEffect(()=>{if(cartReady)AsyncStorage.setItem('ghiyar-cart',JSON.stringify(cart)).catch(()=>{});},[cart,cartReady]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<any>(null);
  const [fitmentVehicle,setFitmentVehicle]=useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [addressId, setAddressId] = useState("");
  const [phoneMode,setPhoneMode]=useState(true);
  const [phoneAuth,setPhoneAuth]=useState({phone:'',name:'',code:'',challengeId:''});
  const [pendingDevice,setPendingDevice]=useState<any>(null);
  const [hasDevice,setHasDevice]=useState(false);
  const protectedOptions={requireAuthentication:true,authenticationPrompt:'افتح جلسة غيار المحفوظة',keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY};
  async function acceptPhone(r:any){setToken(r.token);setUser(r.user);await personal(r.token);setScreen('home');}
  async function phoneLogin(){await run(async()=>{if(!phoneAuth.challengeId){const r=await api('/auth/phone/start','POST',{phone:phoneAuth.phone,deviceLabel:Platform.OS+' غيار'});setPhoneAuth({...phoneAuth,challengeId:r.challengeId});setNotice(r.testMode?'اختبار فقط: كودك 123456، لم يتم إرسال SMS.':'أدخل كود التحقق');}else{const r=await api('/auth/phone/check','POST',{challengeId:phoneAuth.challengeId,code:phoneAuth.code,name:phoneAuth.name});await acceptPhone(r);if(Platform.OS!=='web')setPendingDevice(r);else{await storage.set(r.token);setNotice('جلسة المتصفح الحالية فقط. الدخول المحمي متاح على التطبيق الأصلي.');}setPhoneAuth({...phoneAuth,code:'',challengeId:''});}});}
  async function enableDevice(){await run(async()=>{if(Platform.OS==='web'||!pendingDevice)return;if(!await LocalAuthentication.isEnrolledAsync())throw Error('فعّل قفل الجهاز أو البصمة أولًا. تقدر تكمل الجلسة الحالية بدون حفظ.');await SecureStore.setItemAsync('ghiyar-device',JSON.stringify({token:pendingDevice.deviceToken,id:pendingDevice.deviceId}),protectedOptions);await SecureStore.setItemAsync('ghiyar-device-present','yes');setHasDevice(true);setPendingDevice(null);setNotice('تم حفظ مفتاح الجلسة بشكل محمي على الجهاز. الاختبار الفعلي للبصمة أو رمز الجهاز مطلوب على جهاز حقيقي.');});}
  async function unlockDevice(){await run(async()=>{const unlocked=await LocalAuthentication.authenticateAsync({promptMessage:'افتح غيار',disableDeviceFallback:false,cancelLabel:'إلغاء'});if(!unlocked.success)throw Error('تم إلغاء فتح الجهاز');const saved=await SecureStore.getItemAsync('ghiyar-device',protectedOptions);if(!saved){setHasDevice(false);throw Error('الجلسة غير متاحة. تحقق برقم الموبايل مرة أخرى.');}const d=JSON.parse(saved);const r=await api('/auth/device/refresh','POST',{deviceToken:d.token});try{await SecureStore.setItemAsync('ghiyar-device',JSON.stringify({token:r.deviceToken,id:r.deviceId}),protectedOptions);}catch(e){await api('/auth/devices/'+r.deviceId,'DELETE',undefined,r.token);throw e;}await acceptPhone(r);});}
  const [register, setRegister] = useState(false);
  const [auth, setAuth] = useState({ name: "", email: "", password: "" });
  const [address, setAddress] = useState({
    label: "المنزل",
    city: "",
    details: "",
    phone: "",
  });
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "2020",
    engine: "",
  });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const key = React.useRef("");
  const [deliveryAreas,setDeliveryAreas]=useState<any[]>([]);
  const [deliveryAreaId,setDeliveryAreaId]=useState('');
  const [quote,setQuote]=useState<any>(null);
  useEffect(()=>{setQuote(null);key.current='';},[addressId,deliveryAreaId,JSON.stringify(cart.map(i=>[i.offerId,i.quantity]))]);
  async function reviewQuote(){await run(async()=>{setQuote(await api('/orders/quote','POST',{items:cart.map(i=>({offerId:i.offerId,quantity:i.quantity})),addressId,deliveryAreaId}));});}
  async function api(path: string, method = "GET", body?: any, t = token) {
    const res = await fetch(API + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text=await res.text();
    const data = text?JSON.parse(text):null;
    if(res.status===401&&t){setToken('');setUser(null);await storage.clear();}
    if (!res.ok)
      throw Error(
        Array.isArray(data.message)
          ? data.message.join("، ")
          : data?.message || "تعذر إتمام العملية",
      );
    return data;
  }
  async function run(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e: any) {
      setError(
        e.message === "Failed to fetch"
          ? "تعذر الاتصال بالخادم. راجع عنوان API واتصال الشبكة."
          : e.message,
      );
    } finally {
      setBusy(false);
    }
  }
  async function load(c = category, p = 1) {
    await run(async () => {
      const chosen=vehicles.find(v=>v.id===fitmentVehicle);const filter=chosen?'&make='+encodeURIComponent(chosen.make)+'&model='+encodeURIComponent(chosen.model)+'&year='+chosen.year+'&engine='+encodeURIComponent(chosen.engine):'';
      const r = await api(`/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(c)}&page=${p}${filter}${shop?'&shopId='+encodeURIComponent(shop):''}`);
      setProducts(r.items);
      setPage(p);
      setPages(r.pages);
      setCategories(await api("/categories"));setDeliveryAreas(await api('/delivery-areas'));
      setShops(await api("/shops"));
    });
  }
  async function personal(t = token) {
    setAddresses(await api("/addresses", "GET", undefined, t));
    setOrders(await api("/orders", "GET", undefined, t));
    setVehicles(await api("/vehicles", "GET", undefined, t));
    setApplication(await api("/shop-application","GET",undefined,t));
    setFavorites(await api('/favorites','GET',undefined,t));setTickets(await api('/support-tickets','GET',undefined,t));
  }
  useEffect(() => {
    (async () => {
      if(Platform.OS!=="web"){setHasDevice((await SecureStore.getItemAsync('ghiyar-device-present'))==='yes');await load();return;}
      const t = await storage.get();
      if (t) {
        try {
          setUser(await api("/me", "GET", undefined, t));
          setToken(t);
          await personal(t);
        } catch {
          await storage.clear();
        }
      }
      await load();
    })();
  }, []);
  function go(s: string) {
    setError("");
    setNotice("");
    setScreen(s);
    if (["orders", "profile", "checkout"].includes(s) && token)
      run(() => personal());
  }
  function add(p: any, o: any) {
    const old = cart.find((i) => i.offerId === o.id);
    if (old && old.quantity >= o.stock) return;
    setCart(
      old
        ? cart.map((i) =>
            i.offerId === o.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [
            ...cart,
            {
              offerId: o.id,
              shopId: o.shopId,
              title: p.title,
              image: p.image,
              price: o.price,
              stock: o.stock,
              quantity: 1,
            },
          ],
    );
    key.current = "";
    setNotice("اتضاف للسلة");
  }
  async function login() {
    await run(async () => {
      const r = await api(
        "/auth/" + (register ? "register" : "login"),
        "POST",
        register ? auth : { email: auth.email, password: auth.password },
      );
      setToken(r.token);
      setUser(r.user);
      if(Platform.OS==="web")await storage.set(r.token);
      setAuth({ ...auth, password: "" });
      await personal(r.token);
      setScreen("home");
    });
  }
  async function order() {
    if(!quote){setError('راجع منطقة التوصيل والتكلفة أولًا');return;}
    if (!addressId) {
      setError("اختار عنوان التوصيل");
      return;
    }
    await run(async () => {
      if (!key.current)
        key.current = `mobile-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const placed = await api("/checkouts", "POST", {
        items: cart.map((i) => ({ offerId: i.offerId, quantity: i.quantity })),
        addressId,
        expectedTotal: quote.total,
        deliveryAreaId,
        requestKey: key.current,
      });
      setCart([]);
      setLastPlacedOrder(placed);
      key.current = "";
      await personal();
      setScreen("orders");
      setNotice("طلب تجريبي فقط. لا دفع ولا توصيل حقيقي.");
    });
  }
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={st.safe}>
        <StatusBar style="light" />
        {screen !== "home" && <View style={{backgroundColor:'#0751e8',padding:14,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between'}}><Image source={require('./assets/reference-logo.png')} style={{width:95,height:52,resizeMode:'contain'}}/><Text style={{color:'white',fontWeight:'800',fontSize:20}}>{({catalog:'المحلات والمنتجات',product:'تفاصيل المنتج',cart:'سلة المشتريات',checkout:'إتمام الطلب',orders:'طلباتي',profile:'حسابي',login:'أهلًا بيك'} as Record<string,string>)[screen]}</Text><Pressable accessibilityRole="button" accessibilityLabel={`السلة (${cart.reduce((s,i)=>s+i.quantity,0)})`} onPress={()=>go('cart')}><Image source={require('./assets/cart-icon.png')} style={{width:27,height:27,tintColor:'white'}}/><Text style={{color:'white',fontSize:11,textAlign:'center'}}>السلة ({cart.reduce((s,i)=>s+i.quantity,0)})</Text></Pressable></View>}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={screen === "home" ? {paddingBottom:10,backgroundColor:"white"} : st.content}
            keyboardShouldPersistTaps="handled"
          >
            {!!error && (
              <Text accessibilityRole="alert" style={st.error}>
                {error}
              </Text>
            )}
            {!!notice && <Text style={st.success}>{notice}</Text>}
            {busy && <ActivityIndicator color="#0757e9" />}
            {screen === "home" && <MarketplaceHome shops={shops} count={cart.reduce((a,i)=>a+i.quantity,0)} navigate={go} browse={(q,c,id)=>{setSearch(q);setCategory(c);setShop(id||'');go('catalog');run(async()=>{const r=await api(`/products?search=${encodeURIComponent(q)}&category=${encodeURIComponent(c)}&page=1`);setProducts(r.items);setPages(r.pages);setPage(1);});}}/>}
            {screen === "catalog" && (
              <>
                <View style={{backgroundColor:'#0751e8',padding:12,borderRadius:16,marginBottom:12}}><TextInput style={[st.input,{borderRadius:28}]} accessibilityLabel="البحث في المنتجات" placeholder="ابحث باسم القطعة أو رقمها" value={search} onChangeText={setSearch} onSubmitEditing={()=>load()}/><Btn title="بحث المنتجات" onPress={()=>load()}/></View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:10}}>{['',...categories].map(c=><Pressable accessibilityRole="button" key={c} onPress={()=>{setCategory(c);load(c);}} style={[st.chip,category===c&&{backgroundColor:'#0751e8'}]}><Text style={{color:category===c?'white':'#173655'}}>{c||'الكل'}</Text></Pressable>)}</ScrollView>
                <Text style={st.h2}>اختار قطع غيارك</Text>
                {user&&vehicles.length>0&&<View style={st.card}><Text style={st.h3}>التوافق المعتمد لعربيتي</Text><Text style={st.small}>اختيار فلتر لا يثبت التوافق بذاته. يعرض سجلات الإدارة المعتمدة فقط.</Text><Btn title="بدون تصفية عربية" alt onPress={()=>{setFitmentVehicle('');setNotice('اختار تحديث البحث لتطبيق الفلتر');}}/>{vehicles.map(v=><Btn key={v.id} title={(fitmentVehicle===v.id?'✓ ':'')+v.make+' '+v.model+' '+v.year} alt onPress={()=>{setFitmentVehicle(v.id);setNotice('اختار تحديث البحث لتطبيق الفلتر');}}/>)}<Btn title="تحديث البحث" onPress={()=>load()}/></View>}
                <View style={st.grid}>
                  {products
                    .filter((p) =>
                      p.offers.some((o: any) => !shop || o.shopId === shop),
                    )
                    .map((p) => (
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
            )}
            {screen === "product" && selected && (
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
            )}
            {pendingDevice&&Platform.OS!=='web'&&<View style={st.card}><Text style={st.h3}>الدخول السريع على جهازك</Text><Text style={st.small}>اختياري. نحفظ مفتاحًا محميًا على الجهاز بدل إرسال كود كل مرة. تغيير البصمة أو انتهاء الجلسة أو إلغاؤها قد يطلب التحقق من جديد.</Text><Btn title="تفعيل الدخول المحمي" onPress={enableDevice}/><Btn title="مش دلوقتي" alt onPress={()=>setPendingDevice(null)}/></View>}
            {screen === "login" && (
              <View style={st.card}>
                <Btn title={phoneMode?'دخول البريد للتطوير والإدارة':'الدخول بالموبايل'} alt onPress={()=>setPhoneMode(!phoneMode)}/>
                {phoneMode?<><Text style={st.h2}>أهلًا بيك في غيار</Text><Text style={st.small}>نسخة اختبار فقط. الكود الثابت 123456 ولا يتم إرسال SMS حقيقي.</Text>{hasDevice&&Platform.OS!=='web'&&<Btn title="افتح بالبصمة أو قفل الجهاز" onPress={unlockDevice}/>}<Field label="رقم الموبايل بكود الدولة" value={phoneAuth.phone} onChange={phone=>setPhoneAuth({...phoneAuth,phone})}/>{!!phoneAuth.challengeId&&<><Field label="اسمك" value={phoneAuth.name} onChange={name=>setPhoneAuth({...phoneAuth,name})}/><Field label="كود التحقق" numeric value={phoneAuth.code} onChange={code=>setPhoneAuth({...phoneAuth,code})}/></>}<Btn title={phoneAuth.challengeId?'تأكيد رقم الموبايل':'طلب كود التحقق'} onPress={phoneLogin}/>{!!phoneAuth.challengeId&&<Btn title="تغيير الرقم" alt onPress={()=>setPhoneAuth({...phoneAuth,challengeId:'',code:''})}/>}</>:<><Text style={st.h2}>
                  {register ? "حساب جديد" : "أهلًا بيك"}
                </Text>
                <Text style={st.small}>
                  دخول تطوير وإدارة بالبريد، أو اختار الدخول بالموبايل.
                </Text>
                {register && (
                  <Field
                    label="الاسم"
                    value={auth.name}
                    onChange={(name) => setAuth({ ...auth, name })}
                  />
                )}
                <Field
                  label="البريد الإلكتروني"
                  value={auth.email}
                  onChange={(email) => setAuth({ ...auth, email })}
                />
                <Field
                  label="كلمة المرور (١٠ أحرف على الأقل)"
                  secure
                  value={auth.password}
                  onChange={(password) => setAuth({ ...auth, password })}
                />
                <Btn
                  title={register ? "إنشاء الحساب" : "دخول"}
                  onPress={login}
                />
                <Btn
                  alt
                  title={register ? "عندي حساب" : "إنشاء حساب جديد"}
                  onPress={() => setRegister(!register)}
                /></>}
              </View>
            )}
            {(screen === "cart" || screen === "checkout") && (
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
                    <View style={{backgroundColor:'#eaf3ff',borderRadius:15,padding:14,marginBottom:12}}><Text style={st.h3}>{shops.find(s=>s.id===cart[0]?.shopId)?.name || 'منتجات من محل واحد'}</Text><Text style={st.small}>راجع رقم القطعة والتوافق مع البائع</Text></View>
                    {cart.map((i) => (
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
                            <View style={{flexDirection:'row',borderWidth:1,borderColor:'#d5e2f1',borderRadius:10,alignItems:'center',justifyContent:'space-between',marginTop:12}}><Pressable accessibilityRole="button" accessibilityLabel="تقليل الكمية" disabled={i.quantity<=1} style={{padding:10}} onPress={()=>{setCart(cart.map(x=>x.offerId===i.offerId?{...x,quantity:Math.max(1,x.quantity-1)}:x));key.current='';}}><Text style={{fontSize:22,color:'#173655'}}>−</Text></Pressable><Text>{i.quantity}</Text><Pressable accessibilityRole="button" accessibilityLabel="زيادة الكمية" disabled={i.quantity>=Math.min(i.stock,100)} style={{padding:10}} onPress={()=>{setCart(cart.map(x=>x.offerId===i.offerId?{...x,quantity:Math.min(x.quantity+1,x.stock,100)}:x));key.current='';}}><Text style={{fontSize:22,color:'#173655'}}>+</Text></Pressable></View>
                          </View>
                        </View>
                        <View style={[st.row,{justifyContent:'flex-end'}]}>
                          <Btn
                            title="حذف"
                            alt
                            onPress={() => {
                              setCart(
                                cart.filter((x) => x.offerId !== i.offerId),
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
                          {addresses.map((a) => (
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
                          <Text style={st.h3}>منطقة التوصيل</Text>{deliveryAreas.map(a=><Pressable accessibilityRole="button" key={a.id} onPress={()=>setDeliveryAreaId(a.id)} style={[st.card,{borderWidth:1,borderColor:deliveryAreaId===a.id?'#0757e9':'#e0e8f2'}]}><Text style={st.body}>{a.city} • {a.area} • {money(a.fee)}</Text></Pressable>)}<Btn title="راجع التكلفة النهائية" alt disabled={!addressId||!deliveryAreaId||busy} onPress={reviewQuote}/>{quote&&<View><Text style={st.h3}>الإجمالي النهائي: {money(quote.total)}</Text>{quote.groups.map((g:any)=><Text style={st.small} key={g.shopId}>{shops.find(s=>s.id===g.shopId)?.name||'محل'}: منتجات {money(g.subtotal)} + شحن {money(g.delivery)} = {money(g.total)}</Text>)}</View>}
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
            )}
            {screen === "orders" && (
              <>
                {!!lastPlacedOrder&&<View style={[st.card,{alignItems:'center',paddingVertical:25}]}><View style={{backgroundColor:'#ff7010',borderRadius:50,width:72,height:72,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:44,color:'white'}}>✓</Text></View><Text style={[st.h2,{marginTop:15}]}>تم استلام طلبك</Text><Text style={{fontSize:20,color:'#ff7010',fontWeight:'800'}}>طلب تجريبي</Text><Text style={st.small}>رقم الطلب: {lastPlacedOrder.id.slice(0,8)}</Text><Text style={[st.warning,{textAlign:'center',marginVertical:12}]}>لا يوجد دفع ولا توصيل حقيقي. لا تحتاج لدفع أي مبلغ.</Text><Btn title="تابع الطلب" onPress={()=>setLastPlacedOrder(null)}/></View>}
                <Text style={st.h2}>طلباتي</Text>
                {!user ? (
                  <Btn title="سجّل الدخول" onPress={() => go("login")} />
                ) : (
                  <>
                    <Btn
                      title="تحديث"
                      alt
                      onPress={() => run(() => personal())}
                    />
                    {!orders.length && (
                      <Text style={st.card}>لسه مفيش طلبات.</Text>
                    )}
                    {orders.map((o) => (
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
            )}
            {screen === "profile" && (
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
                    <View style={st.card}><Text style={st.h2}>المفضلة والإعدادات والدعم</Text><Field label="اسم الحساب" value={profileName||user.name} onChange={setProfileName}/><Btn title="حفظ اسم الحساب" onPress={()=>run(async()=>{setUser(await api('/me','PATCH',{name:profileName||user.name}));setNotice('تم حفظ الاسم');})}/><Text style={st.h3}>المفضلة</Text>{!favorites.length&&<Text style={st.small}>لا توجد عناصر محفوظة</Text>}{favorites.map(p=><View key={p.id}><Text style={st.body}>{p.title}</Text><Btn title={'تفاصيل '+p.title} alt onPress={()=>run(async()=>{setSelected(await api('/products/'+p.id));go('product');})}/><Btn title={'إزالة '+p.title} alt onPress={()=>favorite(p)}/></View>)}<Text style={st.h3}>رسالة للدعم</Text><Text style={st.small}>رسالة داخل النظام فقط. لا تكتب كلمات سر أو بيانات بطاقات.</Text><Field label="عنوان رسالة الدعم" value={support.subject} onChange={subject=>setSupport({...support,subject})}/><Field label="رسالة الدعم" value={support.message} onChange={message=>setSupport({...support,message})}/><Btn title="إرسال للدعم" onPress={()=>run(async()=>{await api('/support-tickets','POST',support);setTickets(await api('/support-tickets'));setSupport({subject:'',message:''});setNotice('تم تسجيل رسالة الدعم داخل النظام');})}/>{tickets.map(t=><View key={t.id}><Text style={st.body}>{t.subject} • {t.state}</Text><Text style={st.small}>{t.message}</Text>{!!t.reply&&<Text style={st.body}>رد الدعم: {t.reply}</Text>}</View>)}</View>
                    {user.role==='CUSTOMER'&&<View style={st.card}><Text style={st.h2}>انضم كتاجر</Text><Text style={st.small}>لا يمكن البيع قبل مراجعة الإدارة والموافقة.</Text>{application&&<Text style={st.warning}>{application.state} • {application.reviewReason}</Text>}{(!application||application.state==='REJECTED')&&<>{Object.entries({name:'اسم المحل',city:'مدينة المحل',address:'عنوان المحل',phone:'هاتف المحل',details:'تفاصيل النشاط'}).map(([k,label])=><Field key={k} label={label} value={(join as any)[k]} onChange={v=>setJoin({...join,[k]:v})}/>)}<Btn title="إرسال طلب انضمام" onPress={()=>run(async()=>{await api('/shop-applications','POST',join);await personal();setNotice('تم إرسال طلب الانضمام للمراجعة');})}/></>}</View>}
                    <View style={st.card}>
                      <Text style={st.h2}>عناويني</Text>
                      {addresses.map((a) => (
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
                      {vehicles.map((v) => (
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
            )}
            <Text style={[st.small, { textAlign: "center", margin: 25 }]}>
              غيار • إصدار تطوير 0.1 • اسم وهوية مبدئية
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={st.tabs}>
          {[
            ["home", "الرئيسية"],
            ["catalog", "المحلات"],
            ["orders", "طلباتي"],
            ["profile", "حسابي"],
          ].map(([s, t]) => (
            <Pressable
              key={s}
              accessibilityRole="button"
              onPress={() => go(s)}
              style={[
                st.tab,
                screen === s && {
                  borderBottomColor: "#ff710a",
                  borderBottomWidth: 3,
                },
              ]}
            >
              {s !== 'cart' && <Image source={s==='home'?require('./assets/home-icon.png'):s==='catalog'?require('./assets/shops-icon.png'):s==='orders'?require('./assets/orders-icon.png'):require('./assets/profile-icon.png')} style={{width:23,height:23,marginBottom:3,tintColor:screen===s?'#ff710a':'#7f8999'}}/>}
              <Text
                style={{
                  fontSize:12,
                  color: screen === s ? "#ff710a" : "#71809a",
                  fontWeight: "700",
                }}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f7fc" },
  header: {
    backgroundColor: "#0757e9",
    padding: 18,
    alignItems: "flex-end",
    gap: 5,
  },
  logo: { fontSize: 36, fontWeight: "900", color: "white" },
  tabs: {
    flexDirection: "row-reverse",
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  tab: { padding: 14, paddingHorizontal: 9 },
  content: {
    padding: 16,
    paddingBottom: 30,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  heroArt: {
    position: "absolute",
    left: -30,
    bottom: -10,
    width: "60%",
    height: 220,
    resizeMode: "contain",
  },
  heroStripe: {
    backgroundColor: "#ff710a",
    color: "white",
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
    padding: 6,
    transform: [{ rotate: "-2deg" }],
  },
  categoryGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 7,
    marginBottom: 18,
  },
  categoryTile: { flex: 1 },
  categoryImage: { width: "100%", height: 68, borderRadius: 14 },
  categoryLabel: {
    textAlign: "center",
    fontSize: 12,
    color: "#1c3453",
    fontWeight: "700",
    marginTop: 7,
  },
  vehicleBar: {
    backgroundColor: "#e4eeff",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 17,
  },
  campaignRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 12 },
  promo: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    minHeight: 155,
    overflow: "hidden",
  },
  promoImage: {
    position: "absolute",
    left: -15,
    bottom: 0,
    width: 90,
    height: 105,
    opacity: 0.65,
    borderRadius: 14,
  },
  promoTitle: {
    fontSize: 23,
    fontWeight: "900",
    textAlign: "right",
    color: "#302545",
  },
  promoText: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
    color: "#49405b",
  },
  promoLink: {
    fontSize: 11,
    fontWeight: "800",
    backgroundColor: "#ff710a",
    color: "white",
    padding: 7,
    borderRadius: 20,
    textAlign: "center",
    marginTop: 20,
  },
  storeCard: {
    width: 235,
    backgroundColor: "white",
    borderRadius: 17,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e0e8f2",
  },
  storeImage: { width: "100%", height: 100 },
  hero: {
    backgroundColor: "#0757e9",
    padding: 25,
    borderRadius: 22,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 41,
    fontWeight: "900",
    color: "white",
    textAlign: "right",
    marginVertical: 12,
  },
  heroTag: { color: "#ffcc9e", textAlign: "right", fontWeight: "700" },
  card: {
    backgroundColor: "white",
    borderRadius: 17,
    padding: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e1e9f4",
  },
  h2: {
    fontSize: 23,
    fontWeight: "800",
    textAlign: "right",
    color: "#14294b",
    marginVertical: 13,
  },
  h3: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
    color: "#14294b",
    marginVertical: 8,
  },
  small: {
    fontSize: 11,
    color: "#7a879a",
    textAlign: "right",
    marginVertical: 5,
  },
  body: { fontSize: 14, textAlign: "right", lineHeight: 24, color: "#344762" },
  label: {
    textAlign: "right",
    fontWeight: "700",
    color: "#344762",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dce4ef",
    borderRadius: 11,
    padding: 12,
    textAlign: "right",
    backgroundColor: "white",
    color: "#14294b",
  },
  btn: {
    backgroundColor: "#ff6c08",
    padding: 15,
    borderRadius: 11,
    alignItems: "center",
    marginTop: 9,
  },
  alt: { backgroundColor: "#edf4ff" },
  btnText: { color: "white", fontWeight: "800" },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  product: {
    backgroundColor: "white",
    borderRadius: 17,
    padding: 12,
    marginBottom: 13,
    width: "48%",
    borderWidth: 1,
    borderColor: "#e1e9f4",
  },
  productImage: {
    width: "100%",
    height: 130,
    resizeMode: "contain",
    backgroundColor: "#f9f6f0",
    borderRadius: 13,
  },
  price: {
    color: "#ff6409",
    fontSize: 23,
    fontWeight: "900",
    textAlign: "right",
    marginVertical: 9,
  },
  link: {
    color: "#0757e9",
    fontWeight: "700",
    textAlign: "right",
    marginVertical: 7,
  },
  chip: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#e0e8f2",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  error: {
    padding: 13,
    backgroundColor: "#fff0ed",
    color: "#ac3021",
    textAlign: "right",
    marginBottom: 15,
    borderRadius: 11,
  },
  success: {
    padding: 13,
    backgroundColor: "#e6f7ed",
    color: "#17663a",
    textAlign: "right",
    marginBottom: 15,
    borderRadius: 11,
  },
  warning: {
    padding: 12,
    backgroundColor: "#fff5e8",
    color: "#8b5c1b",
    textAlign: "right",
    fontSize: 12,
    lineHeight: 22,
    borderRadius: 9,
    marginVertical: 12,
  },
});
