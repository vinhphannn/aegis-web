import { Link } from 'react-router-dom'
import { PageMeta } from './PageMeta'
import { hardware } from '../content/hardware'
import '../pages/HardwarePages.css'

export function HardwareOverview({ kind }: { kind: keyof typeof hardware }) {
  const device = hardware[kind]
  const fc = kind === 'fc'
  return <div className="page-container hardware-detail">
    <PageMeta title={device.name} description={device.description} path={device.product} />
    <header className="page-header"><span className="hardware-status">{device.status}</span><h1>{device.name}</h1><p className="page-description">{device.description}</p></header>
    <div className="hardware-diagram" role="img" aria-label={fc ? 'AEGIS FC hardware with PX4 firmware for UAV integration' : 'Operator inputs connect to the ESP32 controller and radio or BLE output'}>
      <span>{fc ? 'Custom hardware' : 'Operator inputs'}</span><span aria-hidden="true">→</span><strong>{device.name}</strong><span aria-hidden="true">→</span><span>{fc ? 'PX4 / UAV integration' : 'Radio / BLE'}</span>
    </div>
    <section><h2>{fc ? 'Flight control foundation' : 'Handheld operator control'}</h2><p>{fc ? 'AEGIS FC is a custom flight controller hardware project. The web workflow provides AEGIS FC v1 firmware packages for installation with QGroundControl.' : 'AEGIS Controller is the handheld RC controller, distinct from the planned AEGIS TX Module. Its ESP32 firmware project includes stick and switch inputs, radio operation, and BLE gamepad functionality for simulator use.'}</p></section>
    <section><h2>Current firmware workflow</h2><ul>{fc ? <><li>Select a channel and firmware version for AEGIS FC v1.</li><li>Download the matching .px4 package for board ID 1179.</li><li>Install with QGroundControl; direct FC browser flashing is not implemented.</li></> : <><li>Select firmware prepared for the handheld Controller USB workflow.</li><li>Prepare and verify firmware before starting the browser installer.</li><li>Install through Web Serial on a supported browser, or download the firmware package.</li></>}</ul></section>
    <section><h2>Connections and compatibility</h2><p>{fc ? 'Use firmware explicitly targeting AEGIS FC v1. Confirm the board revision and hardware connections against the hardware design files before integration.' : 'The firmware project targets ESP32 and documents a LoRa RA-02 433 MHz radio path and BLE HID mode. USB firmware installation requires a USB data cable. Match the firmware to the handheld hardware revision; it is not a TX Module installer.'}</p><p className="hardware-note">Hardware interface details and revision-specific wiring belong to the design repository. Check the source before connecting a device.</p></section>
    <div className="hardware-detail-actions"><Link className="btn-primary" to={device.configurator}>Open Configurator</Link><Link className="btn-secondary" to={device.docs}>Getting started →</Link></div>
    <a className="text-link" href={fc ? 'https://github.com/vinhphannn/Aegis-FC' : 'https://github.com/vinhphannn/Aegis-TX'} target="_blank" rel="noreferrer">{fc ? 'Hardware design source' : 'Controller firmware source'} ↗</a>
  </div>
}
