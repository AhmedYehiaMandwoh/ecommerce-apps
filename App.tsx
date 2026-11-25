import { t, cx, isEn } from "./src/i18n";
import apiAr from "./src/api-ar.json";
import { SplashScreen } from "./src/screens/SplashScreen";
import { Btn } from "./components/Controls";
import { st } from "./src/styles";
import { PhoneLoginScreen } from "./src/screens/PhoneLoginScreen";
import { EmailLoginScreen } from "./src/screens/EmailLoginScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { VehicleScreen } from "./src/screens/VehicleScreen";
import { AddressesScreen } from "./src/screens/AddressesScreen";
import { AddAddressScreen } from "./src/screens/AddAddressScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { ShopsScreen } from "./src/screens/ShopsScreen";
import { ShopScreen } from "./src/screens/ShopScreen";
import { ProductScreen } from "./src/screens/ProductScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { CheckoutScreen } from "./src/screens/CheckoutScreen";
import { PaymentScreen } from "./src/screens/PaymentScreen";
import { PlacedScreen } from "./src/screens/PlacedScreen";
import { OrdersScreen } from "./src/screens/OrdersScreen";
import { OrderDetailScreen } from "./src/screens/OrderDetailScreen";
import { TrackScreen } from "./src/screens/TrackScreen";
import { SupportScreen } from "./src/screens/SupportScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { FavoritesScreen } from "./src/screens/FavoritesScreen";
import "./global.css";
import { API, BASE, imageUrl, money, statuses, storage, egPhone } from "./src/shared";
import React, { useState, useEffect } from "react";
import { Cta } from "./src/ui/kit";
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
  const TABS=["home","shops","orders","account"];
  const ALIAS:Record<string,string>={login:"phone",catalog:"search",profile:"account"};
  const [stack, setStack] = useState<string[]>(["splash"]);
  const screen = stack[stack.length-1];
  const setScreen = (s:string)=>setStack([ALIAS[s]||s]);
  const [detailId,setDetailId]=useState("");
  const [placedSnapshot,setPlacedSnapshot]=useState<any[]>([]);
  const [history,setHistory]=useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(""), 4000); return () => clearTimeout(t); }, [notice]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [shop, setShop] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [productQty, setProductQty] = useState(1);
  useEffect(() => { setProductQty(1); }, [selected?.id]);
  const [cart, setCart] = useState<any[]>([]);
  const [cartReady,setCartReady]=useState(false);
  const [favorites,setFavorites]=useState<any[]>([]);
  const [tickets,setTickets]=useState<any[]>([]);
  const [profileName,setProfileName]=useState('');
  const [support,setSupport]=useState({subject:'',message:''});
  async function favorite(p:any){if(!user){go('login');return;}await run(async()=>{const saved=await api('/favorites');await api('/favorites/'+p.id,saved.some((f:any)=>f.id===p.id)?'DELETE':'POST');setFavorites(await api('/favorites'));setNotice(t('تم تحديث المفضلة'));});}
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
  const protectedOptions={requireAuthentication:true,authenticationPrompt:t('افتح جلسة غيار المحفوظة'),keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY};
  async function acceptPhone(r:any){setToken(r.token);setUser(r.user);await personal(r.token);setScreen('home');}
  async function phoneLogin(){await run(async()=>{if(!phoneAuth.challengeId){const r=await api('/auth/phone/start','POST',{phone:egPhone(phoneAuth.phone),deviceLabel:Platform.OS+t(' غيار')});setPhoneAuth({...phoneAuth,challengeId:r.challengeId});setNotice(r.testMode?t('اختبار فقط: كودك 123456، لم يتم إرسال SMS.'):t('أدخل كود التحقق'));}else{const r=await api('/auth/phone/check','POST',{challengeId:phoneAuth.challengeId,code:phoneAuth.code,name:phoneAuth.name});await acceptPhone(r);if(Platform.OS!=='web')setPendingDevice(r);else{await storage.set(r.token);setNotice(t('جلسة المتصفح الحالية فقط. الدخول المحمي متاح على التطبيق الأصلي.'));}setPhoneAuth({...phoneAuth,code:'',challengeId:''});}});}
  async function enableDevice(){await run(async()=>{if(Platform.OS==='web'||!pendingDevice)return;if(!await LocalAuthentication.isEnrolledAsync())throw Error(t('فعّل قفل الجهاز أو البصمة أولًا. تقدر تكمل الجلسة الحالية بدون حفظ.'));await SecureStore.setItemAsync('ghiyar-device',JSON.stringify({token:pendingDevice.deviceToken,id:pendingDevice.deviceId}),protectedOptions);await SecureStore.setItemAsync('ghiyar-device-present','yes');setHasDevice(true);setPendingDevice(null);setNotice(t('تم حفظ مفتاح الجلسة بشكل محمي على الجهاز. الاختبار الفعلي للبصمة أو رمز الجهاز مطلوب على جهاز حقيقي.'));});}
  async function unlockDevice(){await run(async()=>{const unlocked=await LocalAuthentication.authenticateAsync({promptMessage:t('افتح غيار'),disableDeviceFallback:false,cancelLabel:t('إلغاء')});if(!unlocked.success)throw Error(t('تم إلغاء فتح الجهاز'));const saved=await SecureStore.getItemAsync('ghiyar-device',protectedOptions);if(!saved){setHasDevice(false);throw Error(t('الجلسة غير متاحة. تحقق برقم الموبايل مرة أخرى.'));}const d=JSON.parse(saved);const r=await api('/auth/device/refresh','POST',{deviceToken:d.token});try{await SecureStore.setItemAsync('ghiyar-device',JSON.stringify({token:r.deviceToken,id:r.deviceId}),protectedOptions);}catch(e){await api('/auth/devices/'+r.deviceId,'DELETE',undefined,r.token);throw e;}await acceptPhone(r);});}
  const [register, setRegister] = useState(false);
  const [auth, setAuth] = useState({ name: "", email: "", password: "" });
  const [address, setAddress] = useState({
    label: t('المنزل'),
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
  const [discountCode,setDiscountCode]=useState('');
  const [vehicleCatalog,setVehicleCatalog]=useState<any>({makes:[]});
  useEffect(()=>{api('/vehicle-catalog').then(setVehicleCatalog).catch(()=>{});},[]);
  useEffect(()=>{setQuote(null);key.current='';},[addressId,deliveryAreaId,JSON.stringify(cart.map(i=>[i.offerId,i.quantity])),discountCode]);
  async function reviewQuote(){await run(async()=>{setQuote(await api('/orders/quote','POST',{items:cart.map(i=>({offerId:i.offerId,quantity:i.quantity})),addressId,deliveryAreaId,...(discountCode.trim()?{discountCode:discountCode.trim()}:{})}));});}
  async function api(path: string, method = "GET", body?: any, tk = token) {
    const res = await fetch(API + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text=await res.text();
    const data = text?JSON.parse(text):null;
    if(res.status===401&&tk){setToken('');setUser(null);await storage.clear();}
    if (!res.ok)
      throw Error(
        Array.isArray(data.message)
          ? data.message.join(t('، '))
          : data?.message || t('تعذر إتمام العملية'),
      );
    return data;
  }
  const arabicError = (m: string) => ({ 'Delivery area does not serve this address city': t('منطقة التوصيل المختارة لا تخدم مدينة هذا العنوان. اختر منطقة من نفس المدينة.'), 'Discount code invalid or expired': t('كود الخصم غير صحيح أو منتهي.'), 'Insufficient stock': t('الكمية المطلوبة غير متوفرة.'), 'Basket total changed, review a fresh quote': t('تغير إجمالي السلة. راجع التكلفة مرة أخرى.'), 'Choose your address': t('اختر عنوان التوصيل.') } as Record<string, string>)[m] || (isEn ? m : ((apiAr as Record<string, string>)[m] ?? m));
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
          ? t('تعذر الاتصال بالخادم. راجع عنوان API واتصال الشبكة.')
          : arabicError(e.message),
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
    s = ALIAS[s] || s;
    setError("");
    setNotice("");
    setStack(TABS.includes(s) ? [s] : [...stack, s]);
    if (["orders", "account", "checkout", "payment", "addresses", "vehicle", "support", "favorites", "track", "orderdetail"].includes(s) && token)
      run(() => personal());
  }
  function back() {
    setError("");
    setNotice("");
    setStack(stack.length > 1 ? stack.slice(0, -1) : ["home"]);
  }
  function browse(q: string, cat: string, id?: string) {
    setSearch(q); setCategory(cat); setShop(id || "");
    if (q.trim()) setHistory([q.trim(), ...history.filter((x) => x !== q.trim())].slice(0, 5));
    go(id ? "shop" : "search");
    run(async () => {
      const r = await api(`/products?search=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}&page=1${id ? "&shopId=" + encodeURIComponent(id) : ""}`);
      setProducts(r.items); setPages(r.pages); setPage(1);
    });
  }
  function addMany(p: any, o: any, n: number) {
    const old = cart.find((i) => i.offerId === o.id);
    const base = old ? old.quantity : 0;
    const q = Math.min(o.stock, base + n);
    if (q <= base) return;
    const item = { offerId: o.id, shopId: o.shopId, title: p.title, image: p.image, price: o.price, stock: o.stock, quantity: q };
    setCart(old ? cart.map((i) => (i.offerId === o.id ? item : i)) : [...cart, item]);
    key.current = "";
    setNotice(t('اتضاف للسلة'));
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
    setNotice(t('اتضاف للسلة'));
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
    if(!quote){setError(t('راجع منطقة التوصيل والتكلفة أولًا'));return;}
    if (!addressId) {
      setError(t('اختار عنوان التوصيل'));
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
        ...(quote.discountCode ? { discountCode: quote.discountCode } : {}),
        requestKey: key.current,
      });
      setPlacedSnapshot(cart);
      setCart([]);
      setLastPlacedOrder(placed);
      key.current = "";
      await personal();
      setScreen("placed");
    });
  }
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((a, i) => a + i.quantity, 0);
  const ctx: any = { productQty, setProductQty, setError, discountCode, setDiscountCode, vehicleCatalog, add, addMany, address, addressId, addresses, api, application, auth, back, browse, busy, cancelReasons, cart, categories, category, count, deliveryAreaId, deliveryAreas, detailId, error, favorite, favorites, fitmentVehicle, go, hasDevice, history, join, key, lastPlacedOrder, load, login, notice, order, orders, page, pages, personal, phoneAuth, phoneLogin, phoneMode, placedSnapshot, products, profileName, protectedOptions, quote, register, returnForm, reviewQuote, run, screen, search, selected, setAddress, setAddressId, setAuth, setCancelReasons, setCart, setCategory, setDeliveryAreaId, setDetailId, setFitmentVehicle, setHasDevice, setJoin, setLastPlacedOrder, setNotice, setPage, setPendingDevice, setPhoneAuth, setPhoneMode, setProducts, setProfileName, setRegister, setReturn, setScreen, setSearch, setSelected, setShop, setSupport, setTickets, setToken, setUser, setVehicle, shop, shops, subtotal, support, tickets, unlockDevice, user, vehicle, vehicles };
  const NOTAB = ["splash", "phone", "emaillogin", "placed", "product", "cart", "checkout"];
  const INLINE = ["checkout", "payment", "addresses", "addaddress", "vehicle", "support", "settings", "phone"];
  const tabs: [string, string, any][] = [
    ["home", t('الرئيسية'), require("./assets/home-icon.png")], ["shops", t('المحلات'), require("./assets/shops-icon.png")],
    ["orders", t('طلباتي'), require("./assets/orders-icon.png")], ["account", t('حسابي'), require("./assets/profile-icon.png")],
  ];
  const active = ({ search: "shops", shop: "shops", product: "home", cart: "home", checkout: "home", payment: "home", addresses: "home", addaddress: "home", vehicle: "home", favorites: "account", settings: "account", support: "orders", track: "orders", orderdetail: "orders" } as Record<string, string>)[screen] || screen;
  const body = (
    <>
      {screen === "splash" && <SplashScreen c={ctx} />}
      {screen === "phone" && <PhoneLoginScreen c={ctx} />}
      {screen === "emaillogin" && <EmailLoginScreen c={ctx} />}
      {screen === "account" && <AccountScreen c={ctx} />}
      {screen === "vehicle" && <VehicleScreen c={ctx} />}
      {screen === "addresses" && <AddressesScreen c={ctx} />}
      {screen === "addaddress" && <AddAddressScreen c={ctx} />}
      {screen === "home" && <HomeScreen c={ctx} />}
      {screen === "search" && <SearchScreen c={ctx} />}
      {screen === "shops" && <ShopsScreen c={ctx} />}
      {screen === "shop" && <ShopScreen c={ctx} />}
      {screen === "product" && <ProductScreen c={ctx} />}
      {screen === "cart" && <CartScreen c={ctx} />}
      {screen === "checkout" && <CheckoutScreen c={ctx} />}
      {screen === "payment" && <PaymentScreen c={ctx} />}
      {screen === "placed" && <PlacedScreen c={ctx} />}
      {screen === "orders" && <OrdersScreen c={ctx} />}
      {screen === "orderdetail" && <OrderDetailScreen c={ctx} />}
      {screen === "track" && <TrackScreen c={ctx} />}
      {screen === "support" && <SupportScreen c={ctx} />}
      {screen === "settings" && <SettingsScreen c={ctx} />}
      {screen === "favorites" && <FavoritesScreen c={ctx} />}
    </>
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0751e8" }}>
        <StatusBar style="light" />
        <View pointerEvents="none" style={{ position: "absolute", top: 8, left: 8, right: 8, zIndex: 50 }}>
          {!!error && !INLINE.includes(screen) && <Text accessibilityRole="alert" className={cx("bg-red-50 text-red-700 p-3 text-right rounded-xl border border-red-200")}>{error}</Text>}
          {!!notice && !INLINE.includes(screen) && <Text className={cx("bg-green-50 text-green-800 p-3 text-right rounded-xl border border-green-200")}>{notice}</Text>}
        </View>
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#ffffff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#ffffff", width: "100%", maxWidth: 804, alignSelf: "center" }} keyboardShouldPersistTaps="handled">
                        {busy && <ActivityIndicator color="#0757e9" />}
            {pendingDevice&&Platform.OS!=='web'&&<View className={cx("bg-white rounded-2xl p-3 m-3")}><Text style={st.h3}>{t('الدخول السريع على جهازك')}</Text><Text style={st.small}>{t('اختياري. نحفظ مفتاحًا محميًا على الجهاز بدل إرسال كود كل مرة. تغيير البصمة أو انتهاء الجلسة أو إلغاؤها قد يطلب التحقق من جديد.')}</Text><Btn title={t('تفعيل الدخول المحمي')} onPress={enableDevice}/><Btn title={t('مش دلوقتي')} alt onPress={()=>setPendingDevice(null)}/></View>}
            {body}
          </ScrollView>
        </KeyboardAvoidingView>
        {screen === "product" && !!selected?.offers?.[0] && (
          <View className={cx("bg-white px-3 pt-2 pb-2 border-t border-slate-200")}>
            <Cta title={selected.offers[0].stock ? t('أضف للسلة') : t('غير متوفر')} disabled={!selected.offers[0].stock} onPress={() => { addMany(selected, selected.offers[0], productQty); go("cart"); }} />
          </View>
        )}
        {!NOTAB.includes(screen) && (
          <View className={cx("flex-row-reverse bg-white border-t border-slate-200")}>
            {tabs.map(([s, t, icon]) => {
              const on = active === s;
              const pdf: Record<string, [any, number, number]> = { account: [require("./assets/pdf/nav-account.png"), 19, 21], orders: [require("./assets/pdf/nav-orders.png"), 18.3, 20.7], shops: [require("./assets/pdf/nav-shops.png"), 23.3, 20.7], home: [require("./assets/pdf/nav-home-on.png"), 23.7, 21.1] };
              const [src, w, h] = s === "home" && !on ? [icon, 26, 26] : pdf[s];
              return (
              <Pressable key={s} accessibilityRole="button" accessibilityLabel={t} onPress={() => go(s)} className={cx("flex-1 items-center")} style={{ paddingTop: 7, paddingBottom: 10 }}>
                <View style={{ height: 26, justifyContent: "center" }}><Image source={src} style={{ width: w, height: h, ...(s === "home" && !on ? { tintColor: "#5a5a63" } : on && s !== "home" ? { tintColor: "#ff640f" } : {}) }} /></View>
                <Text className={cx(`font-bold ${on ? "text-accent" : "text-slate-600"}`)} style={{ fontSize: 12.5, lineHeight: 17, marginTop: 0 }}>{t}</Text>
              </Pressable>
            ); })}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
