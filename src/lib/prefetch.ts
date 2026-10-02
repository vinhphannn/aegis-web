import { lazy } from 'react'

// Single source of truth for lazy route loaders and route prefetching.
const loaders = {
  home: () => import('../pages/HomePage').then(m => ({ default: m.HomePage })),
  products: () => import('../pages/ProductsPage').then(m => ({ default: m.ProductsPage })),
  aegisFcProduct: () => import('../pages/AegisFcPage').then(m => ({ default: m.AegisFcPage })),
  aegisTxProduct: () => import('../pages/AegisTxPage').then(m => ({ default: m.AegisTxPage })),
  configurator: () => import('../pages/ConfiguratorPage').then(m => ({ default: m.ConfiguratorPage })),
  fcConfigurator: () => import('../pages/configurator/FcConfiguratorPage').then(m => ({ default: m.FcConfiguratorPage })),
  controllerConfigurator: () => import('../pages/configurator/ControllerConfiguratorPage').then(m => ({ default: m.ControllerConfiguratorPage })),
  plannedModule: () => import('../pages/configurator/PlannedModulePage').then(m => ({ default: m.PlannedModulePage })),
  docs: () => import('../pages/DocsPage').then(m => ({ default: m.DocsPage })),
  aegisFcDocs: () => import('../pages/AegisFcDocsPage').then(m => ({ default: m.AegisFcDocsPage })),
  aegisTxDocs: () => import('../pages/AegisTxDocsPage').then(m => ({ default: m.AegisTxDocsPage })),
  about: () => import('../pages/AboutPage').then(m => ({ default: m.AboutPage })),
}

// Lazy components for React Router
export const HomePage = lazy(loaders.home)
export const ProductsPage = lazy(loaders.products)
export const AegisFcPage = lazy(loaders.aegisFcProduct)
export const AegisTxPage = lazy(loaders.aegisTxProduct)
export const ConfiguratorPage = lazy(loaders.configurator)
export const FcConfiguratorPage = lazy(loaders.fcConfigurator)
export const ControllerConfiguratorPage = lazy(loaders.controllerConfigurator)
export const PlannedModulePage = lazy(loaders.plannedModule)
export const DocsPage = lazy(loaders.docs)
export const AegisFcDocsPage = lazy(loaders.aegisFcDocs)
export const AegisTxDocsPage = lazy(loaders.aegisTxDocs)
export const AboutPage = lazy(loaders.about)

const loadedRoutes = new Set<string>()

export function prefetchPath(path: string) {
  let loader: (() => Promise<unknown>) | undefined

  if (path === '/') loader = loaders.home
  else if (path === '/products') loader = loaders.products
  else if (path === '/products/aegis-fc') loader = loaders.aegisFcProduct
  else if (path === '/products/aegis-tx') loader = loaders.aegisTxProduct
  else if (path === '/configurator') loader = loaders.configurator
  else if (path === '/configurator/fc') loader = loaders.fcConfigurator
  else if (path === '/configurator/controller') loader = loaders.controllerConfigurator
  else if (path.startsWith('/configurator/')) loader = loaders.plannedModule
  else if (path === '/docs') loader = loaders.docs
  else if (path === '/docs/aegis-fc') loader = loaders.aegisFcDocs
  else if (path === '/docs/aegis-tx') loader = loaders.aegisTxDocs
  else if (path === '/about') loader = loaders.about

  if (loader && !loadedRoutes.has(path)) {
    loadedRoutes.add(path)
    loader().catch(() => loadedRoutes.delete(path))
  }
}

export function scheduleIdlePrefetch(currentPath: string) {
  if (typeof window === 'undefined') return

  // Respect Save-Data preference
  const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return

  const runIdle = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1500))

  runIdle(() => {
    // Prefetch lightweight routes only. EXCLUDE heavy Home 3D chunk when on non-Home pages.
    const lightweightRoutes = ['/products', '/configurator', '/docs', '/about']
    for (const route of lightweightRoutes) {
      if (route !== currentPath) {
        prefetchPath(route)
      }
    }
  })
}
