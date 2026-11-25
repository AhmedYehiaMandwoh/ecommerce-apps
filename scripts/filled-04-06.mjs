// Captures customer screens at 390x727 (the PDF phone aspect) from scrollTop 0.
// Usage: APP_URL=http://127.0.0.1:8082 OUT=./shots ITEMS=1 node scripts/capture-matched.mjs
import { chromium } from '@playwright/test';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:390,height:727}});
const phoneNo='01'+String(Date.now()).slice(-9);const O=(process.env.OUT||'./shots-matched')+'/';const N=Number(process.env.ITEMS||1);const APP=process.env.APP_URL||'http://127.0.0.1:8082';
import fs from 'fs';fs.mkdirSync(O,{recursive:true});
const snap=async(n,expectText)=>{await p.waitForTimeout(1200);if(expectText){await p.getByText(expectText).or(p.getByLabel(expectText)).first().waitFor({timeout:6000}).catch(()=>{throw new Error('route assertion failed for '+n+': missing text '+expectText)})};await p.evaluate(()=>{window.scrollTo(0,0);document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0})});await p.waitForTimeout(300);await p.screenshot({path:O+n+'.png'});console.log('shot',n)};
const click=async(t)=>{await p.getByRole('button',{name:t}).first().click({timeout:8000})};
await p.goto(APP,{waitUntil:'networkidle',timeout:110000});await p.waitForTimeout(3000);
await snap('01-splash','تسجيل الدخول');await click('تسجيل الدخول');await p.waitForTimeout(800);await snap('02-phone','رقم الموبايل');
await p.getByLabel('رقم الموبايل').fill(phoneNo);await click('إرسال رمز التحقق ‹');await p.waitForTimeout(1500);
if(await p.getByLabel('الاسم').count())await p.getByLabel('الاسم').first().fill('مستخدم تجريبي');await p.getByLabel('كود التحقق').first().fill('123456');await click('تأكيد الكود ‹');await p.waitForTimeout(2500);
await p.waitForTimeout(4500);
await click('اختر عربيتك');await p.waitForTimeout(800);
await click('اختر الماركة');await click('Toyota');await click('اختر الموديل');await click('Corolla');await click('اختر سنة الصنع');await click('2020');await click('اختر المحرك');await click('1.6L');await snap('04-vehicle-filled','اختار عربيتك');await click('الرئيسية');
await p.waitForTimeout(800);
await click('حسابي');await p.waitForTimeout(1200);
await click('عناويني');await p.waitForTimeout(800);await click('إضافة عنوان جديد');
console.log('route', await p.evaluate(()=>location.href));
await p.getByLabel('المدينة').fill('القاهرة');await p.getByLabel('المنطقة').fill('مدينة نصر');await p.getByLabel('الشارع').fill('شارع 9');await p.getByLabel('تفاصيل العنوان').fill('عمارة 5 شقة 3');await p.getByLabel('رقم التواصل').fill('01602741357');
await snap('06-add-address-filled','المدينة');
await b.close();
