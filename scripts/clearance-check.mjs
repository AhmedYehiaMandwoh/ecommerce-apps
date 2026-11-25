// Verifies that, scrolled to the end, the last action on a screen sits fully above the bottom navigation.
import { chromium } from '@playwright/test';
import fs from 'fs';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:390,height:727}});
const APP=process.env.APP_URL||'http://127.0.0.1:8082';const O=(process.env.OUT||'./shots-clear')+'/';fs.mkdirSync(O,{recursive:true});
const phoneNo='01'+String(Date.now()).slice(-9);const click=async(t)=>{await p.getByRole('button',{name:t}).first().click({timeout:8000})};
const res=[];
const check=async(name,targetLabel)=>{await p.waitForTimeout(1000);
 const r=await p.evaluate((label)=>{let sc=null;document.querySelectorAll('*').forEach(e=>{if(e.scrollHeight>e.clientHeight+4&&getComputedStyle(e).overflowY!=='visible'&&e.clientHeight>300&&(!sc||e.clientHeight<sc.clientHeight))sc=e});
  if(sc)sc.scrollTop=sc.scrollHeight;const s=sc?sc.getBoundingClientRect():{bottom:innerHeight};
  const t=[...document.querySelectorAll('[role=button]')].filter(e=>(e.getAttribute('aria-label')||e.textContent||'').includes(label)).pop();
  const tr=t?t.getBoundingClientRect():null;return {scrollerBottom:s.bottom,targetBottom:tr&&tr.bottom,targetTop:tr&&tr.top,scrolled:!!sc}},targetLabel);
 await p.waitForTimeout(300);await p.screenshot({path:O+name+'.png'});
 const ok=r.targetBottom!=null&&r.targetBottom<=r.scrollerBottom+0.5&&r.targetTop>=0;res.push({name,ok,...r});console.log(name,ok?'CLEAR':'COVERED',JSON.stringify(r));};
await p.goto(APP,{waitUntil:'networkidle',timeout:110000});await p.waitForTimeout(3000);
await click('تسجيل الدخول');await p.getByLabel('رقم الموبايل').fill(phoneNo);await click('إرسال رمز التحقق ‹');await p.waitForTimeout(1500);
if(await p.getByLabel('الاسم').count())await p.getByLabel('الاسم').first().fill('مستخدم تجريبي');await p.getByLabel('كود التحقق').first().fill('123456');await click('تأكيد الكود ‹');await p.waitForTimeout(6000);
await click('اختر عربيتك');await p.waitForTimeout(900);await check('04-empty','حفظ العربية');
await click('اختر الماركة');await click('Toyota');await click('اختر الموديل');await click('Corolla');await click('اختر سنة الصنع');await click('2020');await click('اختر المحرك');await click('1.6L');await check('04-filled','حفظ العربية');
await click('الرئيسية');await click('فرامل');await p.waitForTimeout(1500);await check('08-search-brakes','أضف');
{const adds=p.locator('[role=button][aria-label^="أضف تيل فرامل"]');const n=await adds.count();await adds.nth(n-1).click({timeout:8000});await p.waitForTimeout(1200);await click('الرئيسية');await click('السلة');await p.waitForTimeout(1200);const inCart=await p.getByText('تيل فرامل أمامي').count();console.log('08 last-row add clicked, rows',n,'cart entries for pad',inCart);res.push({name:'08-add-works',ok:inCart>0});await click('رجوع');await p.waitForTimeout(800);}
await click('حسابي');await click('عناويني');await p.waitForTimeout(900);await check('05-addresses','إضافة عنوان جديد');
await click('إضافة عنوان جديد');await p.waitForTimeout(900);await check('06-add-address','حفظ العنوان');
await click('حسابي');await click('المساعدة');await p.waitForTimeout(900);await check('18-support','إرسال الطلب');
const bad=res.filter(r=>!r.ok);console.log(bad.length?'FAIL '+bad.map(r=>r.name).join(','):'ALL CLEAR');await b.close();process.exit(bad.length?1:0);
