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

    // Set up scroll reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    // Observe existing
    document.querySelectorAll('[data-rv]').forEach((el) => observer.observe(el))

    // Catch elements rendered lazily via Suspense
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            const el = node as HTMLElement
            if (el.hasAttribute && el.hasAttribute('data-rv')) {
              observer.observe(el)
            }
            if (el.querySelectorAll) {
              el.querySelectorAll('[data-rv]').forEach((child) => observer.observe(child))
            }
          }
        })
      })
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
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
