import { createContext, useContext, useEffect, useId, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { motion as m, feelings, type SpringKey } from '../tokens'
import { Icon, type IconName } from './icons'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/* ---------- Motion preferences ---------- */

/** Lets this reference simulate the iOS Reduce Motion setting. */
export const ReduceMotionContext = createContext(false)

export function useReduce() {
  const system = useReducedMotion()
  const simulated = useContext(ReduceMotionContext)
  return Boolean(system) || simulated
}

/** The spring for a token, or a cross-fade when Reduce Motion is on. */
export function useSpring(key: SpringKey) {
  return useReduce() ? m.fade : m[key]
}

/* ---------- Buttons ---------- */

type Variant = 'primary' | 'secondary' | 'glass' | 'plain' | 'destructive'
type Size = 'lg' | 'md' | 'sm'

const variantClass: Record<Variant, string> = {
  primary: '',
  secondary: 'bg-surface-2 text-ink',
  glass: 'lg text-ink',
  plain: 'text-ink',
  destructive: 'bg-surface-2 text-alert',
}
const primaryStyle: CSSProperties = { backgroundImage: 'var(--btn-bg)', color: 'var(--btn-fg)', boxShadow: 'var(--btn-shadow)' }

const sizeClass: Record<Size, string> = {
  lg: 'h-[52px] px-6 gap-2 rounded-md text-headline',
  md: 'h-11 px-5 gap-1.5 rounded-[13px] text-subhead font-semibold',
  sm: 'h-[34px] px-4 gap-1 rounded-full text-subhead font-semibold',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  icon,
  full,
  disabled,
  children,
  onClick,
  className,
}: {
  variant?: Variant
  size?: Size
  icon?: IconName
  full?: boolean
  disabled?: boolean
  children?: ReactNode
  onClick?: () => void
  className?: string
}) {
  const spring = useSpring('snappy')
  const reduce = useReduce()
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : reduce ? { opacity: 0.7 } : { scale: 0.97, opacity: 0.86 }}
      transition={spring}
      style={variant === 'primary' ? primaryStyle : undefined}
      className={cx(
        'inline-flex select-none items-center justify-center whitespace-nowrap',
        variantClass[variant],
        sizeClass[size],
        full && 'w-full',
        disabled && 'pointer-events-none opacity-35',
        className,
      )}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} weight="semibold" />}
      {children}
    </motion.button>
  )
}

/** Circular icon button. The visible shape may be small; the hit area is always 44 pt. */
export function IconButton({
  icon,
  label,
  size = 36,
  variant = 'fill',
  onClick,
  filled,
  className,
}: {
  icon: IconName
  label: string
  size?: number
  variant?: 'fill' | 'glass' | 'clear' | 'plain' | 'primary'
  onClick?: () => void
  filled?: boolean
  className?: string
}) {
  const spring = useSpring(variant === 'glass' || variant === 'clear' ? 'liquid' : 'snappy')
  const pad = Math.max(0, (44 - size) / 2)
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: variant === 'glass' || variant === 'clear' ? 1.08 : 0.9 }}
      transition={spring}
      className={cx('relative grid shrink-0 place-items-center rounded-full', className)}
      style={{ width: size, height: size, ...(variant === 'primary' ? primaryStyle : {}) }}
    >
      <span className="absolute rounded-full" style={{ inset: -pad }} aria-hidden />
      <span
        className={cx(
          'absolute inset-0 rounded-full',
          variant === 'fill' && 'bg-surface-2',
          variant === 'glass' && 'lg',
          variant === 'clear' && 'lg lg-clear',
        )}
      />
      <span className={cx('relative z-[2]', variant === 'primary' ? '' : variant === 'clear' ? 'text-white' : 'text-ink')}>
        <Icon name={icon} size={Math.round(size * 0.52)} weight="medium" filled={filled} />
      </span>
    </motion.button>
  )
}

