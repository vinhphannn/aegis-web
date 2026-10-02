import { loadCatalog } from './firmware'

// Both families currently share a published catalog, not application state.
// Firmware build/release remains in its firmware repository.
export const controllerSource = {
  load: async (signal: AbortSignal) => (await loadCatalog(signal)).controller,
  releasesURL: 'https://github.com/vinhphannn/Aegis-TX/releases',
}
export const fcSource = {
  load: async (signal: AbortSignal) => (await loadCatalog(signal)).fc,
  releasesURL: 'https://github.com/vinhphannn/PX4-Autopilot/releases',
}
