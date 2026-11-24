# App acceptance

This standalone source passed its own npm ci, TypeScript and Expo Web export, then connected browser tests with the separately installed dashboard/API. No APK or physical-device proof is supplied. Native protected-session opt-in and biometric/device-passcode code requires a development build and physical-device acceptance. Expo Go does not prove FaceID. No secrets are compiled into the client.

Backend must be started from ecommerce-dashboard. Use .env.example public endpoints. Static-test code123456 is only a local server test setting, never real phone ownership. Full backend/operational caveats are in dashboard docs/HANDOVER.md.
