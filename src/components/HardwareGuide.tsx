import { Link } from 'react-router-dom'
import { hardware } from '../content/hardware'
import { PageMeta } from './PageMeta'
import '../pages/HardwarePages.css'
export function HardwareGuide({ kind }: { kind: keyof typeof hardware }) {
  const device = hardware[kind], fc = kind === 'fc'
  const repository = fc ? 'https://github.com/vinhphannn/Aegis-FC' : 'https://github.com/vinhphannn/Aegis-TX'
  return <div className="page-container hardware-detail">
    <PageMeta title={`${device.name} documentation`} description={`Getting started, firmware, and connection guidance for ${device.name}.`} path={device.docs} />
    <header className="page-header"><h1>{device.name} Documentation</h1><p className="page-description">Getting started with the current firmware workflow.</p></header>
    <section><h2>Getting started</h2><ol><li>Identify the device and hardware revision. {fc ? 'This workflow targets AEGIS FC v1, board ID 1179.' : 'Choose the handheld AEGIS Controller, not AEGIS TX Module.'}</li><li>{fc ? 'Remove propellers and back up existing vehicle parameters before updating firmware.' : 'Use a USB data cable and close serial monitors that may be using the device.'}</li><li>Open the device Configurator and select the appropriate firmware channel and version.</li></ol></section>
    <section><h2>Firmware installation</h2>{fc ? <ol><li>Download the matching .px4 package from the Configurator.</li><li>In QGroundControl, open Vehicle Setup → Firmware → Advanced settings → Custom firmware, then select your file.</li><li>Verify sensors and perform calibration after reboot. Direct browser flashing for FC is not available yet.</li></ol> : <ol><li>Prepare the selected firmware and complete the hardware confirmations.</li><li>Start the USB installer on a browser with Web Serial support. Hold BOOT while connecting if your hardware cannot enter download mode.</li><li>Keep USB connected until installation finishes, then check sticks, calibration, BLE, and radio. A package download is available when browser installation is unsupported.</li></ol>}</section>
    <section><h2>Connections and hardware reference</h2><p>{fc ? 'Confirm revision-specific connector pinouts and electrical requirements in the FC hardware design files before wiring. This guide does not replace the schematic.' : 'The Controller firmware project documents ESP32, a LoRa RA-02 radio path, and BLE gamepad mode. Use the revision-matched hardware documentation for pin assignments; do not connect hardware based only on this overview.'}</p><a className="text-link" href={repository} target="_blank" rel="noreferrer">Open {fc ? 'hardware design' : 'Controller project'} reference ↗</a></section>
    <div className="hardware-detail-actions"><Link className="btn-primary" to={device.configurator}>Open Configurator</Link><Link className="btn-secondary" to={device.product}>Explore hardware →</Link></div>
  </div>
}
