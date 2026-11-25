// 07 home with real search history. Usage: PHONE=... APP_URL=... SHOT=/tmp/x.png
import { chromium } from '@playwright/test';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:390,height:727}});
const btn=(t,o={})=>p.getByRole('button',{name:t,...o}).first();
await p.goto(process.env.APP_URL,{waitUntil:'networkidle',timeout:110000});await p.waitForTimeout(3000);
await btn('تسجيل الدخول').click();await p.getByLabel('رقم الموبايل').fill(process.env.PHONE);await btn('إرسال رمز التحقق ‹').click();
await p.getByLabel('كود التحقق').first().waitFor({timeout:25000});if(await p.getByLabel('الاسم').count())await p.getByLabel('الاسم').first().fill('مستخدم تجريبي');await p.getByLabel('كود التحقق').first().fill('123456');await btn('تأكيد الكود ‹').click();await p.waitForTimeout(2500);
for(const t of ['فلتر زيت','تيل فرامل']){await p.getByLabel('البحث').first().fill(t);await p.getByLabel('البحث').first().press('Enter');await p.waitForTimeout(1500);await btn('الرئيسية',{exact:true}).click();await p.waitForTimeout(1000);}
await p.screenshot({path:process.env.SHOT});console.log('scrollTops',await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+4&&e.clientHeight>300).map(e=>e.scrollTop)));await b.close();
