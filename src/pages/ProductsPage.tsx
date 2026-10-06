import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { hardware } from '../content/hardware'
import './HardwarePages.css'
export function ProductsPage() {
  return <div className="page-container hardware-detail">
    <PageMeta title="Hardware" description="Explore AEGIS FC and the AEGIS handheld Controller." path="/products" />
    <header className="page-header"><h1>Hardware</h1><p className="page-description">Flight control and operator control for UAV projects.</p></header>
    <div className="hardware-grid">{Object.values(hardware).map(device => <article className="hardware-card" key={device.name}><div className="hardware-card-top"><span>{device.role}</span><span className="hardware-status">{device.status}</span></div><h3>{device.name}</h3><p>{device.description}</p><Link className="text-link" to={device.product}>Explore {device.name} →</Link></article>)}</div>
    <section><h2>Future modules</h2><p>AEGIS TX Module and AEGIS RX Module are planned RF modules. AEGIS NAV and AEGIS VISION are R&amp;D directions.</p></section>
  </div>
}
