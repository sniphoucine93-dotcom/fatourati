# Fatourati

A lightweight multilingual invoice maker built with HTML, CSS and JavaScript, ready to be wrapped with Capacitor for Android.

## Current features
- Arabic, French and English interface
- DZD, EUR, USD, MAD, SAR, TND, LYD and MRU currencies
- Seller and customer details
- Multiple invoice items with automatic calculations
- Optional discount and tax percentage
- Save and reopen invoices locally on the device
- Export and restore invoice backups as JSON files
- Print invoices or save as PDF using the device/browser print dialog
- Responsive layout for mobile and desktop

## Run locally
Serve the project root with any static web server and open `www/index.html`.

## Android
1. Install Node.js and Android Studio.
2. Run `npm install`.
3. Run `npx cap add android` (only once).
4. Run `npm run cap:sync`.
5. Open Android Studio with `npm run cap:open` and build the APK.

## Privacy
Invoice data is stored in the browser's local storage on the current device. It is not synced or backed up to a server. Clearing app data/browser storage can erase saved invoices. Export or back up important invoices separately.

## Important
This is the first working MVP. AdMob is intentionally not enabled yet; advertising should be added only after consent, privacy disclosures and store compliance are prepared.
