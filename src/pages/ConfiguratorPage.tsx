import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import './ConfiguratorPage.css'

const devices = [
  { path: 'fc', name: 'AEGIS FC', role: 'Flight controller', detail: 'Find firmware for your flight controller.', action: 'Select FC', icon: 'board' },
  { path: 'controller', name: 'AEGIS Controller', role: 'Handheld controller', detail: 'Prepare and install firmware over USB.', action: 'Select Controller', icon: 'controller' },
  { path: 'tx-module', name: 'AEGIS TX Module', role: 'RF transmitter module', detail: 'Firmware tools are planned for this device.', action: 'View status', icon: 'transmitter', planned: true },
  { path: 'rx-module', name: 'AEGIS RX Module', role: 'RF receiver module', detail: 'Firmware tools are planned for this device.', action: 'View status', icon: 'receiver', planned: true },
]

function DeviceIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'board' ? <><rect x="13" y="10" width="38" height="44" rx="5" /><rect x="24" y="23" width="16" height="18" rx="1" /><path d="M28 18v5m8-5v5m-8 18v5m8-5v5M19 28h5m-5 8h5m16-8h5m-5 8h5" /><circle cx="19" cy="16" r="1" /><circle cx="45" cy="48" r="1" /></> : kind === 'controller' ? <><rect x="9" y="23" width="46" height="30" rx="8" /><path d="M21 23 17 11m26 12 4-12M27 30h10v7H27z" /><circle cx="20" cy="40" r="5" /><circle cx="44" cy="40" r="5" /><path d="M20 38v4m22-2h4" /></> : <><rect x="19" y="29" width="26" height="25" rx="4" /><path d="M32 29V15m-7 39v4m7-4v4m7-4v4M27 39h10m-10 6h6" /><path d={kind === 'transmitter' ? 'M23 20a13 13 0 0 1 18 0M16 13a23 23 0 0 1 32 0' : 'M23 13a13 13 0 0 0 18 0M16 6a23 23 0 0 0 32 0'} /></>}
  </svg>
}

export function ConfiguratorPage() {
  return <div className="page-container configurator config-device-hub">
    <PageMeta title="Configurator" description="Choose an AEGIS device to configure or update." path="/configurator" />
    <header className="page-header"><h1>Choose your device.</h1><p className="page-description">Select your hardware to find its firmware tools.</p></header>
    <nav aria-label="Configurator devices">
      <ul className="config-devices">
        {devices.map(device => <li key={device.path}>
          <Link className={`config-device-card${device.planned ? ' is-planned' : ''}`} to={`/configurator/${device.path}`}>
            <span className="config-card-top"><span className="config-device-icon"><DeviceIcon kind={device.icon} /></span>{device.planned && <span className="config-planned-badge">Planned</span>}</span>
            <span className="config-card-copy"><span className="config-device-role">{device.role}</span><strong>{device.name}</strong><span className="config-device-detail">{device.detail}</span></span>
            <span className="config-card-action">{device.action}<span aria-hidden="true">↗</span></span>
          </Link>
        </li>)}
      </ul>
    </nav>
  </div>
}
