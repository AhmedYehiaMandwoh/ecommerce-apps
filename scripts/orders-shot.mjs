import { chromium } from '@playwright/test';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:390,height:727}});
const btn=(t,o={})=>p.getByRole('button',{name:t,...o}).first();
await p.goto(process.env.APP_URL||'http://127.0.0.1:8082',{waitUntil:'networkidle',timeout:110000});await p.waitForTimeout(3000);
await btn('تسجيل الدخول').click();await p.getByLabel('رقم الموبايل').fill(process.env.PHONE);await btn('إرسال رمز التحقق ‹').click();await p.waitForTimeout(1500);
await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/o16dbg.png'});if(await p.getByLabel('الاسم').count())await p.getByLabel('الاسم').first().fill('مستخدم تجريبي');await p.getByLabel('كود التحقق').first().fill('123456');await btn('تأكيد الكود ‹').click();await p.waitForTimeout(2500);
await btn('طلباتي',{exact:true}).click();await p.waitForTimeout(2500);await p.screenshot({path:process.env.SHOT});await b.close();
