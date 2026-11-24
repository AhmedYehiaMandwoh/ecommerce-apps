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

export function LoginScreen({ c }: { c: any }) {
  const { auth, hasDevice, login, phoneAuth, phoneLogin, phoneMode, register, setAuth, setPhoneAuth, setPhoneMode, setRegister, unlockDevice } = c;
  return (
    <>
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
    </>
  );
}
