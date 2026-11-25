// Captures screens 13 (checkout) and 15 (placed) at 390x727 from scrollTop 0 with route assertions.
import { chromium } from '@playwright/test';
const O=process.env.OUT||'/tmp/shots-cf';import fs from 'fs';fs.mkdirSync(O,{recursive:true});
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:390,height:727}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
const btn=(t,o={})=>p.getByRole('button',{name:t,...o}).first();const tab=async(n)=>{for(let i=0;i<5&&!(await btn(n,{exact:true}).count());i++){await click('رجوع');await p.waitForTimeout(500);}await click(n);};
const click=async(t,o)=>{await btn(t,o).click({timeout:8000})};
await p.goto(process.env.APP_URL,{waitUntil:'networkidle',timeout:110000});await p.waitForTimeout(3000);
await click('تسجيل الدخول');await p.getByLabel('رقم الموبايل').fill(process.env.PHONE||'01542930599');await click('إرسال رمز التحقق ‹');
await p.getByLabel('كود التحقق').first().waitFor({timeout:25000});if(await p.getByLabel('الاسم').count())await p.getByLabel('الاسم').first().fill('مستخدم تجريبي');await p.getByLabel('كود التحقق').first().fill('123456');await click('تأكيد الكود ‹');await p.waitForTimeout(2500);
await click('فرامل');await p.waitForTimeout(1500);
await p.locator('[role=button][aria-label="مجموعة ديسك وفرامل توضيحية"]').first().click();await p.waitForTimeout(1200);await click('أضف للسلة 🛒');await p.waitForTimeout(1200);
await tab('الرئيسية');await click('السلة');await p.waitForTimeout(800);await click('متابعة الطلب');await p.waitForTimeout(1800);
await p.getByText('اختر عنوان التوصيل').first().click();await p.waitForTimeout(1200);const addrBtn=p.locator('[role=button]').filter({hasText:'القاهرة'}).first();if(await addrBtn.count())await addrBtn.click();await p.waitForTimeout(1200);if(await p.getByText('إضافة عنوان جديد').count()){await click('رجوع');await p.waitForTimeout(1200);}
// scroll position 0 assertion
const info=await p.evaluate(()=>{const sc=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+4&&getComputedStyle(e).overflowY!=='visible'&&e.clientHeight>300);const t=[...document.querySelectorAll('[role=button]')].find(e=>/راجع التكلفة|متابعة/.test(e.getAttribute('aria-label')||''));const r=t&&t.getBoundingClientRect();return {scrollTops:sc.map(e=>e.scrollTop),cta:r&&{top:Math.round(r.top),bottom:Math.round(r.bottom)},vh:innerHeight}});
console.log('13 at scroll0',JSON.stringify(info));await p.screenshot({path:O+'/13-checkout.png'});
await p.screenshot({path:O+'/13-checkout-areas-open.png'});await p.locator('[role=button]').filter({hasText:'مدينة نصر'}).first().click();await p.waitForTimeout(1200);{const r=await p.evaluate(()=>{const t=[...document.querySelectorAll('[role=button]')].find(e=>/راجع التكلفة/.test(e.getAttribute('aria-label')||''));const b=t&&t.getBoundingClientRect();return b&&Math.round(b.bottom)});console.log('13 area selected CTA bottom',r)}await p.screenshot({path:O+'/13-area-selected.png'});await click('راجع التكلفة');await p.waitForTimeout(1800);await p.screenshot({path:O+'/13-checkout-reviewed.png'});
await click('متابعة ‹');await p.waitForTimeout(1200);await click('مراجعة الطلب وتأكيده ‹');await p.waitForTimeout(3000);
const ok=await p.getByText('تم استلام طلبك').count();console.log('route placed',ok>0);await p.screenshot({path:O+'/15-placed.png'});
console.log('errors',errs.length);await b.close();process.exit(ok>0&&!errs.length?0:1);
