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
await snap('07-home','بتدور على إيه');
await click('اختر عربيتك');await p.waitForTimeout(800);await snap('04-vehicle','اختار عربيتك');await click('الرئيسية');
await click('فرامل');await p.waitForTimeout(1500);await snap('08-search','نتائج البحث');
await p.locator('[role=button][aria-label^="تيل فرامل"]').first().click();await p.waitForTimeout(1500);await snap('11-product','أضف للسلة');await click('الرئيسية');
await click('حسابي');await snap('03-account','مرحبا بك في غيار');console.log('account rows: support',await p.getByRole('button',{name:'المساعدة'}).count(),'settings',await p.getByRole('button',{name:'الإعدادات'}).count());await click('عناويني');
for(const [c,a] of [['الجيزة','6 أكتوبر'],['القاهرة','مدينة نصر']]){await click('إضافة عنوان جديد');if(c==='الجيزة')await snap('06-add-address','المدينة');await p.getByLabel('المدينة').fill(c);await p.getByLabel('المنطقة').fill(a);await p.getByLabel('الشارع').fill('شارع 9');await p.getByLabel('تفاصيل العنوان').fill('عمارة 5 شقة 3');await p.getByLabel('رقم التواصل').fill(phoneNo);await click('حفظ العنوان');await p.waitForTimeout(1500);}
await snap('05-two-addresses','عناويني');
for(const i of [0,1]){await click('المحلات');await p.waitForTimeout(1200);if(i==0)await snap('09-shops','المحلات');await p.locator('[role=button]').filter({hasText:'قطع غيار وصيانة'}).nth(i).click();await p.waitForTimeout(1500);if(i==0)await snap('10-shop');for(const j of Array.from({length:N},(_,k)=>k)){await p.locator('[role=button][aria-label^="أضف "]').nth(j).click();await p.waitForTimeout(500);}}
await click('الرئيسية');await click('السلة');await p.waitForTimeout(800);await snap('12-cart','متابعة الطلب');
await click('متابعة الطلب');await p.waitForTimeout(1500);
await p.locator('[role=button]').filter({hasText:'مدينة نصر'}).first().click();await p.getByRole('button',{name:'القاهرة مدينة نصر'}).first().click().catch(()=>{});await click('راجع التكلفة');await p.waitForTimeout(2000);await p.evaluate(()=>{window.scrollTo(0,0);document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0})});await snap('13-checkout','إتمام الطلب');
await click('متابعة ‹');await p.waitForTimeout(1000);await snap('14-payment','طريقة الدفع');
await click('مراجعة الطلب وتأكيده ‹');await p.waitForTimeout(3000);await snap('15-placed','تم استلام طلبك');
await click('تتبع الطلب 🚚');await p.waitForTimeout(1500);await snap('17-track','تتبع الطلب');await click('رجوع');await p.waitForTimeout(600);await click('الرئيسية');await click('طلباتي');await p.waitForTimeout(1500);await snap('16-orders','عرض التفاصيل');
await click('حسابي');await click('المساعدة');await p.waitForTimeout(1200);await snap('18-support','المساعدة');
await b.close();
