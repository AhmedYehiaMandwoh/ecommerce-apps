import { API, BASE, imageUrl, money, statuses, storage } from "./src/shared";
import { st } from "./src/styles";
import { CatalogScreen } from "./src/screens/CatalogScreen";
import { ProductScreen } from "./src/screens/ProductScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { OrdersScreen } from "./src/screens/OrdersScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
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
  const ctx = { add, address, addressId, addresses, api, application, auth, busy, cancelReasons, cart, categories, category, deliveryAreaId, deliveryAreas, favorite, favorites, fitmentVehicle, go, hasDevice, join, key, lastPlacedOrder, load, login, order, orders, page, pages, personal, phoneAuth, phoneLogin, phoneMode, products, profileName, protectedOptions, quote, register, returnForm, reviewQuote, run, screen, search, selected, setAddress, setAddressId, setAuth, setCancelReasons, setCart, setCategory, setDeliveryAreaId, setFitmentVehicle, setHasDevice, setJoin, setLastPlacedOrder, setNotice, setPendingDevice, setPhoneAuth, setPhoneMode, setProfileName, setRegister, setReturn, setScreen, setSearch, setSelected, setSupport, setTickets, setToken, setUser, setVehicle, shop, shops, subtotal, support, tickets, unlockDevice, user, vehicle, vehicles };
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
            {screen === "catalog" && <CatalogScreen c={ctx} />}
            {screen === "product" && selected && <ProductScreen c={ctx} />}
            {pendingDevice&&Platform.OS!=='web'&&<View style={st.card}><Text style={st.h3}>الدخول السريع على جهازك</Text><Text style={st.small}>اختياري. نحفظ مفتاحًا محميًا على الجهاز بدل إرسال كود كل مرة. تغيير البصمة أو انتهاء الجلسة أو إلغاؤها قد يطلب التحقق من جديد.</Text><Btn title="تفعيل الدخول المحمي" onPress={enableDevice}/><Btn title="مش دلوقتي" alt onPress={()=>setPendingDevice(null)}/></View>}
            {screen === "login" && <LoginScreen c={ctx} />}
            {(screen === "cart" || screen === "checkout") && <CartScreen c={ctx} />}
            {screen === "orders" && <OrdersScreen c={ctx} />}
            {screen === "profile" && <ProfileScreen c={ctx} />}
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

