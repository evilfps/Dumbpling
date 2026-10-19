import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cx, useSpring } from './ios'

function StatusBar({ light, time = '9:41' }: { light?: boolean; time?: string }) {
  return (
    <div className={cx('pointer-events-none absolute inset-x-0 top-0 z-[60] flex h-[54px] items-center justify-between px-[34px] pt-[15px]', light ? 'text-white' : 'text-ink')}>
      <span className="tnum w-[54px] text-center text-[17px] font-semibold tracking-[-0.4px]">{time}</span>
      <span className="flex items-center gap-[7px]" aria-hidden>
        <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" />
          <rect x="5.1" y="5" width="3.2" height="7" rx="1" />
          <rect x="10.2" y="2.5" width="3.2" height="9.5" rx="1" />
          <rect x="15.3" y="0" width="3.2" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.3c2.4 0 4.6.92 6.24 2.43.14.13.36.12.49-.01l1.16-1.17a.35.35 0 0 0 0-.5A11.1 11.1 0 0 0 8.5.1 11.1 11.1 0 0 0 .61 3.05a.35.35 0 0 0 0 .5l1.16 1.17c.13.13.35.14.49.01A9.06 9.06 0 0 1 8.5 2.3Zm0 3.75c1.38 0 2.64.5 3.61 1.35.14.12.35.11.48-.02l1.17-1.17a.35.35 0 0 0 0-.5A7.6 7.6 0 0 0 8.5 3.85a7.6 7.6 0 0 0-5.26 1.96.35.35 0 0 0 0 .5l1.17 1.17c.13.13.34.14.48.02A5.47 5.47 0 0 1 8.5 6.05Zm2.38 2.58a.35.35 0 0 0-.01-.51 3.6 3.6 0 0 0-4.74 0 .35.35 0 0 0-.01.51l2.13 2.13c.14.14.36.14.5 0l2.13-2.13Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" opacity="0.35" />
          <rect x="2" y="2" width="20" height="9" rx="2.4" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.4" />
        </svg>
      </span>
    </div>
  )
}

/** Dynamic Island. Pass content to expand it, as an ActivityKit alert does. */
function Island({ content }: { content?: ReactNode }) {
  const liquid = useSpring('liquid')
  const open = Boolean(content)
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[11px] z-[70] flex justify-center" aria-live="polite">
      <motion.div
        className="overflow-hidden bg-black"
        initial={false}
        animate={{ width: open ? 369 : 125, height: open ? 76 : 37, borderRadius: open ? 38 : 18.5 }}
        transition={liquid}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              className="flex h-[76px] items-center gap-3 px-5 text-white"
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)', transition: { delay: 0.12, duration: 0.3 } }}
              exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 0.15 } }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/** iPhone 16 logical canvas: 393 × 852 pt. Content starts below the 54 pt status bar. */
export function Phone({
  children,
  label,
  wallpaper,
  light,
  island,
  time,
  grid,
}: {
  children: ReactNode
  label?: string
  wallpaper?: string
  light?: boolean
  island?: ReactNode
  time?: string
  grid?: boolean
}) {
  return (
    <figure className="flex flex-col items-center gap-6">
      <div className="rounded-[64px] bg-[linear-gradient(145deg,#3a3a3d,#141415_40%,#2a2a2c)] p-[2px] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.45)]">
        <div className="rounded-[62px] bg-black p-[10px]">
          <div data-screen className="relative isolate flex h-[852px] w-[393px] flex-col overflow-hidden rounded-[52px] bg-canvas">
            {wallpaper && <img src={wallpaper} alt="" className="absolute inset-0 size-full object-cover" draggable={false} />}
            <Island content={island} />
            <StatusBar light={light} time={time} />
            {children}
            {grid && <LayoutGrid />}
            <div className={cx('pointer-events-none absolute bottom-[8px] left-1/2 z-[70] h-[5px] w-[139px] -translate-x-1/2 rounded-full', light ? 'bg-white' : 'bg-ink')} aria-hidden />
          </div>
        </div>
      </div>
      {label && <figcaption className="text-footnote text-ink-2">{label}</figcaption>}
    </figure>
  )
}

/** Key lines every screen is built on: 16 pt edges, 20 pt titles, 32 pt content, centre axis. */
function LayoutGrid() {
  const lines = [
    { x: 16, c: 'bg-[#ff3b6b]' },
    { x: 20, c: 'bg-[#2f7bff]' },
    { x: 32, c: 'bg-[#2f7bff]/50' },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 z-[65]" aria-hidden>
      <div className="absolute inset-y-0 left-0 w-4 bg-[#ff3b6b]/[0.07]" />
      <div className="absolute inset-y-0 right-0 w-4 bg-[#ff3b6b]/[0.07]" />
      {lines.map((l) => (
        <span key={l.x}>
          <span className={`absolute inset-y-0 w-px ${l.c}`} style={{ left: l.x }} />
          <span className={`absolute inset-y-0 w-px ${l.c}`} style={{ right: l.x }} />
        </span>
      ))}
      <span className="absolute inset-y-0 left-1/2 w-px border-l border-dashed border-[#ff3b6b]/40" />
      <span className="absolute inset-x-0 top-[54px] h-px bg-[#ff3b6b]/30" />
      <span className="absolute inset-x-0 bottom-[34px] h-px bg-[#ff3b6b]/30" />
    </div>
  )
}
