# AEGIS Web

Official hub and configurator web application for the AEGIS UAV hardware/software ecosystem (AEGIS FC, TX, RX, NAV, VISION).

## Stack

- **Framework**: React 19 + TypeScript (Strict)
- **Build Tool**: Vite
- **3D Graphics Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Styling**: Vanilla CSS

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

To override the base path when deploying to a custom domain:

```bash
VITE_BASE_PATH='/' npm run build
```

## Configurator

`/configurator` uses the same React/TypeScript and CSS conventions as the rest of the site. It supports TX firmware selection and USB installation through ESP Web Tools, plus FC firmware downloads for QGroundControl. All interface text is English; original release notes open on GitHub.

- `src/pages/ConfiguratorPage.tsx`: selection, confirmations and installer UI.
- `src/lib/firmware.ts`: reads the catalog and verifies firmware before installation.
- `scripts/copy-flasher.mjs`: copies the pinned official browser bundle and licenses into generated `public/esp-web-tools/` during dev/build. No runtime CDN.
- Firmware remains at `https://vinhphannn.github.io/Aegis-TX/`. TX CI publishes `catalog.json`, manifests and binaries after each release. No website deploy is needed when a firmware version is released. Change `FIRMWARE_BASE_URL` if this location moves; a different host must allow CORS.

The installer verifies SHA-256 before enabling USB. The user confirms TX hardware and beta status. Leave **Erase device** off to preserve data with the current partition layout; no automatic calibration backup or full post-flash readback is provided. FC browser flashing is not implemented. Test actual flashing and data retention on hardware before calling a release stable.

## Validation and deployment

```bash
npm ci
npm run build
npx playwright install chromium
npm test
```

Browser tests use mock release data and never open a real USB port. They cover checksum failures, hardware confirmation, selection changes, failed downloads and direct route access. CI uses Node from `.nvmrc` and runs build/tests on PRs; only `main` deploys.

GitHub Pages has no SPA rewrites. `scripts/route-entries.mjs` copies the built entry HTML to existing route directories so direct links and refresh work; add a path there when adding a public route. The 3D home page is loaded only when visited, keeping it out of Configurator's initial download.
