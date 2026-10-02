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

The Configurator uses the existing React/TypeScript and CSS conventions. All interface text is English; original release notes open on GitHub.

| Route | Component | Workflow / firmware source |
| --- | --- | --- |
| `/configurator` | `ConfiguratorPage` | Device hub; no firmware requests |
| `/configurator/fc` | `FcConfiguratorPage` | Channel/version selection, `.px4` download, QGroundControl guidance; PX4-Autopilot releases |
| `/configurator/controller` | `ControllerConfiguratorPage` | Handheld AEGIS TX selection, ZIP download, verified USB installer; Aegis-TX releases |
| `/configurator/tx-module` | `PlannedModulePage` | Planned; no configuration or installer |
| `/configurator/rx-module` | `PlannedModulePage` | Planned; no configuration or installer |

- Device pages live in `src/pages/configurator/`. `DevicePage` supplies the breadcrumb and page header. `FirmwareSelection` shares channel/version selection, loading/retry/empty states and release metadata only. Device pages own their actions and guidance. `ControllerInstaller` preserves the ESP Web Tools workflow and its progress/result dialog.
- `src/lib/firmwareSources.ts` explicitly maps each implemented device to its source. Each mounted device page has independent release state; no global firmware state or device registry.
- `src/lib/firmware.ts` reads the catalog and verifies firmware before installation. The publisher's historical `tx` key maps to internal `controller` here, not to the future RF `tx-module`.
- `scripts/copy-flasher.mjs` copies the pinned official browser bundle and licenses into generated `public/esp-web-tools/` during dev/build. No runtime CDN.
- Firmware build/release stays in firmware repositories. Both current sources consume `https://vinhphannn.github.io/Aegis-TX/catalog.json`: `fc` contains PX4-Autopilot firmware, `tx` contains Aegis-TX controller firmware. TX CI publishes this catalog, manifests and binaries. No website deploy is needed for a new firmware release. Change `FIRMWARE_BASE_URL` if the catalog location moves; a different host must allow CORS.

The installer verifies SHA-256 before enabling USB. The user confirms TX hardware and beta status. Leave **Erase device** off to preserve data with the current partition layout; no automatic calibration backup or full post-flash readback is provided. FC browser flashing is not implemented. Test actual flashing and data retention on hardware before calling a release stable.

## Validation and deployment

```bash
npm ci
npm run build
npx playwright install chromium
npm test
```

Browser tests use mock release data and never open a real USB port. They cover all five routes (direct access and refresh), hub navigation, back/forward, independent device selection, stable/beta releases, downloads, future module states, checksum failures, hardware confirmation and cancellation on navigation. Real USB flashing, progress/completion on hardware and data retention require a device test. CI uses Node from `.nvmrc` and runs build/tests on PRs; only `main` deploys.

GitHub Pages has no SPA rewrites. `scripts/route-entries.mjs` copies the built entry HTML to existing route directories so direct links and refresh work; add a path there when adding a public route. The 3D home page is loaded only when visited, keeping it out of Configurator's initial download.
