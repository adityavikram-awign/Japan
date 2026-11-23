# Awign — Japan onboarding site

Japanese-first (JA / EN) training and onboarding page for the household egocentric video programme in Japan. Built from the LATAM site (same structure, design and scripts).

Static HTML/CSS/JS. No build step. Deploy as its own Vercel project so the LATAM site stays untouched.

## What changed from LATAM

- Languages: Japanese (default) and English. Portuguese and Spanish removed.
- WhatsApp replaced by a LINE Official Account button (green LINE button).
- Japan copy: household tasks only, privacy rules for homes (family, mail, nameplates), head mount reimbursed after 20 approved hours, tax FAQ.
- Privacy and Terms rewritten for Japan (JA + EN). Need a legal review before going public.
- Font: Noto Sans JP added.

## Set

- `ORG_CODE`: `4P2F6RJE` (Minute organization code).
- `COMMUNITY_URL`: LINE Official Account `https://line.me/R/ti/p/@775evhxu`. Shown as a green "LINEに参加 / Join LINE" button in the top bar (left of the language toggle) and as the LINE buttons on the page and in the footer.

## "Coming soon" (準備中) — fill these in `i18n.js` → `CONFIG`

| Key | What to put | Until then the page shows |
|---|---|---|
| `PAY_ACCOUNTS` | Payout options, e.g. `[{ name: "銀行振込", preferred: true }]` | お支払い方法：準備中 |
| `SOCIAL` | Instagram / X links for the Japan account | Icons hidden |

Also still marked 準備中 in the copy (`ja` / `en` blocks): hourly rate, minimum payout, head-mount reimbursement cap, Japanese versions of the two main videos. Search `準備中` and `coming soon` to find them.

## Videos

Same files as LATAM. The hero and Minute walkthrough use the English recordings until Japanese-subtitled versions exist; swap paths in `CONFIG.VIDEO`.

## Local

```bash
npx serve .
```
