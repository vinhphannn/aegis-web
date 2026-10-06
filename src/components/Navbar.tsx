import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { prefetchPath } from '../lib/prefetch'
import './Navbar.css'
import { Brand } from './Brand'

const items = [
  { to: '/products', label: 'Products', detail: 'Hardware' },
  { to: '/configurator', label: 'Configurator', detail: 'Web tools' },
  { to: '/docs', label: 'Docs', detail: 'Documentation' },
  { to: '/about', label: 'About', detail: 'Our approach' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [hidden, setHidden] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  useEffect(() => { setOpen(false); setHidden(false) }, [location.pathname])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setStuck(y > 40)
      setHidden(!open && !headerRef.current?.contains(document.activeElement) && y > last + 4 && y > window.innerHeight * .8)
      last = y
    }
    const onResize = () => { if (window.innerWidth > 1000) setOpen(false) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    // The mobile sheet acts as a modal: keep keyboard focus inside it.
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>('.main-content, .footer'))
    const previousInert = surfaces.map(el => el.inert)
    surfaces.forEach(el => { el.inert = true })
    document.documentElement.classList.add('aegis-nav-open')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); burgerRef.current?.focus() }
      if (event.key !== 'Tab') return
      const focusable = Array.from(headerRef.current?.querySelectorAll<HTMLElement>('a, button') ?? [])
      const first = focusable[0], last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      surfaces.forEach((el, i) => { el.inert = previousInert[i] })
      document.documentElement.classList.remove('aegis-nav-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)
  return (
    <header ref={headerRef} className={`aegis-nav${stuck ? ' stuck' : ''}${hidden && !open ? ' hide' : ''}${open ? ' menu-open' : ''}`} onFocusCapture={() => setHidden(false)}>
      <Link to="/" className="aegis-nav-brand" aria-label="AEGIS home" onClick={close} onPointerEnter={() => prefetchPath('/')} onFocus={() => prefetchPath('/')}>
        <Brand alt="" />
      </Link>
      <div className="aegis-nav-shade" onClick={close} aria-hidden="true" />
      <nav className="aegis-nav-links" id="aegis-nav-links" aria-label="Main navigation">
        {items.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `aegis-nav-link${isActive ? ' on' : ''}`} aria-label={item.label} onClick={close} onPointerEnter={() => prefetchPath(item.to)} onFocus={() => prefetchPath(item.to)} onTouchStart={() => prefetchPath(item.to)}>
            <span>{item.label}</span><span className="alt" aria-hidden="true">{item.detail}</span>
          </NavLink>
        ))}
        <a className="aegis-nav-link" href="https://github.com/vinhphannn/aegis-web" target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)" onClick={close}>
          <span>GitHub ↗</span><span className="alt" aria-hidden="true">Source ↗</span>
        </a>
      </nav>
      <button ref={burgerRef} type="button" className={`aegis-nav-burger${open ? ' active' : ''}`} aria-label="Toggle navigation menu" aria-expanded={open} aria-controls="aegis-nav-links" onClick={() => { setHidden(false); setOpen(value => !value) }}><i /><i /></button>
    </header>
  )
}
