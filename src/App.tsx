import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { AegisFcPage } from './pages/AegisFcPage'
import { AegisTxPage } from './pages/AegisTxPage'
import { ConfiguratorPage } from './pages/ConfiguratorPage'
import { DocsPage } from './pages/DocsPage'
import { AegisFcDocsPage } from './pages/AegisFcDocsPage'
import { AegisTxDocsPage } from './pages/AegisTxDocsPage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/aegis-fc" element={<AegisFcPage />} />
          <Route path="products/aegis-tx" element={<AegisTxPage />} />
          <Route path="configurator" element={<ConfiguratorPage />} />
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
