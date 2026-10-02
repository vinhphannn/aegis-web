import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { prefetchPath } from '../lib/prefetch'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handlePrefetch = (path: string) => {
    prefetchPath(path)
  }

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link
          to="/"
          className="brand"
          onClick={closeMobileMenu}
          onPointerEnter={() => handlePrefetch('/')}
          onFocus={() => handlePrefetch('/')}
          onTouchStart={() => handlePrefetch('/')}
        >
          AEGIS
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onPointerEnter={() => handlePrefetch('/products')}
            onFocus={() => handlePrefetch('/products')}
            onTouchStart={() => handlePrefetch('/products')}
          >
            Products
          </NavLink>
          <NavLink
            to="/configurator"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onPointerEnter={() => handlePrefetch('/configurator')}
            onFocus={() => handlePrefetch('/configurator')}
            onTouchStart={() => handlePrefetch('/configurator')}
          >
            Configurator
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onPointerEnter={() => handlePrefetch('/docs')}
            onFocus={() => handlePrefetch('/docs')}
            onTouchStart={() => handlePrefetch('/docs')}
          >
            Docs
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onPointerEnter={() => handlePrefetch('/about')}
            onFocus={() => handlePrefetch('/about')}
            onTouchStart={() => handlePrefetch('/about')}
          >
            About
          </NavLink>
          <a
            href="https://github.com/vinhphannn/aegis-web"
            target="_blank"
            rel="noreferrer"
            className="nav-link external"
          >
            GitHub ↗
          </a>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
            onClick={closeMobileMenu}
            onPointerEnter={() => handlePrefetch('/products')}
            onFocus={() => handlePrefetch('/products')}
            onTouchStart={() => handlePrefetch('/products')}
          >
            Products
          </NavLink>
          <NavLink
            to="/configurator"
            className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
            onClick={closeMobileMenu}
            onPointerEnter={() => handlePrefetch('/configurator')}
            onFocus={() => handlePrefetch('/configurator')}
            onTouchStart={() => handlePrefetch('/configurator')}
          >
            Configurator
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
            onClick={closeMobileMenu}
            onPointerEnter={() => handlePrefetch('/docs')}
            onFocus={() => handlePrefetch('/docs')}
            onTouchStart={() => handlePrefetch('/docs')}
          >
            Docs
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
            onClick={closeMobileMenu}
            onPointerEnter={() => handlePrefetch('/about')}
            onFocus={() => handlePrefetch('/about')}
            onTouchStart={() => handlePrefetch('/about')}
          >
            About
          </NavLink>
          <a
            href="https://github.com/vinhphannn/aegis-web"
            target="_blank"
            rel="noreferrer"
            className="mobile-link external"
            onClick={closeMobileMenu}
          >
            GitHub ↗
          </a>
        </nav>
      )}
    </header>
  )
}
