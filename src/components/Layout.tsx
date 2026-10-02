import { useEffect, Suspense } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { RouteFallback } from './RouteFallback'
import { scheduleIdlePrefetch, prefetchPath } from '../lib/prefetch'
import { signalBootReady } from '../lib/boot'

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    scheduleIdlePrefetch(location.pathname)

    // For non-Home routes, signal boot readiness as soon as route layout mounts
    if (location.pathname !== '/') {
      requestAnimationFrame(() => {
        signalBootReady()
      })
    }
  }, [location.pathname])

  return (
    <div className="layout-container">
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <main className="main-content">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <span>AEGIS UAV Ecosystem</span>
          <div className="footer-nav">
            <Link
              to="/products"
              className="footer-link"
              onPointerEnter={() => prefetchPath('/products')}
              onFocus={() => prefetchPath('/products')}
            >
              Products
            </Link>
            <Link
              to="/configurator"
              className="footer-link"
              onPointerEnter={() => prefetchPath('/configurator')}
              onFocus={() => prefetchPath('/configurator')}
            >
              Configurator
            </Link>
            <Link
              to="/docs"
              className="footer-link"
              onPointerEnter={() => prefetchPath('/docs')}
              onFocus={() => prefetchPath('/docs')}
            >
              Docs
            </Link>
            <Link
              to="/about"
              className="footer-link"
              onPointerEnter={() => prefetchPath('/about')}
              onFocus={() => prefetchPath('/about')}
            >
              About
            </Link>
            <a
              href="https://github.com/vinhphannn/aegis-web"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
