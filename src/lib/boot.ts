// Lightweight AEGIS Boot Readiness Signals
type Listener = () => void
const listeners = new Set<Listener>()
let isReady = false

export function signalBootReady() {
  if (isReady) return
  isReady = true
  listeners.forEach((cb) => cb())
  listeners.clear()
}

export function onBootReady(callback: () => void): () => void {
  if (isReady) {
    callback()
    return () => {}
  }
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

export function resetBootStateForTesting() {
  isReady = false
  listeners.clear()
}
