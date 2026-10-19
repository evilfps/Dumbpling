import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Overview } from './sections/Overview'
import { Typography } from './sections/Typography'
import { Colour } from './sections/Colour'
import { Iconography } from './sections/Iconography'
import { LiquidGlass } from './sections/Glass'
import { Layout } from './sections/Layout'
import { Components } from './sections/Components'
import { Messages } from './sections/Messages'
import { Motion } from './sections/Motion'
import { Craft } from './sections/Craft'
import { Hydration } from './sections/Hydration'
import { Cycle } from './sections/Cycle'
import { GallerySection } from './sections/Gallery'
import { Widgets } from './sections/Widgets'
import { Screens } from './sections/Screens'
import { Guidelines } from './sections/Guidelines'
import { Tokens } from './sections/Tokens'
import { LogoMark } from './components/Logo'
import { Icon } from './components/icons'
import { cx, useSpring } from './components/ios'

const nav = [
  { id: 'typography', label: 'Type' },
  { id: 'colour', label: 'Colour' },
  { id: 'icons', label: 'Icons' },
  { id: 'glass', label: 'Glass' },
  { id: 'space', label: 'Space' },
  { id: 'components', label: 'Components' },
  { id: 'messages', label: 'Messages' },
  { id: 'motion', label: 'Motion' },
  { id: 'craft', label: 'Craft' },
  { id: 'water', label: 'Water' },
  { id: 'cycle', label: 'Cycle' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'widgets', label: 'Widgets' },
  { id: 'screens', label: 'Screens' },
  { id: 'tokens', label: 'SwiftUI' },
]

type Theme = 'light' | 'dark'
const KEY = 'dumbpling-appearance'

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(KEY) as Theme | null) ?? 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(KEY, theme)
  }, [theme])
  return [theme, setTheme] as const
}

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = ['overview', ...nav.map((n) => n.id), 'guidelines'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-30% 0px -65% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export default function App() {
  const [theme, setTheme] = useTheme()
  const active = useActiveSection()
  const snappy = useSpring('snappy')

  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="sticky top-0 z-50">
        <div className="absolute inset-0 bg-page/72 backdrop-blur-2xl backdrop-saturate-150" />
        <span className="hairline absolute inset-x-0 bottom-0 bg-line" />
        <div className="relative mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-6">
          <a href="#overview" className="flex shrink-0 items-center gap-2.5" aria-label="Dumbpling, back to top">
            <LogoMark size={18} />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">Dumbpling</span>
          </a>
          <nav className="no-scrollbar -mx-2 flex flex-1 justify-center overflow-x-auto">
            <ul className="flex items-center">
              {nav.map((n) => {
                const on = active === n.id
                return (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className={cx('relative block whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] tracking-[-0.01em] transition-colors', on ? 'text-ink' : 'text-ink-2 hover:text-ink')}>
                      {on && <motion.span layoutId="nav-pill" transition={snappy} className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--ink)_7%,transparent)]" />}
                      <span className="relative">{n.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance'}
            className="relative grid size-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-[color-mix(in_oklab,var(--ink)_7%,transparent)]"
          >
            <motion.span key={theme} initial={{ opacity: 0, rotate: -30, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={snappy}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} weight="medium" />
            </motion.span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <Overview />
        <Typography />
        <Colour />
        <Iconography />
        <LiquidGlass />
        <Layout />
        <Components />
        <Messages />
        <Motion />
        <Craft />
        <Hydration />
        <Cycle />
        <GallerySection />
        <Widgets />
        <Screens />
        <Guidelines />
        <Tokens />
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-10 text-footnote text-ink-3">
          <span className="flex items-center gap-2.5">
            <LogoMark size={14} /> Dumbpling Design System 2.0
          </span>
          <span>All values come from src/tokens.ts and src/index.css</span>
        </footer>
      </main>
    </div>
  )
}
