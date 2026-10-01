import { Outlet, Link } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="layout-container">
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <span>AEGIS UAV Ecosystem</span>
          <div className="footer-nav">
            <Link to="/products" className="footer-link">
              Products
            </Link>
            <Link to="/configurator" className="footer-link">
              Configurator
            </Link>
            <Link to="/docs" className="footer-link">
              Docs
            </Link>
            <Link to="/about" className="footer-link">
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
