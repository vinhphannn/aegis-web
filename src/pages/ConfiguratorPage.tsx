import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import './ConfiguratorPage.css'

export function ConfiguratorPage() {
  return <div className="page-container configurator">
    <PageMeta title="Configurator" description="Choose an AEGIS device to configure or update." path="/configurator" />
    <header className="page-header"><h1>Configurator</h1><p className="page-description">Choose your device to get started.</p></header>
    <nav aria-label="Configurator devices">
      <ul className="config-devices">
        <li><Link to="/configurator/fc"><span><strong>AEGIS FC</strong><span>Flight Controller</span></span><span>Open →</span></Link></li>
        <li><Link to="/configurator/controller"><span><strong>AEGIS Controller</strong><span>RC Controller</span></span><span>Open →</span></Link></li>
        <li><Link to="/configurator/tx-module"><span><strong>AEGIS TX Module</strong><span>RF transmitter module</span></span><span>Planned</span></Link></li>
        <li><Link to="/configurator/rx-module"><span><strong>AEGIS RX Module</strong><span>RF receiver module</span></span><span>Planned</span></Link></li>
      </ul>
    </nav>
  </div>
}
