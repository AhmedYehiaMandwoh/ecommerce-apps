import { t, cx } from "../i18n";
import React from "react";
import { View, Text } from "react-native";
import { Cta, Input, Header, Card } from "../components";

export function EmailLoginScreen({ c }: { c: any }) {
  const { auth, setAuth, login, register, setRegister, back } = c;
  return (
    <View className={cx("bg-white flex-1 min-h-[700px]")}>
      <Header back onBack={back} title={register ? t('حساب جديد') : t('دخول بالبريد')} subtitle={t('للتطوير والاختبار فقط')} tall />
      <View className={cx("p-4")}>
        <Card>
          {register && <Input label={t('الاسم')} value={auth.name} onChange={(name) => setAuth({ ...auth, name })} />}
          <Input label={t('البريد الإلكتروني')} value={auth.email} onChange={(email) => setAuth({ ...auth, email })} />
          <Input label={t('كلمة السر')} secure value={auth.password} onChange={(password) => setAuth({ ...auth, password })} />
          <Cta title={register ? t('إنشاء الحساب') : t('دخول')} onPress={login} />
          <Cta title={register ? t('عندي حساب') : t('حساب جديد')} soft onPress={() => setRegister(!register)} />
        </Card>
      </View>
    </View>
  );
}
