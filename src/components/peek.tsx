import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react'
import { Icon, type IconName } from './icons'
import { cx, useReduce, useSpring } from './ios'
import { motion as m } from '../tokens'

export type PeekAction = { label: string; icon: IconName; tone?: 'alert'; onSelect?: () => void }
type Rect = { x: number; y: number; w: number; h: number }

const HOLD = 420
const SHRINK = 0.95
const MENU_W = 250
const ROW = 44

/**
 * Press and hold to peek, as .contextMenu { } preview: { } does on iOS.
 * The content gathers under the finger, lifts into a larger preview above a blurred screen,
 * and a glass menu blooms beneath it. Keep holding and slide onto an action to choose it,
 * tap the preview to open it, or tap outside to put it back. Right-click also opens it.
 * Renders into the nearest [data-screen] so the preview stays inside the phone.
 */
export function Peek({
  children,
  preview,
  ratio,
  title,
  actions,
  onCommit,
  radius = 14,
  className,
}: {
  children: ReactNode
  preview: ReactNode
  /** Width ÷ height of the preview. */
  ratio: number
  title?: ReactNode
  actions: PeekAction[]
  onCommit?: () => void
  radius?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scale = useMotionValue(1)
  const timer = useRef<number | undefined>(undefined)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const suppress = useRef(false)
  const [state, setState] = useState<{ root: HTMLElement; from: Rect; rest: Rect; W: number; H: number } | null>(null)
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hi, setHi] = useState<number | null>(null)
  const [committed, setCommitted] = useState(false)
  const reduce = useReduce()
  const snappy = useSpring('snappy')

  const release = () => animate(scale, 1, snappy)
  const cancel = () => {
    window.clearTimeout(timer.current)
    timer.current = undefined
    origin.current = null
    release()
  }

  const lift = (dragging: boolean) => {
    const el = ref.current
    const root = el?.closest<HTMLElement>('[data-screen]')
    if (!el || !root) return
    const rr = root.getBoundingClientRect()
    const k = rr.width / root.offsetWidth || 1
    const er = el.getBoundingClientRect()
    const from = { x: (er.left - rr.left) / k, y: (er.top - rr.top) / k, w: er.width / k, h: er.height / k }
    const s = scale.get()
    const rest = { w: from.w / s, h: from.h / s, x: from.x - (from.w / s - from.w) / 2, y: from.y - (from.h / s - from.h) / 2 }
    setState({ root, from, rest, W: root.offsetWidth, H: root.offsetHeight })
    setOpen(true)
    setHidden(true)
    setHi(null)
    setCommitted(false)
    scale.set(1)
    suppress.current = dragging
    navigator.vibrate?.(8)
  }

  const close = () => setOpen(false)
  const choose = (i: number) => {
    actions[i].onSelect?.()
    close()
  }

  // While the finger is still down after the peek opens, slide onto an action to pick it.
  useEffect(() => {
    if (!open || !suppress.current) return
    const at = (e: PointerEvent) => {
      const item = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>('[data-peek-item]')
      return item ? Number(item.dataset.peekItem) : null
    }
    const move = (e: PointerEvent) => setHi(at(e))
    const up = (e: PointerEvent) => {
      const i = at(e)
      if (i !== null) choose(i)
      setHi(null)
      window.setTimeout(() => (suppress.current = false))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  let target: Rect | null = null
  let menu: { x: number; y: number; origin: string } | null = null
  if (state) {
    const menuH = (title ? 40 : 0) + actions.length * ROW
    const maxW = state.W - 48
    const maxH = state.H - 140 - menuH - 12
    let w = maxW
    let h = w / ratio
    if (h > maxH) {
      h = maxH
      w = h * ratio
    }
    const y = Math.max(72, (state.H - (h + 12 + menuH)) / 2)
    target = { x: (state.W - w) / 2, y, w, h }
    const left = state.from.x + state.from.w / 2 < state.W / 2
    menu = { x: left ? target.x : target.x + w - MENU_W, y: y + h + 12, origin: left ? 'top left' : 'top right' }
  }

  const box = (r: Rect, br: number) => ({ left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: br })
  const lifted = { type: 'spring' as const, stiffness: 300, damping: 26 }

  return (
    <>
      <motion.div
        ref={ref}
        className={cx('select-none [-webkit-touch-callout:none]', className)}
        style={{ scale, opacity: hidden ? 0 : 1 }}
        onPointerDown={(e) => {
          if (e.button !== 0 || open) return
          origin.current = { x: e.clientX, y: e.clientY }
          if (!reduce) animate(scale, SHRINK, { duration: HOLD / 1000, ease: [0.3, 0, 0.6, 1] })
          timer.current = window.setTimeout(() => {
            timer.current = undefined
            lift(true)
          }, HOLD)
        }}
        onPointerMove={(e) => {
          const o = origin.current
          if (o && timer.current && Math.hypot(e.clientX - o.x, e.clientY - o.y) > 10) cancel()
        }}
        onPointerUp={() => timer.current && cancel()}
        onPointerCancel={cancel}
        onPointerLeave={() => timer.current && cancel()}
        onContextMenu={(e) => {
          e.preventDefault()
          if (!open) {
            cancel()
            lift(false)
          }
        }}
        onClickCapture={(e) => {
          if (suppress.current || open) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
      >
        {children}
      </motion.div>

      {state &&
        createPortal(
          <AnimatePresence onExitComplete={() => setHidden(false)}>
            {open && target && menu && (
              <div key="peek" className="absolute inset-0 z-[58]" role="dialog" aria-modal aria-label="Preview">
                <motion.div
                  className="absolute inset-0 bg-canvas/35 backdrop-blur-[22px] backdrop-saturate-150"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.28 } }}
                  transition={{ duration: 0.3 }}
                  onClick={close}
                />
                <motion.button
                  type="button"
                  aria-label="Open"
                  className="absolute overflow-hidden shadow-[0_30px_70px_-20px_rgb(0_0_0/0.45)]"
                  initial={reduce ? { ...box(target, 22), opacity: 0 } : box(state.from, radius)}
                  animate={{ ...box(target, 22), opacity: 1 }}
                  exit={reduce || committed ? { opacity: 0, transition: { duration: 0.16 } } : { ...box(state.rest, radius), transition: m.smooth }}
                  transition={reduce ? m.fade : lifted}
                  onClick={() => {
                    // Fade rather than fly home, so the opened view can grow from the source.
                    setCommitted(true)
                    setHidden(false)
                    requestAnimationFrame(() => {
                      setOpen(false)
                      onCommit?.()
                    })
                  }}
                >
                  {preview}
                </motion.button>
                <motion.div
                  role="menu"
                  className="lg absolute overflow-hidden rounded-[22px]"
                  style={{ left: menu.x, top: menu.y, width: MENU_W, transformOrigin: menu.origin }}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.7, filter: 'blur(6px)', transition: { duration: 0.18 } }}
                  transition={reduce ? m.fade : { ...lifted, delay: 0.05 }}
                >
                  {title && <div className="relative z-[2] flex h-10 items-center border-b-[0.5px] border-line px-4 text-footnote text-ink-2">{title}</div>}
                  {actions.map((a, i) => (
                    <button
                      key={a.label}
                      type="button"
                      role="menuitem"
                      data-peek-item={i}
                      onClick={() => choose(i)}
                      onPointerEnter={() => setHi(i)}
                      onPointerLeave={() => setHi(null)}
                      className={cx(
                        'relative z-[2] flex h-11 w-full items-center justify-between px-4 text-body transition-colors duration-100',
                        a.tone === 'alert' ? 'text-alert' : 'text-ink',
                        hi === i && 'bg-[color-mix(in_oklab,var(--ink)_9%,transparent)]',
                        i > 0 && 'border-t-[0.5px] border-line',
                      )}
                    >
                      {a.label}
                      <Icon name={a.icon} size={19} weight="medium" />
                    </button>
                  ))}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          state.root,
        )}
    </>
  )
}
