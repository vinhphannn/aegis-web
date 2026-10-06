import { useEffect, useRef, useState } from 'react'
import { firmwareURL, prepareFirmware } from '../../lib/firmware'
import type { PreparedFirmware, ControllerRelease } from '../../lib/firmware'

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

export function ControllerInstaller({ release }: { release: ControllerRelease }) {
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
        <span>My device is the AEGIS Controller with ESP32, hardware revision TX01. Chip detection alone cannot identify the board.</span>
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

