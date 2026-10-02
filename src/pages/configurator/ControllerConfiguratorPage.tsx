import { controllerSource } from '../../lib/firmwareSources'
import { ControllerInstaller } from './ControllerInstaller'
import { DevicePage } from './DevicePage'
import { FirmwareSelection } from './FirmwareSelection'

export function ControllerConfiguratorPage() {
  return <DevicePage name="AEGIS Controller" path="controller" description="Select firmware for your AEGIS TX handheld controller and install over USB.">
    <FirmwareSelection source={controllerSource} emptyMessage="Only releases prepared for web installation appear here. Older releases remain available on GitHub.">
      {release => <>
        <p className="config-status">{release.hardware_tested ? 'Hardware testing confirmed by the publisher.' : 'Hardware testing has not been confirmed for this release.'}</p>
        <ControllerInstaller key={`${release.version}:${release.commit}`} release={release} />
      </>}
    </FirmwareSelection>
    <section className="config-guide" aria-labelledby="setup-heading">
      <h2 id="setup-heading">USB installation</h2>
      <ol><li>Use a USB data cable and close any serial monitor using the device.</li><li>Prepare the firmware, then connect and follow the installer. Hold BOOT while connecting if the device cannot enter download mode.</li><li>Keep USB connected until installation finishes. Check sticks, calibration, BLE and radio after reboot.</li></ol>
    </section>
  </DevicePage>
}
