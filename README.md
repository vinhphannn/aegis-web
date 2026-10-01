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
