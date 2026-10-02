// Firmware stays with its release pipeline; this app owns only the installer UI.
const FIRMWARE_BASE_URL = 'https://vinhphannn.github.io/Aegis-TX/'
export type Channel = 'stable' | 'beta'

export interface Release {
  version: string
  channel: Channel
  published_at: string
  release_url: string
  download: string
}
export interface ControllerRelease extends Release {
  board: 'aegis-tx-esp32'
  hardware_revision: 'tx01'
  commit: string
  hardware_tested: boolean
  metadata: string
  manifest: string
}
interface FcRelease extends Release {
  board_id: 1179
  sha256: string
}
export interface Catalog {
  schema_version: 1
  controller: ControllerRelease[]
  fc: FcRelease[]
}
interface Metadata {
  schema_version: number
  board: string
  hardware_revision: string
  version: string
  channel: Channel
  commit: string
  manifest: string
  files: Record<string, { sha256: string; size: number }>
}
interface Manifest {
  version: string
  new_install_prompt_erase: boolean
  builds: { chipFamily: string; parts: { path: string; offset: number }[] }[]
}
export interface PreparedFirmware {
  manifestURL: string
  dispose: () => void
}

export function firmwareURL(path: string, base = FIRMWARE_BASE_URL): string {
  const root = new URL(FIRMWARE_BASE_URL)
  const url = new URL(path, base)
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) {
    throw new Error('Firmware URL is outside the release catalog.')
  }
  return url.href
}

async function get(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal, cache: 'no-store' })
  if (!response.ok) throw new Error(`Could not download firmware data (HTTP ${response.status}).`)
  return response
}

export async function loadCatalog(signal: AbortSignal): Promise<Catalog> {
  // The publisher uses the historical `tx` key for the handheld controller.
  // Normalize that wire format here; UI device roles use `controller`.
  const catalog: { schema_version: 1; tx: ControllerRelease[]; fc: FcRelease[] } = await (await get(firmwareURL('catalog.json'), signal)).json()
  if (catalog.schema_version !== 1 || !Array.isArray(catalog.tx) || !Array.isArray(catalog.fc)) {
    throw new Error('Unsupported firmware catalog.')
  }
  for (const release of [...catalog.tx, ...catalog.fc]) {
    if (typeof release.version !== 'string' || !['stable', 'beta'].includes(release.channel)
      || !Number.isFinite(Date.parse(release.published_at))
      || new URL(release.release_url).origin !== 'https://github.com') {
      throw new Error('Invalid release in firmware catalog.')
    }
    firmwareURL(release.download)
  }
  for (const release of catalog.tx) {
    if (release.board !== 'aegis-tx-esp32' || release.hardware_revision !== 'tx01'
      || !/^[a-f0-9]{40}$/.test(release.commit)
      || typeof release.hardware_tested !== 'boolean'
      || (release.channel === 'stable' && !release.hardware_tested)) {
      throw new Error('Unsupported TX hardware or release status.')
    }
    firmwareURL(release.manifest)
    firmwareURL(release.metadata)
  }
  for (const release of catalog.fc) {
    if (release.board_id !== 1179 || !/^[a-f0-9]{64}$/.test(release.sha256)) {
      throw new Error('Unsupported FC firmware.')
    }
  }
  return { schema_version: 1, controller: catalog.tx, fc: catalog.fc }
}

export async function prepareFirmware(release: ControllerRelease, signal: AbortSignal): Promise<PreparedFirmware> {
  const blobs: string[] = []
  const dispose = () => blobs.forEach(url => URL.revokeObjectURL(url))
  try {
    const metadata: Metadata = await (await get(firmwareURL(release.metadata), signal)).json()
    if (metadata.schema_version !== 1 || metadata.board !== release.board
      || metadata.hardware_revision !== release.hardware_revision || metadata.version !== release.version
      || metadata.commit !== release.commit || metadata.channel !== release.channel) {
      throw new Error('Firmware does not match the selected board or version.')
    }
    const manifestURL = firmwareURL(release.manifest)
    const checkedFile = async (name: string) => {
      const expected = metadata.files[name]
      if (!expected || !/^[a-f0-9]{64}$/.test(expected.sha256)) throw new Error('Missing firmware checksum.')
      const bytes = await (await get(firmwareURL(name, manifestURL), signal)).arrayBuffer()
      const hash = await crypto.subtle.digest('SHA-256', bytes)
      const actual = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')
      if (bytes.byteLength !== expected.size || actual !== expected.sha256) {
        throw new Error('Firmware checksum mismatch. Nothing has been written to your device.')
      }
      return bytes
    }
    const manifest: Manifest = JSON.parse(new TextDecoder().decode(await checkedFile(metadata.manifest)))
    if (manifest.version !== release.version || manifest.new_install_prompt_erase !== true
      || manifest.builds.length !== 1 || manifest.builds[0].chipFamily !== 'ESP32'
      || !manifest.builds[0].parts.length) throw new Error('Unsupported firmware manifest.')
    for (const part of manifest.builds[0].parts) {
      if (!Number.isSafeInteger(part.offset) || part.offset < 0 || part.offset % 4096) {
        throw new Error('Invalid firmware flash offset.')
      }
      const bytes = await checkedFile(part.path)
      part.path = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }))
      blobs.push(part.path)
    }
    signal.throwIfAborted()
    const preparedURL = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }))
    blobs.push(preparedURL)
    return { manifestURL: preparedURL, dispose }
  } catch (error) {
    dispose()
    throw error
  }
}
