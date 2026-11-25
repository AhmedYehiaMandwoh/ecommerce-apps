# RN localization (Arabic / English)

Status: partial. Arabic is the source language and the default.

- `src/i18n.ts`: `t('نص عربي', arg0)` with `{0}` placeholders, `cx()` mirrors direction-bound Tailwind classes for LTR, direction constants for StyleSheet values. The language is read synchronously at import (web: localStorage `ghiyar-lang`; native: SecureStore).
- `src/locale-en.json`: English text for every Arabic key. A missing key falls back to the Arabic text.
- Language switch: Account, then App settings. Web reloads at once; native applies after the app is reopened (labels and styles are fixed at import).
- Category values sent to the API stay Arabic (they are data); only the displayed label is translated.
- User-entered content (shop and product names, descriptions) is shown as authored.

Known gaps: API error text is English only (no Arabic table in the app yet), some rows are mirrored by a rule (flex-row + justify-between) and have not been reviewed screen by screen, only home, shops, account, settings, search, cart and checkout were captured in English, the Arabic key for statuses and top-level labels needs an app restart on native.

Checks: `npx tsc --noEmit`; `node scripts/en-check.mjs`, `node scripts/en-flow.mjs` (English), `node scripts/capture-matched.mjs` (Arabic, 18 screens). After editing source, restart Expo with `--clear`: Metro can serve stale modules.

## Direction model (important)
The layouts were authored visually: Arabic rows use explicit `flex-row-reverse`/`ROW` and the layout root is LTR. `document.documentElement.dir` is `rtl` for Arabic and `ltr` for English (accessibility, `lang`), but `#root{direction:ltr}` is injected so flex rows are not flipped a second time (an earlier build flipped every Arabic row: fixed). In Arabic, `input, textarea` get `direction:rtl` and `[dir=auto]` text gets `unicode-bidi:plaintext`. English mirrors rows with `cx()` (flex-row swapped to flex-row-reverse except h-10/12/14 headers, which stay). Component-specific rows that must differ use `ROW` explicitly (shops card). Unverified: native (iOS/Android) behaviour, and mixed Arabic/English input typing on native.
