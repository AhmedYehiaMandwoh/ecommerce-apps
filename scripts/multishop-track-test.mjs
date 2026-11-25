import { chromium } from '@playwright/test';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:390,height:727}});
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
{const adds=p.locator('[role=button][aria-label^="أضف تيل فرامل"]');const n=await adds.count();console.log('pad rows',n);await adds.nth(0).click({timeout:8000});await p.waitForTimeout(800);await adds.nth(1).click({timeout:8000});await p.waitForTimeout(800);}
await p.waitForTimeout(500);
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
await click('مراجعة الطلب وتأكيده ‹');await p.waitForTimeout(3000);await snap('15-placed');const placedTxt=await p.locator('text=رقم الطلب').first().innerText();
await click('تتبع الطلب');await p.waitForTimeout(1500);await snap('17-track');await p.screenshot({path:(process.env.OUT||'/tmp/shots')+'/track-first.png'});const trackTxt=await p.locator('text=/#[0-9a-f]{8}/').first().innerText();const pid=(placedTxt.match(/[0-9a-f]{8}/g)||[]);console.log('PLACED ORDERS',pid.length);if(pid.length<2)throw new Error('multi-shop checkout did not create 2 orders');console.log('placed ids',pid.join(','),'track text',trackTxt);if(!pid.some(x=>trackTxt.includes(x)))throw new Error('tracking opened a different order than the placed one');
const first=trackTxt.match(/[0-9a-f]{8}/)[0];await click('رجوع');await p.waitForTimeout(800);await p.screenshot({path:'/tmp/shots-ms/after-back.png'});console.log('labels',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[role=button]')].map(e=>(e.getAttribute('aria-label')||'').slice(0,30)))));const groups=p.getByRole('button',{name:/^تتبع طلب /});console.log('shop cards',await groups.count());await groups.nth(1).click();await p.waitForTimeout(1500);const t2=await p.locator('text=/#[0-9a-f]{8}/').first().innerText();console.log('second shop card tracks',t2);const id2=t2.match(/[0-9a-f]{8}/)[0];if(id2===first||!pid.includes(id2))throw new Error('second shop card did not track the second order');await p.screenshot({path:(process.env.OUT||'/tmp/shots')+'/track-second.png'});const fs=await import('fs');const h=f=>fs.readFileSync((process.env.OUT||'/tmp/shots')+'/'+f).toString('base64').length+':'+fs.readFileSync((process.env.OUT||'/tmp/shots')+'/'+f).subarray(2000,2400).toString('hex').slice(0,40);if(h('track-first.png')===h('track-second.png'))throw new Error('first and second tracking captures identical');console.log('first',first,'second',id2,'captures differ');
console.log('errors',errs.length,errs.slice(0,3).join('|'));await b.close();process.exit(errs.length?1:0);
