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
await p.getByRole('button', { name: /^Add / }).first().click().catch((e) => console.log('add failed')); await p.waitForTimeout(800);
await click('Home'); await click('Cart'); await p.waitForTimeout(1000); await snap('e2-cart');
await click('Continue to checkout'); await p.waitForTimeout(1200); await snap('e3-checkout');
await b.close();
