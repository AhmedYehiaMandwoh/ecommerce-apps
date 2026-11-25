// Screen 16 geometry: details links vs bottom nav top at scrollTop 0, 390x727.
import { chromium } from '@playwright/test';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:390,height:727}});const btn=(t,o={})=>p.getByRole('button',{name:t,...o}).first();
await p.goto(process.env.APP_URL,{waitUntil:'networkidle',timeout:110000});await p.waitForTimeout(3000);
await btn('تسجيل الدخول').click();await p.getByLabel('رقم الموبايل').fill(process.env.PHONE);await btn('إرسال رمز التحقق ‹').click();
await p.getByLabel('كود التحقق').first().waitFor({timeout:25000});if(await p.getByLabel('الاسم').count())await p.getByLabel('الاسم').first().fill('مستخدم تجريبي');await p.getByLabel('كود التحقق').first().fill('123456');await btn('تأكيد الكود ‹').click();await p.waitForTimeout(2500);
await btn('طلباتي',{exact:true}).click();await p.waitForTimeout(2500);await p.screenshot({path:process.env.SHOT});
const r=await p.evaluate(()=>{const nav=[...document.querySelectorAll('[role=button]')].find(e=>e.getAttribute('aria-label')==='الرئيسية');return {navTop:Math.round(nav.getBoundingClientRect().top),links:[...document.querySelectorAll('[aria-label="عرض التفاصيل"]')].map(e=>{const x=e.getBoundingClientRect();return [Math.round(x.top),Math.round(x.bottom)]}),scroll:[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+4&&e.clientHeight>300).map(e=>e.scrollTop)}});
console.log(JSON.stringify(r));await b.close();
