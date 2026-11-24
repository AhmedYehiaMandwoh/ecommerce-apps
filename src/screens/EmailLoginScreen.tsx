import React from "react";
import { View, Text } from "react-native";
import { Cta, Input, Header, Card } from "../ui/kit";

export function EmailLoginScreen({ c }: { c: any }) {
  const { auth, setAuth, login, register, setRegister, back } = c;
  return (
    <View className="bg-white flex-1" style={{ minHeight: 700 }}>
      <Header back onBack={back} title={register ? "حساب جديد" : "دخول بالبريد"} subtitle="للتطوير والاختبار فقط" tall />
      <View className="p-4">
        <Card>
          {register && <Input label="الاسم" value={auth.name} onChange={(name) => setAuth({ ...auth, name })} />}
          <Input label="البريد الإلكتروني" value={auth.email} onChange={(email) => setAuth({ ...auth, email })} />
          <Input label="كلمة السر" secure value={auth.password} onChange={(password) => setAuth({ ...auth, password })} />
          <Cta title={register ? "إنشاء الحساب" : "دخول"} onPress={login} />
          <Cta title={register ? "عندي حساب" : "حساب جديد"} soft onPress={() => setRegister(!register)} />
        </Card>
      </View>
    </View>
  );
}
