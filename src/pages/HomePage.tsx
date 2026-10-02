import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { HeroScene3D } from '../components/HeroScene3D'
import { FcSectionScene3D } from '../components/FcSectionScene3D'

export function HomePage() {
  return (
    <div className="home-container">
      <PageMeta
        title="Hub"
        description="Official web hub and hardware platform for the AEGIS UAV ecosystem."
        path="/"
      />

      {/* SECTION A: HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">AEGIS / SPATIAL ECOSYSTEM</span>
          <h1 className="hero-headline">
            Integrated systems for autonomous flight.
          </h1>
          <p className="hero-subhead">
            Hardware, firmware, and tooling engineered for high-reliability UAV platforms.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">
              Explore Products
            </Link>
            <Link to="/configurator" className="btn-secondary">
              Configurator
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-bg-glow" />
          <HeroScene3D desktopCameraZ={6.2} />
        </div>
      </section>

      <div className="spatial-divider" />

      {/* SECTION B: ECOSYSTEM */}
      <section className="spatial-section">
        <span className="section-meta" data-rv="up">01 / ECOSYSTEM</span>
        <h2 className="section-title" data-rv="up">SYSTEM ARCHITECTURE</h2>
        <div className="ecosystem-grid" data-rv="up">
          <div className="system-flow">
            <div className="system-node">
              <span className="system-node-title">AEGIS TX</span>
              <span className="system-node-status active">AVAILABLE</span>
            </div>
            <span className="system-connector">─</span>
            <div className="system-node">
              <span className="system-node-title">RX</span>
              <span className="system-node-status">PLANNED</span>
            </div>
            <span className="system-connector">─</span>
            <div className="system-node">
              <span className="system-node-title">AEGIS FC</span>
              <span className="system-node-status active">AVAILABLE</span>
            </div>
            <span className="system-connector">─</span>
            <div className="system-node">
              <span className="system-node-title">ESC / NAV / VISION</span>
              <span className="system-node-status">PLANNED EXTENSION</span>
            </div>
          </div>
        </div>
      </section>

      <div className="spatial-divider" />

      {/* SECTION C: FLIGHT CONTROL */}
      <section className="spatial-section">
        <span className="section-meta" data-rv="up">02 / FLIGHT CONTROL</span>
        <h2 className="section-title" data-rv="up">AEGIS FC</h2>
        <div className="asymmetric-block">
          <div className="feature-info" data-rv="up">
            <p className="feature-description">
              Flight controller hardware engineered for autonomous platforms. Designed for multi-bus sensor integration, real-time telemetry, and flight-critical reliability.
            </p>
            <Link to="/products/aegis-fc" className="text-link">
              Explore AEGIS FC →
            </Link>
          </div>
          <div className="feature-placeholder-visual" data-rv="up">
            <FcSectionScene3D />
          </div>
        </div>
      </section>

      <div className="spatial-divider" />

      {/* SECTION D: CONTROL */}
      <section className="spatial-section">
        <span className="section-meta" data-rv="up">03 / CONTROL</span>
        <h2 className="section-title" data-rv="up">AEGIS TX</h2>
        <div className="asymmetric-block reversed">
          <div className="feature-placeholder-visual" data-rv="up">
            <div className="spatial-visual-card">
              <span className="spatial-card-badge">CONTROL LINK</span>
              <h3 className="spatial-card-title">AEGIS TX</h3>
              <p className="spatial-card-sub">RC Transmitter & Flasher</p>
            </div>
          </div>
          <div className="feature-info" data-rv="up">
            <p className="feature-description">
              Radio transmitter platform built for long-range command, low-latency control link, and integrated system diagnostics.
            </p>
            <Link to="/products/aegis-tx" className="text-link">
              Explore AEGIS TX →
            </Link>
          </div>
        </div>
      </section>

      <div className="spatial-divider" />

      {/* SECTION E: CONFIGURATOR */}
      <section className="spatial-section">
        <span className="section-meta" data-rv="up">04 / CONFIGURATOR</span>
        <h2 className="section-title" data-rv="up">AEGIS WEB TOOLS</h2>
        <div className="feature-info" data-rv="up">
          <p className="feature-description">
            Web-based platform designed for device configuration, parameter adjustment, and firmware utility operations.
          </p>
          <Link to="/configurator" className="btn-secondary">
            Open Configurator →
          </Link>
        </div>
      </section>

      <div className="spatial-divider" />

      {/* SECTION F: ENGINEERING */}
      <section className="spatial-section">
        <span className="section-meta" data-rv="up">05 / ENGINEERING</span>
        <h2 className="section-title" data-rv="up">CORE ARCHITECTURE</h2>
        <div className="engineering-flow" data-rv="up">
          <div className="engineering-column">
            <h3>Hardware</h3>
            <p>Embedded systems designed for reliability and sensor integration.</p>
          </div>
          <div className="engineering-column">
            <h3>Firmware</h3>
            <p>Real-time execution layers and flight control routines.</p>
          </div>
          <div className="engineering-column">
            <h3>Tools</h3>
            <p>Browser utilities for setup, diagnostics, and parameter management.</p>
          </div>
        </div>
      </section>

      <div className="spatial-divider" />

      {/* SECTION G: ABOUT */}
      <section className="spatial-section">
        <span className="section-meta" data-rv="up">06 / ABOUT</span>
        <h2 className="section-title" data-rv="up">ENGINEERING ECOSYSTEM</h2>
        <div className="about-block" data-rv="up">
          <p>
            AEGIS is an open UAV hardware and software engineering project focused on building reliable, modular components for modern autonomous flight systems.
          </p>
          <div className="about-links">
            <Link to="/about" className="text-link">
              About AEGIS →
            </Link>
            <a
              href="https://github.com/vinhphannn/aegis-web"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
