import { useEffect, useRef, useState } from 'react'
import { PageMeta } from '../components/PageMeta'
import { firmwareURL, loadCatalog, prepareFirmware } from '../lib/firmware'
import type { Catalog, Channel, PreparedFirmware, TxRelease } from '../lib/firmware'
import './ConfiguratorPage.css'

type Device = 'tx' | 'fc'
const RELEASES = {
  tx: 'https://github.com/vinhphannn/Aegis-TX/releases',
  fc: 'https://github.com/vinhphannn/PX4-Autopilot/releases',
}

// A small DOM wrapper keeps the third-party web component out of the React UI state.
function InstallButton({ manifestURL, disabled }: { manifestURL: string; disabled: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const element = document.createElement('esp-web-install-button')
    element.setAttribute('manifest', manifestURL)
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'btn-primary'
    button.slot = 'activate'
    button.textContent = 'Connect & install'
    buttonRef.current = button
    element.append(button)
    host.current?.append(element)
    return () => { element.remove(); buttonRef.current = null }
  }, [manifestURL])
  useEffect(() => {
    if (buttonRef.current) buttonRef.current.disabled = disabled
  }, [disabled, manifestURL])
  return <div ref={host} />
}

function TxInstaller({ release }: { release: TxRelease }) {
  const [boardConfirmed, setBoardConfirmed] = useState(false)
  const [betaConfirmed, setBetaConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [prepared, setPrepared] = useState<PreparedFirmware | null>(null)
  const pending = useRef<AbortController | null>(null)
  const ready = useRef<PreparedFirmware | null>(null)
  const supported = window.isSecureContext && 'serial' in navigator
  const confirmed = boardConfirmed && (release.channel !== 'beta' || betaConfirmed)

  useEffect(() => () => {
    pending.current?.abort()
    ready.current?.dispose()
  }, [])

  async function prepare() {
    const controller = new AbortController()
    pending.current = controller
    setBusy(true)
    setStatus('Downloading and verifying firmware…')
    let result: PreparedFirmware | undefined
    try {
      result = await prepareFirmware(release, controller.signal)
      const moduleURL = `${import.meta.env.BASE_URL}esp-web-tools/install-button.js`
      await import(/* @vite-ignore */ moduleURL)
      await customElements.whenDefined('esp-web-install-button')
      controller.signal.throwIfAborted()
      ready.current = result
      setPrepared(result)
      setStatus('Firmware verified. Connect your device to continue. Nothing has been written yet.')
    } catch (error) {
      result?.dispose()
      if (!controller.signal.aborted) {
        console.error('Firmware preparation failed:', error)
        setStatus(error instanceof Error ? error.message : 'Could not prepare firmware. Try again.')
      }
    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  return (
    <div className="config-install">
      <p className="config-notice">
        Leave <strong>Erase device</strong> unchecked in the installer to keep model and calibration data
        with the current partition layout. Erasing removes this data. Older firmware may not understand newer settings.
      </p>
      <label className="config-check">
        <input type="checkbox" checked={boardConfirmed} onChange={event => setBoardConfirmed(event.target.checked)} />
        <span>My device is AEGIS TX with ESP32, hardware revision TX01. Chip detection alone cannot identify the board.</span>
      </label>
      {release.channel === 'beta' && <label className="config-check">
        <input type="checkbox" checked={betaConfirmed} onChange={event => setBetaConfirmed(event.target.checked)} />
        <span>I accept this beta release and will check sticks, calibration, BLE and radio before use.</span>
      </label>}
      <div className="config-actions">
        {prepared
          ? <InstallButton manifestURL={prepared.manifestURL} disabled={!confirmed} />
          : <button type="button" className="btn-primary" disabled={!supported || !confirmed || busy} onClick={prepare}>
            {busy ? 'Verifying…' : 'Prepare firmware'}
          </button>}
        <a className="btn-secondary" href={firmwareURL(release.download)}>Download ZIP</a>
      </div>
      {status && <p className="config-status" role="status">{status}</p>}
      {!supported && <p className="config-notice">USB installation needs Web Serial on a secure connection. Use Chrome or Edge on a desktop computer, or download the ZIP for manual flashing.</p>}
    </div>
  )
}

export function ConfiguratorPage() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [device, setDevice] = useState<Device>('tx')
  const [channel, setChannel] = useState<Channel>('stable')
  const [version, setVersion] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    loadCatalog(controller.signal).then(setCatalog).catch(error => {
      if (!controller.signal.aborted) {
        console.error('Firmware catalog failed:', error)
        setError(error instanceof Error ? error.message : 'Could not load firmware releases.')
      }
    })
    return () => controller.abort()
  }, [attempt])

  const releases = catalog?.[device].filter(release => release.channel === channel) ?? []
  const selected = releases.find(release => release.version === version) ?? releases[0]

  return (
    <div className="page-container configurator">
      <PageMeta title="Configurator" description="Choose firmware and update your AEGIS TX or download firmware for AEGIS FC." path="/configurator" />
      <header className="page-header">
        <h1>Configurator</h1>
        <p className="page-description">Select your device and firmware. Install over USB or download a release.</p>
      </header>
      <section className="config-panel" aria-label="Firmware selection">
        <div className="config-fields">
          <label>Device
            <select value={device} onChange={event => { setDevice(event.target.value as Device); setVersion('') }}>
              <option value="tx">AEGIS TX · ESP32 / TX01</option>
              <option value="fc">AEGIS FC v1 · PX4</option>
            </select>
          </label>
          <label>Channel
            <select value={channel} onChange={event => { setChannel(event.target.value as Channel); setVersion('') }}>
              <option value="stable">Stable</option>
              <option value="beta">Beta</option>
            </select>
          </label>
          <label>Version
            <select value={selected?.version ?? ''} disabled={!releases.length} onChange={event => setVersion(event.target.value)}>
              {!releases.length && <option value="">{!catalog && !error ? 'Loading…' : 'No releases'}</option>}
              {releases.map(release => <option key={release.version} value={release.version}>v{release.version.replace(/^v/, '')}</option>)}
            </select>
          </label>
        </div>
        {error && <div className="config-empty" role="alert">
          <p>{error}</p>
          <button type="button" className="btn-secondary" onClick={() => { setError(''); setAttempt(attempt + 1) }}>Retry</button>
        </div>}
        {!catalog && !error && <p className="config-status" role="status">Loading firmware releases…</p>}
        {catalog && !selected && <div className="config-empty">
          <h2>No {channel} releases available</h2>
          <p>{device === 'tx'
            ? 'Only releases prepared for web installation appear here. Older releases remain available on GitHub.'
            : 'No AEGIS FC v1 firmware is published in this channel yet.'}</p>
          {channel === 'stable' && catalog[device].some(release => release.channel === 'beta') &&
            <button type="button" className="btn-secondary" onClick={() => { setChannel('beta'); setVersion('') }}>Show beta releases</button>}
          <a className="text-link" href={RELEASES[device]}>All releases ↗</a>
        </div>}
        {selected && <div className="config-release">
          <div className="config-release-header">
            <h2>v{selected.version.replace(/^v/, '')}</h2>
            <span>{new Date(selected.published_at).toLocaleDateString('en-GB')}</span>
            <a className="text-link" href={selected.release_url} target="_blank" rel="noreferrer">Release notes ↗</a>
          </div>
          {'manifest' in selected
            ? <>
              <p className="config-status">{selected.hardware_tested ? 'Hardware testing confirmed by the publisher.' : 'Hardware testing has not been confirmed for this release.'}</p>
              <TxInstaller key={`${selected.version}:${selected.commit}`} release={selected} />
            </>
            : <>
              <p className="config-status">Firmware package checked for AEGIS FC v1, board ID 1179.</p>
              <a className="btn-primary" href={firmwareURL(selected.download)}>Download .px4</a>
              <details className="config-checksum"><summary>SHA-256 checksum</summary><code>{selected.sha256}</code></details>
            </>}
        </div>}
      </section>
      <section className="config-guide" aria-labelledby="setup-heading">
        <h2 id="setup-heading">{device === 'tx' ? 'USB installation' : 'FC installation'}</h2>
        {device === 'tx'
          ? <ol><li>Use a USB data cable and close any serial monitor using the device.</li><li>Prepare the firmware, then connect and follow the installer. Hold BOOT while connecting if the device cannot enter download mode.</li><li>Keep USB connected until installation finishes. Check sticks, calibration, BLE and radio after reboot.</li></ol>
          : <><p>Direct browser flashing for FC is not available yet. Use QGroundControl with the matching AEGIS FC v1 firmware.</p><ol><li>Remove propellers and back up parameters.</li><li>Open Vehicle Setup → Firmware → Advanced settings → Custom firmware, then select the downloaded .px4 file.</li><li>Verify sensors and calibration after reboot. <a className="text-link" href="https://docs.px4.io/main/en/config/firmware">PX4 instructions ↗</a></li></ol></>}
      </section>
    </div>
  )
}
