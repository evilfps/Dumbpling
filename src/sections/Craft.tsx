import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Section, Spec } from '../components/doc'
import { Icon } from '../components/icons'
import { NumberText, Toggle, cx, useSpring } from '../components/ios'

function Tip({ n, title, body, swift, demo }: { n: number; title: string; body: string; swift?: string; demo?: ReactNode }) {
  return (
    <article className="flex flex-col gap-5">
      {demo && <div className="grid h-[200px] place-items-center overflow-hidden rounded-[28px] bg-stage dark:shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.07)]">{demo}</div>}
      <div className={cx(!demo && 'border-t border-line pt-5')}>
        <p className="tnum font-mono text-[11px] text-ink-3">{String(n).padStart(2, '0')}</p>
        <h3 className="mt-2 text-headline text-ink">{title}</h3>
        <p className="mt-1.5 text-subhead text-ink-2">{body}</p>
        {swift && (
          <p className="mt-3">
            <Spec>{swift}</Spec>
          </p>
        )}
      </div>
    </article>
  )
}

function TouchDown() {
  const snappy = useSpring('snappy')
  const [late, setLate] = useState(false)
  return (
    <div className="flex gap-3">
      <motion.button
        type="button"
        animate={{ scale: late ? 0.97 : 1, opacity: late ? 0.86 : 1 }}
        transition={snappy}
        onClick={() => {
          setLate(true)
          setTimeout(() => setLate(false), 140)
        }}
        className="h-11 rounded-[13px] bg-surface-2 px-4 text-subhead font-semibold text-ink"
      >
        On release
      </motion.button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97, opacity: 0.86 }}
        transition={snappy}
        className="h-11 rounded-[13px] px-4 text-subhead font-semibold"
        style={{ backgroundImage: 'var(--btn-bg)', color: 'var(--btn-fg)', boxShadow: 'var(--btn-shadow)' }}
      >
        On touch-down
      </motion.button>
    </div>
  )
}

function HitArea() {
  return (
    <div className="group relative grid size-11 place-items-center">
      <span className="absolute inset-0 rounded-full border border-dashed border-ink-3 opacity-100 transition-opacity group-hover:opacity-100" />
      <span className="grid size-[30px] place-items-center rounded-full bg-surface-2 text-ink">
        <Icon name="close" size={16} weight="semibold" />
      </span>
      <span className="tnum absolute -bottom-7 whitespace-nowrap font-mono text-[10px] text-ink-3">30 visible · 44 hit</span>
    </div>
  )
}

function Interruptible() {
  const [right, setRight] = useState(false)
  const snappy = useSpring('smooth')
  return (
    <button type="button" onClick={() => setRight((r) => !r)} className="relative h-12 w-56 rounded-full bg-surface p-1.5 shadow-e1" aria-label="Toggle position">
      <motion.span className="block size-9 rounded-full" style={{ backgroundImage: 'var(--btn-bg)', boxShadow: 'var(--btn-shadow)' }} animate={{ x: right ? 172 : 0 }} transition={snappy} />
      <span className="absolute -bottom-7 left-0 right-0 text-center text-footnote text-ink-3">Tap repeatedly</span>
    </button>
  )
}

function BlurEntry() {
  const [k, setK] = useState(0)
  const gentle = useSpring('gentle')
  return (
    <button type="button" onClick={() => setK((v) => v + 1)} className="flex flex-col items-center gap-3">
      <motion.span
        key={k}
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={gentle}
        className="text-lit pb-1 text-title-1"
      >
        Jamie is here
      </motion.span>
      <span className="flex items-center gap-1.5 text-footnote text-ink-3">
        <Icon name="replay" size={13} weight="semibold" /> Tap to replay
      </span>
    </button>
  )
}

function Rolling() {
  const [v, setV] = useState(1204)
  return (
    <button type="button" onClick={() => setV((x) => x + Math.ceil(Math.random() * 40))} className="flex flex-col items-center gap-2">
      <span className="text-lit pb-1 text-[44px] font-semibold leading-none tracking-[-0.04em]">
        <NumberText value={v} />
      </span>
      <span className="text-footnote text-ink-3">Tap to count</span>
    </button>
  )
}

function Stretch() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="origin-center scale-[1.6]">
        <Toggle on={on} onChange={setOn} label="Example" />
      </div>
      <span className="mt-3 text-footnote text-ink-3">Press and hold</span>
    </div>
  )
}

function RubberBand() {
  return (
    <div className="relative h-24 w-64 rounded-[20px] shadow-[inset_0_0_0_1px_var(--line)]">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.18}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 32 }}
        className="absolute inset-3 grid cursor-grab place-items-center rounded-[14px] bg-surface text-subhead font-medium text-ink shadow-e2 active:cursor-grabbing"
      >
        Drag me
      </motion.div>
    </div>
  )
}

