// English RN flow captures: home, search, product, cart, checkout. 390x727.
import { chromium } from '@playwright/test'; import fs from 'fs';
const APP = process.env.APP_URL || 'http://127.0.0.1:8082'; const O = (process.env.OUT || '/tmp/shots-enf') + '/'; fs.mkdirSync(O, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 390, height: 727 } });
const click = async (t) => { await p.getByRole('button', { name: t }).first().click({ timeout: 8000 }); };
const snap = async (n) => { await p.waitForTimeout(1200); await p.screenshot({ path: O + n + '.png' }); console.log('shot', n); };
await p.addInitScript(() => localStorage.setItem('ghiyar-lang', 'en'));
await p.goto(APP, { waitUntil: 'networkidle', timeout: 110000 }); await p.waitForTimeout(3000);
await click('Sign in'); await p.getByLabel('Mobile number').fill('01' + String(Date.now()).slice(-9)); await click('Send the verification code ›'); await p.waitForTimeout(1500);
if (await p.getByLabel('Name', { exact: true }).count()) await p.getByLabel('Name', { exact: true }).first().fill('Test User');
await p.getByLabel('Verification code').first().fill('123456'); await click('Confirm the code ›'); await p.waitForTimeout(4500);
await click('Brakes'); await p.waitForTimeout(1500); await snap('e1-search');
await p.getByText('تيل فرامل أمامي').first().click().catch(()=>{}); await p.waitForTimeout(2000); await snap('f1-product');
await p.getByRole('button',{name:'My orders'}).count()||await p.getByText('‹').first().click().catch(()=>{});
await click('My orders'); await p.waitForTimeout(1500); await snap('f2-orders');
await click('My account'); await p.waitForTimeout(1200); await snap('f3-account');
for (const [n,l] of [['f4','Support'],['f5','Addresses'],['f6','Vehicle']]) { const el = p.getByText(new RegExp(l,'i')).first(); if (await el.count()) { await el.click().catch(()=>{}); await p.waitForTimeout(1500); await snap(n); await click('My account').catch(()=>{}); } else console.log('none', l); }
await b.close();
