import { firmwareURL } from '../../lib/firmware'
import { fcSource } from '../../lib/firmwareSources'
import { DevicePage } from './DevicePage'
import { FirmwareSelection } from './FirmwareSelection'

export function FcConfiguratorPage() {
  return <DevicePage name="AEGIS FC" path="fc" description="Download AEGIS FC v1 firmware for installation with QGroundControl.">
    <FirmwareSelection source={fcSource} emptyMessage="No AEGIS FC v1 firmware is published in this channel yet.">
      {release => <>
        <p className="config-status">Firmware package checked for AEGIS FC v1, board ID 1179.</p>
        <a className="btn-primary" href={firmwareURL(release.download)}>Download .px4</a>
        <details className="config-checksum"><summary>SHA-256 checksum</summary><code>{release.sha256}</code></details>
      </>}
    </FirmwareSelection>
    <section className="config-guide" aria-labelledby="setup-heading">
      <h2 id="setup-heading">FC installation</h2>
      <p>Direct browser flashing for FC is not available yet. Use QGroundControl with the matching AEGIS FC v1 firmware.</p>
      <ol><li>Remove propellers and back up parameters.</li><li>Open Vehicle Setup → Firmware → Advanced settings → Custom firmware, then select the downloaded .px4 file.</li><li>Verify sensors and calibration after reboot. <a className="text-link" href="https://docs.px4.io/main/en/config/firmware">PX4 instructions ↗</a></li></ol>
    </section>
  </DevicePage>
}
