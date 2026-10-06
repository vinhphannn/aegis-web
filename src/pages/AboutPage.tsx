import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { PageMeta } from '../components/PageMeta'
import './AboutPage.css'

const AboutModels3D = lazy(() => import('../components/AboutModels3D').then(module => ({ default: module.AboutModels3D })))

const assetRoot = `${import.meta.env.BASE_URL}images/about/`
const chapters = [
  { id: 'about-intro', label: 'The project', image: 'flight-hangar' },
  { id: 'about-philosophy', label: 'Our approach', image: 'flight-valley' },
  { id: 'about-foundations', label: 'The ecosystem', image: 'flight-lab' },
  { id: 'about-next', label: 'Start building', image: 'flight-horizon' },
]
const principles = [
  { number: '01', title: 'Hardware', description: 'Modular flight controllers and radio systems.', to: '/products', label: 'Explore products' },
  { number: '02', title: 'Firmware', description: 'Embedded software, sensors, and real-time control.', to: '/docs', label: 'Read the docs' },
  { number: '03', title: 'Tools', description: 'Device setup and firmware utilities in your browser.', to: '/configurator', label: 'Open configurator' },
]

export function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const deadlineRef = useRef(0)
  const [active, setActive] = useState(0)
  const [modelsReady, setModelsReady] = useState(false)
  const [imageReady, setImageReady] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [minimumWait, setMinimumWait] = useState(false)
  const onPrepared = useCallback(() => setModelsReady(true), [])
  const revealed = minimumWait && ((modelsReady && imageReady) || timedOut)

  useEffect(() => {
    let cancelled = false
    const image = new Image()
    image.src = `${assetRoot}${chapters[0].image}.webp`
    image.decode().catch(() => {}).then(() => { if (!cancelled) setImageReady(true) })
    const minimum = window.setTimeout(() => setMinimumWait(true), 200)
    const deadline = window.setTimeout(() => setTimedOut(true), 6000)
    deadlineRef.current = deadline
    return () => { cancelled = true; clearTimeout(minimum); clearTimeout(deadline) }
  }, [])

  useEffect(() => {
    if (modelsReady && imageReady) clearTimeout(deadlineRef.current)
  }, [modelsReady, imageReady])

  useEffect(() => {
    document.documentElement.classList.toggle('about-scene-loading', !revealed)
    return () => document.documentElement.classList.remove('about-scene-loading')
  }, [revealed])

  useEffect(() => {
    const root = rootRef.current!
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.about-chapter'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    document.documentElement.classList.add('about-scene-scroll')
    let frame = 0
    let visible = true
    let currentY = 0, targetY = 0, currentX = 0, targetX = 0, currentPointerY = 0, targetPointerY = 0
    let previousTime = 0
    let anchors = sections.map(section => section.getBoundingClientRect().top + window.scrollY)
    let currentChapter = -1

    const animate = (time: number) => {
      frame = 0
      const delta = Math.min(64, time - (previousTime || time - 16))
      previousTime = time
      const ease = 1 - Math.exp(-delta / 110)
      currentY += (targetY - currentY) * ease
      currentX += (targetX - currentX) * ease
      currentPointerY += (targetPointerY - currentPointerY) * ease
      root.style.setProperty('--scene-shift', `${currentY.toFixed(2)}px`)
      root.style.setProperty('--pointer-x', `${currentX.toFixed(2)}px`)
      root.style.setProperty('--pointer-y', `${currentPointerY.toFixed(2)}px`)
      if (Math.abs(targetY - currentY) + Math.abs(targetX - currentX) + Math.abs(targetPointerY - currentPointerY) > .1) schedule()
    }
    const schedule = () => { if (!frame && visible && !reduce.matches) frame = requestAnimationFrame(animate) }
    const update = () => {
      const y = window.scrollY
      let index = 0
      anchors.forEach((anchor, i) => { if (y + window.innerHeight * .5 >= anchor) index = i })
      if (index !== currentChapter) { currentChapter = index; setActive(index) }
      const height = sections[index].offsetHeight
      targetY = reduce.matches ? 0 : Math.max(-1, Math.min(1, (y - anchors[index]) / height)) * 85
      schedule()
    }
    const resize = () => { anchors = sections.map(section => section.getBoundingClientRect().top + window.scrollY); update() }
    const pointer = (event: PointerEvent) => {
      if (!finePointer.matches || reduce.matches || event.pointerType !== 'mouse') return
      targetX = (event.clientX / window.innerWidth - .5) * 22
      targetPointerY = (event.clientY / window.innerHeight - .5) * 14
      schedule()
    }
    const resetPointer = () => { targetX = 0; targetPointerY = 0; schedule() }
    const motionChange = () => {
      if (reduce.matches) {
        cancelAnimationFrame(frame); frame = 0
        currentY = targetY = currentX = targetX = currentPointerY = targetPointerY = 0
        root.style.setProperty('--scene-shift', '0px')
        root.style.setProperty('--pointer-x', '0px')
        root.style.setProperty('--pointer-y', '0px')
      }
      update()
    }
    const visibility = () => {
      visible = !document.hidden
      root.dataset.paused = String(!visible)
      if (!visible) { cancelAnimationFrame(frame); frame = 0; previousTime = 0 }
      else update()
    }
    const observer = new ResizeObserver(resize)
    sections.forEach(section => observer.observe(section))
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', pointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', resetPointer)
    document.addEventListener('visibilitychange', visibility)
    reduce.addEventListener('change', motionChange)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', pointer)
      document.documentElement.removeEventListener('pointerleave', resetPointer)
      document.removeEventListener('visibilitychange', visibility)
      reduce.removeEventListener('change', motionChange)
      document.documentElement.classList.remove('about-scene-scroll')
    }
  }, [])

  const goToChapter = (index: number) => {
    const section = document.getElementById(chapters[index].id)
    section?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }

  return (
    <>
    {!revealed && <div className="about-loading" role="status" aria-live="polite"><Brand /><span>Preparing the scene</span><i aria-hidden="true" /></div>}
    <div ref={rootRef} className="aegis-about" data-chapter={active + 1} data-prepared={revealed} data-timed-out={timedOut} aria-busy={!revealed}>
      <PageMeta title="About AEGIS" description="An open UAV engineering project connecting modular hardware, embedded firmware, and practical browser tools." path="/about" />
      <div className="about-scene-world" aria-hidden="true">
        {chapters.map((chapter, index) => (
          <div key={chapter.id} className={`about-scene${active === index ? ' is-active' : ''}`}>
            <img className="about-scene-backdrop" src={`${assetRoot}${chapter.image}.webp`} alt="" decoding="async" loading={index === 0 ? 'eager' : 'lazy'} />
            <div className="about-scene-atmosphere" />
          </div>
        ))}
        <div className="about-scene-scrim" />
      </div>
      <div className="about-near-plane" aria-hidden="true">
        <Suspense fallback={null}><AboutModels3D chapter={active} onPrepared={onPrepared} eventRoot={rootRef} /></Suspense>
      </div>

      <section inert={!revealed} className={`about-chapter about-hero${active === 0 ? ' is-active' : ''}`} id="about-intro" aria-labelledby="about-title">
        <div className="about-chapter-content">
          <span className="about-eyebrow">AEGIS / THE ENGINEERING PROJECT</span>
          <h1 id="about-title">Built with purpose.<br /><em>Connected by design.</em></h1>
          <p>An open hardware and software ecosystem for UAVs. Flight control, radio systems, and practical tools. One connected project.</p>
          <Link className="btn-primary" to="/products">Explore the ecosystem ↗</Link>
        </div>
        <button className="about-scroll" onClick={() => goToChapter(1)}>Discover our approach <span aria-hidden="true">↓</span></button>
      </section>

      <section inert={!revealed} className={`about-chapter about-philosophy${active === 1 ? ' is-active' : ''}`} id="about-philosophy" aria-labelledby="about-philosophy-title">
        <div className="about-chapter-content">
          <span className="about-eyebrow">01 / OUR APPROACH</span>
          <h2 id="about-philosophy-title">Less friction.<br />More possibility.</h2>
          <p>Reliable, modular components for autonomous flight systems. Each part has a clear purpose. Every connection is designed to be understood.</p>
          <Link className="about-text-link" to="/docs">Explore the architecture <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="about-scene-note" aria-hidden="true"><span>MODULAR BY DESIGN</span><b>Hardware. Firmware. Tools.</b></div>
      </section>

      <section inert={!revealed} className={`about-chapter about-foundations${active === 2 ? ' is-active' : ''}`} id="about-foundations" aria-labelledby="about-foundations-title">
        <div className="about-chapter-content">
          <span className="about-eyebrow">02 / ONE CONNECTED ECOSYSTEM</span>
          <h2 id="about-foundations-title">From the board<br />to the browser.</h2>
          <div className="about-pillars">
            {principles.map(principle => (
              <article className="about-pillar" key={principle.number}>
                <span className="about-pillar-number">{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
                <Link to={principle.to}>{principle.label} <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section inert={!revealed} className={`about-chapter about-next${active === 3 ? ' is-active' : ''}`} id="about-next" aria-labelledby="about-next-title">
        <div className="about-chapter-content">
          <span className="about-eyebrow">03 / START BUILDING</span>
          <h2 id="about-next-title">Build your<br />next connection.</h2>
          <p>Discover AEGIS FC and AEGIS Controller. Read the documentation. Bring your hardware to life with the web tools.</p>
          <div className="about-next-actions">
            <Link className="btn-primary" to="/configurator">Open configurator ↗</Link>
            <Link className="btn-secondary" to="/docs">Browse documentation →</Link>
          </div>
        </div>
      </section>

      {active === 2 && revealed && <span className="about-fc-drag-hint">Drag the board to rotate</span>}
      <nav inert={!revealed} className="about-chapter-rail" aria-label="About chapters">
        <span className="about-chapter-count" aria-hidden="true">0{active + 1} / 04</span>
        {chapters.map((chapter, index) => (
          <button key={chapter.id} type="button" aria-label={`${index + 1}. ${chapter.label}`} aria-current={active === index ? 'step' : undefined} onClick={() => goToChapter(index)}><i /><span>{chapter.label}</span></button>
        ))}
      </nav>
    </div>
    </>
  )
}