function Optical() {
  return (
    <div className="flex items-end gap-10">
      {[
        { label: 'Geometric', shift: 0 },
        { label: 'Optical', shift: 2 },
      ].map((o) => (
        <div key={o.label} className="flex flex-col items-center gap-3">
          <span className="relative grid size-16 place-items-center rounded-full" style={{ backgroundImage: 'var(--btn-bg)', color: 'var(--btn-fg)' }}>
            <span style={{ transform: `translateX(${o.shift}px)` }}>
              <Icon name="play" size={26} />
            </span>
            <span className="absolute inset-y-2 left-1/2 w-px bg-alert/60" />
          </span>
          <span className="text-footnote text-ink-3">{o.label}</span>
        </div>
      ))}
    </div>
  )
}

function Hairline() {
  return (
    <div className="flex w-60 flex-col gap-6">
      {[
        { l: '1 pt (2 px on Retina)', c: 'h-px' },
        { l: '1 / displayScale', c: 'hairline' },
      ].map((h) => (
        <div key={h.l}>
          <span className={`block w-full bg-ink ${h.c}`} />
          <p className="mt-2 text-footnote text-ink-3">{h.l}</p>
        </div>
      ))}
    </div>
  )
}

export function Craft() {
  return (
    <Section
      id="craft"
      index="10 — Craft"
      title="The details nobody notices."
      intro="These are design-engineering notes. None of them is visible on its own, but together they make an app feel considered. Every one of them is cheap to build and expensive to skip."
    >
      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        <Tip n={1} title="Respond on touch-down" body="Feedback starts when the finger lands, not when it lifts. Waiting for release adds about 100 ms of dead time and makes the app feel slow." swift="ButtonStyle · configuration.isPressed" demo={<TouchDown />} />
        <Tip n={2} title="Hit areas bigger than glyphs" body="The close button looks like 30 pt but responds across 44 pt. Small visuals, generous targets." swift=".frame(minWidth: 44, minHeight: 44).contentShape(.rect)" demo={<HitArea />} />
        <Tip n={3} title="Everything is interruptible" body="Springs pick up from their current position and velocity. Tap again mid-flight and the animation redirects without snapping back to the start." swift="withAnimation(.smooth) — never a fixed duration" demo={<Interruptible />} />
        <Tip n={4} title="Enter with blur, not from zero" body="Content arrives with a slight blur, a 10 pt rise and a fade. Scaling up from zero looks cheap. Blur feels like a lens focusing." swift=".transition(.blurReplace) // iOS 17" demo={<BlurEntry />} />
        <Tip n={5} title="Numbers roll" body="When a count changes, only the digits that changed move, and they move in the direction of the change." swift=".contentTransition(.numericText(value: days))" demo={<Rolling />} />
        <Tip n={6} title="Let controls feel physical" body="The switch thumb stretches while it’s held, then settles. It’s a tiny cue that something is ready to move." swift="Toggle(isOn:) — keep the system control" demo={<Stretch />} />
        <Tip n={7} title="Rubber-band at the edges" body="When you drag past a limit, there’s resistance. Nothing should stop dead. Let it go and it springs back." swift="ScrollView bounces by default — don’t disable it" demo={<RubberBand />} />
        <Tip n={8} title="Align optically" body="A play triangle centred by its bounding box looks off-centre. Nudge it about 2 pt toward its point. Trust your eye over the maths." swift=".offset(x: 2) on asymmetric glyphs" demo={<Optical />} />
        <Tip n={9} title="One physical pixel" body="Separators are one device pixel, not one point. At 3× that’s 0.33 pt, and a 1 pt line next to it looks heavy." swift="Divider() · or .frame(height: 1 / displayScale)" demo={<Hairline />} />
        <Tip n={10} title="Pair every haptic with a change" body="Haptics confirm something you can see. Selection ticks as a picker steps, and a single success when a check-in sends. Never buzz for decoration." swift=".sensoryFeedback(.selection, trigger: feeling)" />
        <Tip n={11} title="Keep the keyboard calm" body="The composer is pinned to the keyboard, the thread stays anchored to its newest message, and dragging down dismisses the keyboard as you scroll." swift=".safeAreaInset(edge: .bottom) · .scrollDismissesKeyboard(.interactively)" />
        <Tip n={12} title="Reserve space, never shift" body="Skeletons hold the exact size of the content they stand in for. When data arrives, it cross-fades in place and the layout doesn’t jump." swift=".redacted(reason: .placeholder) · fixed frames" />
      </div>
    </Section>
  )
}