/* ---------- Switch (51 × 31). The thumb stretches while pressed, as UISwitch does. ---------- */

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  const [pressed, setPressed] = useState(false)
  const spring = useSpring('snappy')
  const w = pressed ? 33 : 27
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className="relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300 ease-out"
      style={{ background: on ? 'var(--switch-on)' : 'var(--fill)' }}
    >
      <motion.span
        className="absolute left-[2px] top-[2px] block h-[27px] rounded-full shadow-[0_3px_8px_rgb(0_0_0/0.15),0_3px_1px_rgb(0_0_0/0.06)] transition-[background-color] duration-300"
        style={{ background: on ? 'var(--knob-on)' : '#ffffff' }}
        initial={false}
        animate={{ width: w, x: on ? 47 - w : 0 }}
        transition={spring}
      />
    </button>
  )
}

/* ---------- Segmented control ---------- */

export function Segmented<T extends string>({ options, value, onChange, className }: { options: readonly T[]; value: T; onChange: (v: T) => void; className?: string }) {
  const id = useId()
  const spring = useSpring('snappy')
  return (
    <div role="tablist" className={cx('flex h-8 rounded-[9px] bg-[color-mix(in_oklab,var(--ink)_7%,transparent)] p-[2px]', className)}>
      {options.map((o) => {
        const on = o === value
        return (
          <button key={o} type="button" role="tab" aria-selected={on} onClick={() => onChange(o)} className="relative flex-1 px-3 text-footnote text-ink">
            {on && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={spring}
                className="absolute inset-0 rounded-[7px] bg-surface shadow-[0_3px_8px_rgb(0_0_0/0.1),0_3px_1px_rgb(0_0_0/0.03)] dark:bg-[#5b5b61]"
              />
            )}
            <span className={cx('relative transition-[font-weight]', on ? 'font-semibold' : 'font-medium')}>{o}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Text field ---------- */

export function TextField({ label, helper, error, className, ...rest }: ComponentProps<'input'> & { label?: string; helper?: string; error?: string }) {
  const id = useId()
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={id} className="px-1 text-footnote text-ink-2">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        {...rest}
        className={cx(
          'h-[52px] w-full rounded-md bg-surface-2 px-4 text-body text-ink caret-ink outline-none transition-shadow duration-200 placeholder:text-ink-3',
          error ? 'shadow-[inset_0_0_0_1.5px_var(--alert)]' : 'focus:shadow-[inset_0_0_0_1.5px_var(--ink)]',
        )}
      />
      {(error || helper) && <p className={cx('px-1 text-footnote', error ? 'text-alert' : 'text-ink-3')}>{error ?? helper}</p>}
    </div>
  )
}

/* ---------- Lists ---------- */

export function ListGroup({ header, footer, children, className }: { header?: string; footer?: string; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      {header && <h4 className="mb-2 px-4 text-footnote text-ink-2">{header}</h4>}
      <div className="overflow-hidden rounded-lg bg-surface">{children}</div>
      {footer && <p className="mt-2 px-4 text-footnote text-ink-3">{footer}</p>}
    </section>
  )
}

export function ListRow({
  leading,
  title,
  subtitle,
  detail,
  trailing,
  chevron = true,
  inset = 16,
  last,
  onClick,
}: {
  leading?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  detail?: ReactNode
  trailing?: ReactNode
  chevron?: boolean
  inset?: number
  last?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cx('relative flex min-h-[52px] items-center gap-3 bg-surface px-4 py-2.5', onClick && 'cursor-pointer active:bg-fill/60')}
    >
      {leading}
      <div className="min-w-0 flex-1">
        <div className="truncate text-body text-ink">{title}</div>
        {subtitle && <div className="truncate text-subhead text-ink-2">{subtitle}</div>}
      </div>
      {detail && <span className="tnum text-body text-ink-2">{detail}</span>}
      {trailing ?? (chevron && <Icon name="chevronRight" size={16} weight="semibold" className="-mr-1 text-ink-3" />)}
      {!last && <span className="hairline absolute bottom-0 right-0 bg-line" style={{ left: inset }} />}
    </div>
  )
}

/** A row with trailing swipe actions, matching .swipeActions(edge: .trailing). */
export function SwipeRow({ children, actions }: { children: ReactNode; actions: { label: string; tone?: 'ink' | 'alert'; onClick: () => void }[] }) {
  const x = useMotionValue(0)
  const width = actions.length * 76
  const reveal = useTransform(x, [-width, -24, 0], [1, 0.4, 0])
  const settle = (to: number) => animate(x, to, m.smooth)
  return (
    <div className="relative overflow-hidden">
      <motion.div className="absolute inset-y-0 right-0 flex" style={{ opacity: reveal, width }}>
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => {
              settle(0)
              a.onClick()
            }}
            className={cx('flex-1 text-subhead font-semibold', a.tone === 'alert' ? 'bg-alert text-white' : 'bg-ink text-page')}
          >
            {a.label}
          </button>
        ))}
      </motion.div>
      <motion.div
        drag="x"
        dragDirectionLock
        dragMomentum={false}
        dragConstraints={{ left: -width, right: 0 }}
        dragElastic={{ left: 0.12, right: 0.04 }}
        onDragEnd={(_, info) => settle(info.offset.x < -40 || info.velocity.x < -400 ? -width : 0)}
        style={{ x }}
        className="relative touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ---------- Avatars (Contacts-style monogram) ---------- */

export function Avatar({ initials, size = 40, ring }: { initials: string; size?: number; ring?: string }) {
  return (
    <span
      className="grid shrink-0 select-none place-items-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundImage: 'var(--avatar)',
        fontSize: size * 0.4,
        letterSpacing: '-0.02em',
        boxShadow: ring ? `0 0 0 2px ${ring}` : undefined,
      }}
    >
      {initials}
    </span>
  )
}

