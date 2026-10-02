// GitHub Pages serves files, not SPA rewrites. Reuse the Vite entry for existing routes.
// Add a path here when adding a public route to App.tsx.
import { copyFile, mkdir } from 'node:fs/promises'
const routes = ['products', 'products/aegis-fc', 'products/aegis-tx', 'configurator', 'configurator/fc', 'configurator/controller', 'configurator/tx-module', 'configurator/rx-module', 'docs', 'docs/aegis-fc', 'docs/aegis-tx', 'about']
for (const route of routes) {
  await mkdir(`dist/${route}`, { recursive: true })
  await copyFile('dist/index.html', `dist/${route}/index.html`)
}
await copyFile('dist/index.html', 'dist/404.html')
