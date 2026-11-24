import { chromium } from '@playwright/test';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:430,height:900}});
const errs=[];const phoneNo='01'+String(Date.now()).slice(-9);p.on('pageerror',e=>errs.push(e.message.slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text().slice(0,160))});
p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url().slice(0,80))});
const snap=async n=>{await p.waitForTimeout(1200);await p.screenshot({path:`${process.env.OUT||'/tmp/shots'}/${n}.png`,fullPage:true});console.log('shot',n);const nb=await p.evaluate(()=>[...document.querySelectorAll('[role=button] [role=button], button button')].map(e=>(e.getAttribute('aria-label')||e.textContent||'').slice(0,40)));if(nb.length){errs.push('nested interactive on '+n+': '+nb.join('|'))}};
const btn=(t,o={})=>p.getByRole('button',{name:t,...o}).first();
const click=async(t,o)=>{await btn(t,o).click({timeout:8000})};
await p.goto((process.env.APP_URL||'http://127.0.0.1:8081'),{waitUntil:'networkidle',timeout:110000});await p.waitForTimeout(3000);
const tab=async(n)=>{for(let i=0;i<5&&!(await btn(n,{exact:true}).count());i++){await click('رجوع');await p.waitForTimeout(500);}await click(n);};
await snap('01-splash');
await click('تسجيل الدخول');
await p.getByLabel('رقم الموبايل').fill(phoneNo);await click('إرسال رمز التحقق ‹');await p.waitForTimeout(1500);
if(await p.getByLabel('الاسم').count())await p.getByLabel('الاسم').first().fill('مستخدم تجريبي');await p.getByLabel('كود التحقق').first().fill('123456');await click('تأكيد الكود ‹');await p.waitForTimeout(2500);await snap('07-home');
await click('فرامل');await p.waitForTimeout(1500);await snap('08-search');
await btn('',{exact:false}).count();
await p.locator('[role=button][aria-label="مجموعة ديسك وفرامل توضيحية"]').first().click();await p.waitForTimeout(1200);await snap('11-product');
await click('أضف للسلة 🛒');await p.waitForTimeout(1200);await snap('12-cart');
await tab('المحلات');await snap('09-shops');
await p.locator('[role=button]').filter({hasText:'قطع غيار وصيانة'}).first().click();await p.waitForTimeout(1500);await snap('10-shop');
{const hit=await p.evaluate(()=>[...document.querySelectorAll('[role=button][aria-label^="أضف "]')].map(e=>{e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();const t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {l:e.getAttribute('aria-label'),ok:!!t&&e.contains(t)}}));if(!hit.length)errs.push('shop page has no add buttons');for(const h of hit)if(!h.ok)errs.push('shop add button covered by card overlay: '+h.l);console.log('shop add-button hit-target check',hit.length,'buttons',hit.every(h=>h.ok)?'ok':'COVERED');}
await click('حسابي');await click('عناويني');await p.waitForTimeout(1000);await snap('05-addresses-empty');
await click('إضافة عنوان جديد');await p.getByLabel('المدينة').fill('القاهرة');await p.getByLabel('المنطقة').fill('مدينة نصر');await p.getByLabel('الشارع').fill('شارع 9');await p.getByLabel('تفاصيل العنوان').fill('عمارة 5 شقة 3');await p.getByLabel('رقم التواصل').fill(phoneNo);await snap('06-add-address');
await click('حفظ العنوان');await p.waitForTimeout(2000);await snap('05-addresses');
await p.getByLabel(/^خيارات عنوان/).first().click();await p.getByLabel(/^حذف عنوان/).first().click();await p.waitForTimeout(1500);
{const gone=await p.getByText('لسه مفيش عناوين').count();console.log('address delete via kebab removes it',gone>0);if(!gone)errs.push('address delete via kebab failed');}
await click('إضافة عنوان جديد');await p.getByLabel('المدينة').fill('القاهرة');await p.getByLabel('المنطقة').fill('مدينة نصر');await p.getByLabel('الشارع').fill('شارع 9');await p.getByLabel('تفاصيل العنوان').fill('عمارة 5 شقة 3');await p.getByLabel('رقم التواصل').fill(phoneNo);await snap('06-add-address');
await click('حفظ العنوان');await p.waitForTimeout(2000);await snap('05-addresses');
await click('الرئيسية');await click('السلة');await p.waitForTimeout(800);await click('متابعة الطلب');await p.waitForTimeout(1500);
await p.locator('[role=button]').filter({hasText:'مدينة نصر'}).first().click();await click('أضف كود خصم');await p.getByPlaceholder('أدخل كود الخصم').fill('ghiyar10');await click('راجع التكلفة');await p.waitForTimeout(2000);await snap('13-checkout');if(!(await p.getByText('خصم (GHIYAR10)').count()))errs.push('discount line missing on checkout');
await click('متابعة ‹');await p.waitForTimeout(1000);await snap('14-payment');
await click('مراجعة الطلب وتأكيده ‹');await p.waitForTimeout(3000);await snap('15-placed');
await click('تتبع الطلب');await p.waitForTimeout(1500);await snap('17-track');
await click('رجوع');await p.waitForTimeout(600);await click('الرئيسية');await click('طلباتي');await p.waitForTimeout(1500);await snap('16-orders');
await click('الرئيسية');await click('اختر عربيتك');await p.waitForTimeout(800);if(await p.getByRole('button',{name:'اختر الماركة'}).count()){await click('اختر الماركة');await click('Toyota');await click('اختر الموديل');await click('Corolla');await click('اختر سنة الصنع');await click('2020');await click('اختر المحرك');await click('1.6L');await snap('04-vehicle')}else{await snap('04-vehicle-fail');errs.push('vehicle selectors not shown')};await click('حسابي');await click('المساعدة');await snap('18-support');
// Support ticket with a real image attachment through the UI (file chooser -> preview -> send -> shown on ticket).
{const msg='اختبار مرفق صورة '+Date.now();await p.getByPlaceholder('اكتب رسالتك هنا...').fill(msg);
 const [fc]=await Promise.all([p.waitForEvent('filechooser',{timeout:10000}),click('أضف صورة')]);await fc.setFiles(new URL('../assets/braking-parts.png',import.meta.url).pathname);await p.waitForTimeout(800);
 if(!(await p.getByText('تم اختيار صورة').count()))errs.push('support image not selected');
 await snap('18-support-image-selected');await click('إرسال الطلب');await p.waitForTimeout(1500);
 const shown=await p.getByText(msg).count();const imgs=await p.evaluate(m=>{const t=[...document.querySelectorAll('div')].filter(d=>d.textContent&&d.textContent.includes(m)&&d.querySelector('img'));return t.length},msg);
 if(!shown)errs.push('support ticket not shown after send');else if(!imgs)errs.push('support ticket shows no attachment image');
 await snap('18-support-image-sent');console.log('support image ticket shown',shown>0,'with image',imgs>0);}

await b.close();
if(errs.length){console.log('FAIL browser errors:',errs.slice(0,8));process.exit(1)}
console.log('PASS mobile customer flow (phone login, browse, product, cart, address, checkout, cash payment, order placed, tracking, orders, support). No browser errors.');