export function AvatarPair({ size = 40, ring = 'var(--canvas)' }: { size?: number; ring?: string }) {
  return (
    <span className="flex items-center">
      <Avatar initials="A" size={size} ring={ring} />
      <span style={{ marginLeft: -size * 0.3 }}>
        <Avatar initials="J" size={size} ring={ring} />
      </span>
    </span>
  )
}

/* ---------- Messages ---------- */

export type Partner = 'you' | 'them'
export type Reaction = 'heart' | 'Ha' | '!!' | '?'
const reactions: Reaction[] = ['heart', 'Ha', '!!', '?']

/** iMessage tail, drawn as the classic two-circle cut-out (outer r15, inner r10). */
function Tail({ mine }: { mine: boolean }) {
  return (
    <svg
      width="30"
      height="20"
      viewBox="-20 -20 30 20"
      className="absolute bottom-0"
      style={mine ? { right: -10 } : { left: -10, transform: 'scaleX(-1)' }}
      aria-hidden
    >
      <path d="M-12 -20H0V-10A10 10 0 0 0 8 -0.2V0H3A15 15 0 0 1 -12 -15Z" fill={mine ? 'var(--bubble-me)' : 'var(--bubble-them)'} />
    </svg>
  )
}

function ReactionGlyph({ r, size = 15 }: { r: Reaction; size?: number }) {
  if (r === 'heart') return <Icon name="heart" filled size={size + 1} />
  return <span className="text-[13px] font-bold leading-none tracking-[-0.02em]">{r}</span>
}

