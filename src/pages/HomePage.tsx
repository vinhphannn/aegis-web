import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { HeroScene3D } from '../components/HeroScene3D'
import { hardware } from '../content/hardware'
import './HardwarePages.css'

export function HomePage() {
  return (
    <div className="home-container home-hub">
      <PageMeta title="UAV systems" description="AEGIS flight controller hardware, handheld operator control, and firmware tools for UAV systems." path="/" />
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">AEGIS / UAV SYSTEMS</span>
          <h1 className="hero-headline">Flight control, operator control, and autonomy — built as one system.</h1>
          <p className="hero-subhead">Hardware and software for autonomous UAV systems. Custom electronics, embedded firmware, and practical tools for getting started.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">Explore Hardware</Link>
            <Link to="/configurator" className="btn-secondary">Open Configurator</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-bg-glow" />
          <HeroScene3D />
          <span className="home-visual-caption">AEGIS FC / drag to rotate</span>
        </div>
      </section>
      <section className="hub-section" aria-labelledby="current-hardware-title">
        <span className="section-meta">01 / CURRENT HARDWARE</span>
        <h2 id="current-hardware-title">Two parts. One foundation.</h2>
        <div className="hardware-grid">
          {Object.values(hardware).map(device => <article className="hardware-card" key={device.name}>
            <div className="hardware-card-top"><span>{device.role}</span><span className="hardware-status">{device.status}</span></div>
            <h3>{device.name}</h3><p>{device.description}</p>
            <Link className="text-link" to={device.product}>Explore {device.name} →</Link>
          </article>)}
        </div>
      </section>
      <section className="hub-section engineering-strip" aria-labelledby="engineering-title">
        <span className="section-meta">02 / ENGINEERING IN PROGRESS</span>
        <h2 id="engineering-title">Built beyond one board.</h2>
        <div className="proof-grid">
          <div><h3>Flight control</h3><p>Custom FC design and PX4 firmware integration.</p></div>
          <div><h3>Operator control</h3><p>ESP32-based handheld controller development.</p></div>
          <div><h3>Firmware tools</h3><p>FC firmware downloads and Controller USB installation.</p></div>
          <div><h3>Navigation + vision</h3><p>AEGIS NAV / AEGIS VISION · R&amp;D</p></div>
        </div>
        <Link className="text-link" to="/about">See how AEGIS is being built →</Link>
      </section>
    </div>
  )
}
