import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProductsPage } from './pages/ProductsPage'
import { AegisFcPage } from './pages/AegisFcPage'
import { AegisTxPage } from './pages/AegisTxPage'
import { ControllerConfiguratorPage } from './pages/configurator/ControllerConfiguratorPage'
import { FcConfiguratorPage } from './pages/configurator/FcConfiguratorPage'
import { PlannedModulePage } from './pages/configurator/PlannedModulePage'
import { ConfiguratorPage } from './pages/ConfiguratorPage'
import { DocsPage } from './pages/DocsPage'
import { AegisFcDocsPage } from './pages/AegisFcDocsPage'
import { AegisTxDocsPage } from './pages/AegisTxDocsPage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })))

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Suspense fallback={<div className="page-container">Loading…</div>}><HomePage /></Suspense>} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/aegis-fc" element={<AegisFcPage />} />
          <Route path="products/aegis-tx" element={<AegisTxPage />} />
          <Route path="configurator" element={<ConfiguratorPage />} />
          <Route path="configurator/fc" element={<FcConfiguratorPage />} />
          <Route path="configurator/controller" element={<ControllerConfiguratorPage />} />
          <Route path="configurator/tx-module" element={<PlannedModulePage name="AEGIS TX Module" path="tx-module" />} />
          <Route path="configurator/rx-module" element={<PlannedModulePage name="AEGIS RX Module" path="rx-module" />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="docs/aegis-fc" element={<AegisFcDocsPage />} />
          <Route path="docs/aegis-tx" element={<AegisTxDocsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