export function Bubble({
  from,
  children,
  tail = true,
  reactable,
  reaction: initialReaction,
}: {
  from: Partner
  children: ReactNode
  tail?: boolean
  reactable?: boolean
  reaction?: Reaction
}) {
  const mine = from === 'you'
  const [menu, setMenu] = useState(false)
  const [reaction, setReaction] = useState<Reaction | undefined>(initialReaction)
  const [holding, setHolding] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const snappy = useSpring('snappy')
  const smooth = useSpring('smooth')

  const start = () => {
    if (!reactable) return
    setHolding(true)
    timer.current = window.setTimeout(() => {
      setHolding(false)
      setMenu(true)
    }, 380)
  }
  const cancel = () => {
    setHolding(false)
    window.clearTimeout(timer.current)
  }

  return (
    <div className={cx('relative flex', mine ? 'justify-end' : 'justify-start', menu && 'z-30')}>
      {menu && <div className="fixed inset-0 z-0" onClick={() => setMenu(false)} />}
      <motion.div
        className={cx('relative max-w-[74%]', reactable && 'cursor-default select-none')}
        style={{ transformOrigin: mine ? '100% 100%' : '0% 100%' }}
        animate={{ scale: holding ? 0.96 : menu ? 1.03 : 1 }}
        transition={holding ? { duration: 0.38, ease: [0.4, 0, 1, 1] } : snappy}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onContextMenu={(e) => reactable && e.preventDefault()}
      >
        <div
          className={cx('relative z-[1] rounded-[18px] px-3 py-[7px] text-body', menu && 'shadow-e3')}
          style={
            mine
              ? {
                  backgroundColor: 'var(--bubble-me)',
                  backgroundImage: 'linear-gradient(180deg, var(--bubble-me-top), var(--bubble-me))',
                  backgroundSize: '100% 40px',
                  backgroundRepeat: 'no-repeat',
                  color: 'var(--bubble-me-fg)',
                }
              : { background: 'var(--bubble-them)', color: 'var(--ink)' }
          }
        >
          {children}
        </div>
        {tail && <Tail mine={mine} />}

        <AnimatePresence>
          {reaction && !menu && (
            <motion.span
              key={reaction}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={snappy}
              className={cx(
                'absolute -top-[14px] z-[2] grid size-[30px] place-items-center rounded-full',
                mine ? '-left-[14px] bg-surface-2 text-ink' : '-right-[14px]',
              )}
              style={{
                boxShadow: '0 0 0 2px var(--chat-bg, var(--canvas))',
                ...(mine ? {} : { backgroundImage: 'var(--btn-bg)', color: 'var(--btn-fg)' }),
              }}
            >
              <ReactionGlyph r={reaction} />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.92, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, transition: m.fade }}
              transition={smooth}
              style={{ transformOrigin: mine ? '100% 100%' : '0% 100%' }}
              className={cx(
                'lg absolute bottom-[calc(100%+10px)] z-[3] flex gap-1 rounded-full p-1',
                mine ? 'right-0' : 'left-0',
              )}
            >
              {reactions.map((r) => (
                <motion.button
                  key={r}
                  type="button"
                  aria-label={r === 'heart' ? 'Love' : r}
                  whileTap={{ scale: 0.85 }}
                  transition={snappy}
                  onClick={() => {
                    setReaction(reaction === r ? undefined : r)
                    setMenu(false)
                  }}
                  className={cx('grid size-9 place-items-center rounded-full text-ink transition-colors', reaction === r ? 'bg-ink text-page' : 'hover:bg-fill/70')}
                >
                  <ReactionGlyph r={r} size={17} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function TypingBubble() {
  return (
    <div className="flex justify-start pl-1" aria-label="Jamie is typing">
      <div className="relative">
        <div className="flex h-[38px] items-center gap-[5px] rounded-[19px] bg-[var(--bubble-them)] px-[14px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-ink-2" style={{ animation: `typing 1.4s ${i * 0.18}s ease-in-out infinite` }} />
          ))}
        </div>
        <span className="absolute -bottom-[1px] -left-[1px] size-[11px] rounded-full bg-[var(--bubble-them)]" />
        <span className="absolute -bottom-[6px] -left-[6px] size-[5px] rounded-full bg-[var(--bubble-them)]" />
      </div>
    </div>
  )
}

export function Composer({ onSend, onCamera }: { onSend?: (t: string) => void; onCamera?: () => void }) {
  const [text, setText] = useState('')
  const snappy = useSpring('snappy')
  const has = text.trim().length > 0
  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!has) return
        onSend?.(text.trim())
        setText('')
      }}
    >
      <IconButton icon="camera" label="Send a snap" size={36} variant="glass" onClick={onCamera} />
      <div className="flex min-h-9 flex-1 items-center rounded-[18px] bg-surface pl-3.5 pr-1 shadow-[inset_0_0_0_0.5px_var(--line)] dark:bg-surface-2/60">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
          aria-label="Message"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-body text-ink caret-ink outline-none placeholder:text-ink-3"
        />
        <AnimatePresence mode="popLayout" initial={false}>
          {has ? (
            <motion.button
              key="send"
              type="submit"
              aria-label="Send"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={snappy}
              className="grid size-7 place-items-center rounded-full"
              style={primaryStyle}
            >
              <Icon name="arrowUp" size={16} weight="bold" />
            </motion.button>
          ) : (
            <motion.span key="mic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={m.fade} className="grid size-7 place-items-center text-ink-3">
              <Icon name="mic" size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}

/* ---------- Floating tab bar (iOS 26) ---------- */

export const appTabs: { label: string; icon: IconName }[] = [
  { label: 'Today', icon: 'today' },
  { label: 'Messages', icon: 'messages' },
  { label: 'Gallery', icon: 'gallery' },
  { label: 'Plans', icon: 'plans' },
]

const TAB_W = 76
const TAB_PAD = 4

/**
 * Press and drag across the bar: the selection lifts into a glass lens that follows
 * the finger, then drops into the nearest tab. Minimises to the current tab on scroll.
 * SwiftUI: TabView { … }.tabBarMinimizeBehavior(.onScrollDown)
 */
export function TabBar({
  active,
  onChange,
  floating = true,
  minimized = false,
  accessory,
}: {
  active: string
  onChange?: (l: string) => void
  floating?: boolean
  minimized?: boolean
  accessory?: ReactNode
}) {
  const liquid = useSpring('liquid')
  const reduce = useReduce()
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const tabs = minimized ? appTabs.filter((t) => t.label === active) : appTabs
  const index = Math.max(0, tabs.findIndex((t) => t.label === active))
  const max = TAB_PAD + (tabs.length - 1) * TAB_W

  const xAt = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect()
    return Math.min(max, Math.max(TAB_PAD, clientX - r.left - TAB_W / 2))
  }
  const release = () => {
    if (drag === null) return
    const i = Math.round((drag - TAB_PAD) / TAB_W)
    onChange?.(tabs[i].label)
    setDrag(null)
  }

  const bar = (
    <motion.div
      layout
      transition={liquid}
      ref={ref}
      className="lg pointer-events-auto relative flex h-[62px] touch-none items-center rounded-full px-1"
      onPointerDown={(e) => {
        if (minimized) return
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        setDrag(xAt(e.clientX))
      }}
      onPointerMove={(e) => drag !== null && setDrag(xAt(e.clientX))}
      onPointerUp={release}
      onPointerCancel={() => setDrag(null)}
    >
      <motion.span
        aria-hidden
        className={cx('absolute left-0 top-[4px] h-[54px] rounded-full', drag !== null ? 'lg' : 'bg-[color-mix(in_oklab,var(--ink)_8%,transparent)]')}
        style={{ width: TAB_W }}
        initial={false}
        animate={{ x: drag ?? TAB_PAD + index * TAB_W, scale: drag !== null && !reduce ? 1.14 : 1 }}
        transition={drag !== null ? { type: 'spring', stiffness: 900, damping: 60 } : liquid}
      />
      {tabs.map(({ label, icon }) => {
        const on = label === active
        return (
          <motion.button
            layout="position"
            key={label}
            type="button"
            onClick={() => onChange?.(label)}
            aria-current={on ? 'page' : undefined}
            className={cx('relative z-[2] flex h-[54px] flex-col items-center justify-center gap-[2px] transition-colors duration-200', on ? 'text-ink' : 'text-ink-2')}
            style={{ width: TAB_W }}
          >
            <Icon name={icon} size={24} filled={on} weight={on ? 'medium' : 'regular'} />
            <span className="text-[10px] font-semibold leading-3 tracking-[0.1px]">{label}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
  const group = (
    <div className="flex items-center gap-3">
      {bar}
      {accessory}
    </div>
  )
  if (!floating) return group
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-[30px] pt-10">
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" aria-hidden />
      <div className="pointer-events-auto relative">{group}</div>
    </div>
  )
}

/* ---------- Rolling numbers: .contentTransition(.numericText(value:)) ---------- */

export function NumberText({ value, format = (n) => n.toLocaleString('en-GB'), className }: { value: number; format?: (n: number) => string; className?: string }) {
  const prev = useRef(value)
  const dir = value >= prev.current ? 1 : -1
  useEffect(() => {
    prev.current = value
  }, [value])
  const smooth = useSpring('smooth')
  const reduce = useReduce()
  const str = format(value)
  const chars = str.split('')
  return (
    <span className={cx('tnum inline-flex', className)} aria-label={str} role="text">
      {chars.map((c, i) => (
        <span key={chars.length - i} className="relative inline-block" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={c}
              className="inline-block"
              initial={reduce ? { opacity: 0 } : { y: `${dir * 60}%`, opacity: 0, filter: 'blur(3px)' }}
              animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { y: `${-dir * 60}%`, opacity: 0, filter: 'blur(3px)' }}
              transition={smooth}
            >
              {c}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

/* ---------- Feelings ---------- */

export function FeelingOrb({ feeling, size = 160, glow = true }: { feeling: string; size?: number; glow?: boolean }) {
  const gentle = useSpring('gentle')
  const reduce = useReduce()
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {glow &&
        feelings.map((f) => (
          <motion.div
            key={f.key}
            className="absolute inset-[6%] rounded-full"
            style={{ background: f.a, filter: `blur(${size * 0.2}px)` }}
            initial={false}
            animate={{ opacity: f.key === feeling ? 0.55 : 0 }}
            transition={gentle}
          />
        ))}
      <div className="absolute inset-0 overflow-hidden rounded-full" style={{ animation: reduce ? undefined : 'drift 9s ease-in-out infinite' }}>
        {feelings.map((f) => (
          <motion.div
            key={f.key}
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 34% 28%, ${f.b} 0%, ${f.a} 46%, ${f.deep} 100%)` }}
            initial={false}
            animate={{ opacity: f.key === feeling ? 1 : 0 }}
            transition={gentle}
          />
        ))}
        <div className="absolute inset-0" style={{ background: 'conic-gradient(from 210deg, transparent 0deg, rgb(255 255 255 / 0.35) 70deg, transparent 150deg)', mixBlendMode: 'soft-light' }} />
      </div>
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 1px 1px rgb(255 255 255 / 0.55), inset 0 -10px 24px rgb(0 0 0 / 0.08)' }} />
    </div>
  )
}

export function FeelingPicker({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const snappy = useSpring('snappy')
  const id = useId()
  return (
    <div role="radiogroup" aria-label="How are you feeling?" className="flex justify-between">
      {feelings.map((f) => {
        const on = f.key === value
        return (
          <motion.button
            key={f.key}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={f.name}
            onClick={() => onChange(f.key)}
            whileTap={{ scale: 0.9 }}
            transition={snappy}
            className="relative grid size-11 place-items-center"
          >
            {on && <motion.span layoutId={`feel-${id}`} transition={snappy} className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1.5px_var(--ink)]" />}
            <span className="size-8 rounded-full" style={{ background: `radial-gradient(circle at 34% 28%, ${f.b}, ${f.a} 50%, ${f.deep})` }} />
          </motion.button>
        )
      })}
    </div>
  )
}

/* ---------- Sheet ---------- */

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const smooth = useSpring('smooth')
  const reduce = useReduce()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="absolute inset-0 z-40 bg-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={m.fade} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            className="lg lg-sheet absolute inset-x-2 bottom-2 z-50 rounded-sheet px-5 pb-5 pt-[6px]"
            initial={reduce ? { opacity: 0 } : { y: '110%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '110%' }}
            transition={smooth}
            drag={reduce ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.8 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 600) onClose()
            }}
          >
            <div className="mx-auto mb-3 h-[5px] w-9 rounded-full bg-ink/15" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
