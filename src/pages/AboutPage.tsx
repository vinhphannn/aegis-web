import { PageMeta } from '../components/PageMeta'
import { useEffect, useRef } from 'react'

export function AboutPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Basic cleanup when unmounting if needed
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank'
      }
    }
  }, [])

  return (
    <>
      <PageMeta
        title="About AEGIS"
        description="The AEGIS UAV spatial ecosystem: hardware, firmware, architecture."
        path="/about"
      />
      <iframe
        ref={iframeRef}
        src={`${import.meta.env.BASE_URL}aegis-about.html`}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: 9999, // Render above global app layout/nav
          backgroundColor: '#07090e'
        }}
        title="AEGIS About Experience"
      />
    </>
  )
}
