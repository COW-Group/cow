# PWA Icons Required

The products-site is now configured as a Progressive Web App (PWA). To complete the setup, you need to create icon files in the following sizes:

## Icon Sizes Needed

Create a `src/icons/` directory and add the following icon files:

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels (Microsoft Tile)
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels (Android)
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels (Android splash screen)

## Design Guidelines

- **Theme**: Use the MyCOW brand colors (Deep Cyan #0066FF)
- **Icon Style**: Should match the Sumi-e Sky + Earth aesthetic
- **Content**: Could feature the cow/moo mascot or COW branding
- **Format**: PNG with transparency
- **Purpose**: Icons should work both as app icons and maskable icons (safe zone in center)

## Quick Generation Option

You can use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) to generate all sizes from a single source image:

```bash
npx pwa-asset-generator source-icon.png src/icons --background "#0066FF" --index src/index.html
```

## Webpack Configuration

The webpack config is already set up to copy these icons from `src/icons/` to the build output.

## Testing PWA

After adding icons:

1. Build the app: `npm run build`
2. Serve the build: `npx serve -s dist -l 4201`
3. Open Chrome DevTools > Application > Manifest to verify
4. Check "Add to Home Screen" functionality on mobile/desktop

## Files Already Created

✅ `src/manifest.json` - Web app manifest
✅ `src/service-worker.js` - Service worker for offline support
✅ `src/serviceWorkerRegistration.ts` - SW registration utility
✅ `src/index.html` - Updated with PWA meta tags
✅ `src/main.tsx` - Service worker registration added
✅ `webpack.config.js` - Copy plugin configured
