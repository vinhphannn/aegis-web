import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BootLoader } from './components/BootLoader'
import { NotFoundPage } from './pages/NotFoundPage'
import {
  HomePage,
  ProductsPage,
  AegisFcPage,
  AegisTxPage,
  ConfiguratorPage,
  FcConfiguratorPage,
  ControllerConfiguratorPage,
  PlannedModulePage,
  DocsPage,
  AegisFcDocsPage,
  AegisTxDocsPage,
  AboutPage,
} from './lib/prefetch'
import './App.css'

export default function App() {
  return (
    <>
      <BootLoader />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/fc" element={<AegisFcPage />} />
            <Route path="products/aegis-fc" element={<Navigate to="/products/fc" replace />} />
            <Route path="products/controller" element={<AegisTxPage />} />
            <Route path="products/aegis-tx" element={<Navigate to="/products/controller" replace />} />
            <Route path="configurator" element={<ConfiguratorPage />} />
            <Route path="configurator/fc" element={<FcConfiguratorPage />} />
            <Route path="configurator/controller" element={<ControllerConfiguratorPage />} />
            <Route path="configurator/tx-module" element={<PlannedModulePage name="AEGIS TX Module" path="tx-module" />} />
            <Route path="configurator/rx-module" element={<PlannedModulePage name="AEGIS RX Module" path="rx-module" />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="docs/fc" element={<AegisFcDocsPage />} />
            <Route path="docs/aegis-fc" element={<Navigate to="/docs/fc" replace />} />
            <Route path="docs/controller" element={<AegisTxDocsPage />} />
            <Route path="docs/aegis-tx" element={<Navigate to="/docs/controller" replace />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
