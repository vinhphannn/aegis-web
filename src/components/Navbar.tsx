import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          AEGIS
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Products
          </NavLink>
          <NavLink
            to="/configurator"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Configurator
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Docs
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
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
          >
            Products
          </NavLink>
          <NavLink
            to="/configurator"
            className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
            onClick={closeMobileMenu}
          >
            Configurator
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
            onClick={closeMobileMenu}
          >
            Docs
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
            onClick={closeMobileMenu}
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
