import { useEffect, useRef, useState } from 'react'
import { Brand } from './Brand'
import { onBootReady } from '../lib/boot'

const MIN_BOOT_TIME = 250 // Anti-flicker minimum (250ms)
const MAX_BOOT_TIMEOUT = 2500 // Maximum wait before revealing page on slow network (2.5s)

export function BootLoader() {
  const [shouldRender, setShouldRender] = useState(true)
  const [fading, setFading] = useState(false)
  const startTime = useRef<number>(0)

  useEffect(() => {
    if (!shouldRender) return

    startTime.current = Date.now()

    let dismissed = false
    let minWaitTimer: number
    let fadeTimer: number

    const triggerDismissal = () => {
      if (dismissed) return
      dismissed = true

      const elapsed = Date.now() - startTime.current
      const remainingMin = Math.max(0, MIN_BOOT_TIME - elapsed)

      minWaitTimer = window.setTimeout(() => {
        setFading(true)
        fadeTimer = window.setTimeout(() => {
          setShouldRender(false)
        }, 400) // Matches CSS opacity transition
      }, remainingMin)
    }

    // Dismiss when critical view readiness signal is received
    const unsubscribe = onBootReady(() => {
      triggerDismissal()
    })

    // Safety fallback: reveal page after 2.5s if model download is delayed
    const maxTimeoutTimer = window.setTimeout(() => {
      triggerDismissal()
    }, MAX_BOOT_TIMEOUT)

    return () => {
      unsubscribe()
      clearTimeout(maxTimeoutTimer)
      clearTimeout(minWaitTimer)
      clearTimeout(fadeTimer)
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div
      className={`boot-loader ${fading ? 'fade-out' : ''}`}
      aria-hidden="true"
    >
      <div className="boot-content">
        <Brand className="boot-logo" />
        <span className="boot-status">SYSTEM INITIALIZING</span>
        <div className="boot-line" />
      </div>
    </div>
  )
}
