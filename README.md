# Ghiyar customer app

Independent React Native/Expo customer source. No APK requested or supplied.

1. pnpm install
2. cp .env.example .env
3. Set EXPO_PUBLIC_API_URL and EXPO_PUBLIC_ASSET_URL to the running dashboard repository API/web. Use reachable LAN endpoints for a physical device, not localhost. No secrets belong in public variables.
4. pnpm check
5. pnpm web (browser) or pnpm start (Expo)

The dashboard repository contains NestJS/MySQL migrations, local database setup, server configuration and test seed. Phone static-test code is123456 only when enabled on the development API. Never use real customer data. Twilio is blank/disabled.

Native biometric/passcode-protected session storage is opt-in and requires a real development build and physical-device acceptance. Expo Go does not prove FaceID support. Native project files are generated from app.json/plugins with npx expo prebuild when needed. No production signing credentials are included.

## Status

Customer-only app (screens 01-18 of the reference PDF): phone login with static test OTP, browse, vehicle dropdowns from the API, product, cart with discount code, address, cash-on-delivery test checkout (the card row is disabled and labelled "قريبًا"), tracking (the map illustration is static art and labelled as such), orders and support with an image attachment. Merchant and admin screens are in the dashboard repository's web app, not here.

Test: start the API and web from the dashboard repository on a freshly seeded database, run the app with `pnpm web`, then `DEMO_PASSWORD=... CHROME_PATH=... node scripts/mobile-test.mjs`. It checks the browser build only. Native device behaviour is not verified. Layout follows the PDF by eye, not pixel-exact.
