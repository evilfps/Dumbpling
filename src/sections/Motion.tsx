import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { feelings, haptics, motion as tokens, motionTokens, sampleSpring, type MotionToken } from '../tokens'
import { Block, Rows, Section, Spec, Stage } from '../components/doc'
import { Avatar, Button, FeelingOrb, FeelingPicker, ReduceMotionContext, Sheet, Toggle, useReduce, useSpring } from '../components/ios'
import { Icon } from '../components/icons'

const W = 240
const H = 96
const toY = (v: number) => H - ((v + 0.06) / 1.18) * H

function curvePath(t: MotionToken) {
  const pts: [number, number][] = t.response
    ? sampleSpring(t.response, t.damping!, 1.2)
    : Array.from({ length: 121 }, (_, i) => [i / 120, 0.5 - 0.5 * Math.cos((i / 120) * Math.PI * 2)] as [number, number])
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * W).toFixed(1)},${toY(y).toFixed(1)}`).join(' ')
}

function TokenCard({ t }: { t: MotionToken }) {
  const [on, setOn] = useState(false)
  const isDrift = t.key === 'drift'
  const transition = isDrift ? { duration: 4.5, ease: 'easeInOut' as const, repeat: Infinity, repeatType: 'mirror' as const } : tokens[t.key as keyof typeof tokens]
  return (
    <div className="flex flex-col rounded-[28px] bg-stage p-6 dark:shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.07)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-headline text-ink">{t.name}</p>
          <p className="tnum mt-0.5 font-mono text-[11px] text-ink-3">{t.spec}</p>
        </div>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-label={`Play ${t.name}`}
          className="grid size-9 place-items-center rounded-full bg-surface text-ink shadow-e1 transition-transform active:scale-90"
        >
          <Icon name={isDrift && on ? 'close' : 'play'} size={isDrift && on ? 14 : 13} weight="semibold" className={isDrift && on ? '' : 'ml-0.5'} />
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-24 w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
        <line x1="0" x2={W} y1={toY(1)} y2={toY(1)} stroke="var(--line)" strokeDasharray="2 3" />
        <line x1="0" x2={W} y1={toY(0)} y2={toY(0)} stroke="var(--line)" />
        <path d={curvePath(t)} fill="none" stroke="var(--ink)" strokeWidth="1.75" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-5 h-9 rounded-full bg-surface p-1.5 shadow-e1">
        <div className="relative h-6">
          <motion.span
            className="absolute top-0 size-6 rounded-full"
            style={{ backgroundImage: 'var(--btn-bg)', boxShadow: 'var(--btn-shadow)' }}
            initial={false}
            animate={isDrift ? (on ? { left: ['0%', 'calc(100% - 24px)'] } : { left: '0%' }) : { left: on ? 'calc(100% - 24px)' : '0%' }}
            transition={isDrift && !on ? tokens.smooth : transition}
          />
        </div>
      </div>
      <p className="mt-5 text-subhead text-ink-2">{t.use}</p>
      <p className="mt-auto truncate pt-4 font-mono text-[10.5px] text-ink-3">{t.swift}</p>
    </div>
  )
}

function MiniScreen({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto h-[460px] w-full max-w-[300px] overflow-hidden rounded-[44px] bg-canvas shadow-[0_0_0_0.5px_var(--line)]">{children}</div>
}

function CheckInDemo() {
  const [open, setOpen] = useState(false)
  const [feeling, setFeeling] = useState('calm')
  const [toast, setToast] = useState(false)
  const smooth = useSpring('smooth')
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(false), 2400)
    return () => clearTimeout(t)
  }, [toast])
  const f = feelings.find((x) => x.key === feeling)!
  return (
    <MiniScreen>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="absolute inset-x-0 top-4 z-[60] flex justify-center"
            initial={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(6px)', transition: tokens.fade }}
            transition={smooth}
          >
            <span className="lg flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-subhead font-medium text-ink">
              <span className="size-5 rounded-full" style={{ background: `radial-gradient(circle at 34% 28%, ${f.b}, ${f.a} 50%, ${f.deep})` }} />
              Shared with Jamie
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
        <Avatar initials="J" size={48} />
        <div>
          <p className="text-headline text-ink">Jamie checked in</p>
          <p className="text-subhead text-ink-2">Feeling tender · 08:12</p>
        </div>
        <Button size="md" onClick={() => setOpen(true)}>
          Check in
        </Button>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)}>
        <p className="text-center text-headline text-ink">How are you feeling?</p>
        <div className="my-6 flex flex-col items-center gap-3">
          <FeelingOrb feeling={feeling} size={112} />
          <p className="text-lit text-title-3">{f.name}</p>
        </div>
        <FeelingPicker value={feeling} onChange={setFeeling} />
        <div className="mt-6">
          <Button
            full
            onClick={() => {
              setOpen(false)
              setToast(true)
            }}
          >
            Share with Jamie
          </Button>
        </div>
      </Sheet>
    </MiniScreen>
  )
}

const entryItems = ['Jamie checked in', 'Dinner at Padella', '1,204 days together', 'Bin day tomorrow']

function EntryDemo() {
  const [run, setRun] = useState(0)
  const gentle = useSpring('gentle')
  const reduce = useReduce()
  return (
    <MiniScreen>
      <div className="flex h-full flex-col px-5 pt-12">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-title-2 text-ink">Today</p>
          <button type="button" onClick={() => setRun((r) => r + 1)} aria-label="Replay" className="grid size-8 place-items-center rounded-full bg-surface-2 text-ink transition-transform active:scale-90">
            <Icon name="replay" size={16} weight="semibold" />
          </button>
        </div>
        <div key={run} className="flex flex-col gap-2.5">
          {entryItems.map((t, i) => (
            <motion.div
              key={t}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ ...gentle, delay: i * 0.04 }}
              className="flex h-16 flex-col justify-center rounded-lg bg-surface px-4"
            >
              <p className="text-subhead font-medium text-ink">{t}</p>
              <p className="text-footnote text-ink-3">{['08:12', 'Saturday, 19:30', 'Since 26 February 2022', 'Recycling'][i]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </MiniScreen>
  )
}

function AmbientDemo() {
  const reduce = useReduce()
  return (
    <MiniScreen>
      <div className="flex h-full flex-col items-center justify-center gap-8 px-8 text-center">
        <FeelingOrb feeling="tender" size={150} />
        <div>
          <p className={`${reduce ? 'text-lit' : 'text-shimmer'} pb-1 text-title-1`}>Jamie feels tender</p>
          <p className="mt-1 text-subhead text-ink-2">Maybe send a note?</p>
        </div>
      </div>
    </MiniScreen>
  )
}

const choreography = [
  ['Press', 'Scale 0.97 and opacity 0.86 on touch-down', 'snappy'],
  ['Switch, segmented', 'Thumb follows the state and stretches while pressed', 'snappy'],
  ['Sheet', 'Rises from the bottom and follows the finger’s velocity on dismissal', 'smooth'],
  ['Message sent', 'Rises 24 pt from the composer, scaling from 0.94', 'smooth'],
  ['Content enters', 'Fade, 10 pt rise, 8 pt blur, 40 ms stagger, 6 items at most', 'gentle'],
  ['Content leaves', 'Fade only, about 30% faster than it entered', 'fade'],
  ['Feeling changes', 'Orb cross-fades its colour', 'gentle'],
  ['Ambient', 'Shimmer, breathing orb. One per screen', 'drift'],
  ['Navigation push', 'System default. Never override it', 'system'],
]

export function Motion() {
  const [simulate, setSimulate] = useState(false)
  return (
    <Section
      id="motion"
      index="09 — Motion"
      title="Slow light, quick hands."
      intro="There are two kinds of motion. Interactive motion answers a finger at once and never makes you wait. Ambient motion is very slow, like light moving across a surface. Both are springs or gentle curves, and every animation can be interrupted."
    >
      <Block title="Tokens" description="Press play on each one. The values are SwiftUI springs. On the web they become stiffness = (2π ÷ response)² and damping = 4π × fraction ÷ response.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {motionTokens.map((t) => (
            <TokenCard key={t.key} t={t} />
          ))}
        </div>
      </Block>

      <ReduceMotionContext.Provider value={simulate}>
        <Block
          title="In practice"
          description="Open the check-in, drag the sheet down to dismiss it, and replay the entrance. Turn on Reduce Motion to see the alternative."
          aside={
            <label className="flex items-center gap-3 rounded-full bg-stage py-1.5 pl-4 pr-1.5">
              <span className="text-subhead font-medium text-ink">Reduce Motion</span>
              <Toggle on={simulate} onChange={setSimulate} label="Simulate Reduce Motion" />
            </label>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <Stage caption="Sheet · smooth. Feeling · gentle.">
              <CheckInDemo />
            </Stage>
            <Stage caption="Entrance · blur and rise, staggered.">
              <EntryDemo />
            </Stage>
            <Stage caption="Ambient · drift. Shimmer and breathing.">
              <AmbientDemo />
            </Stage>
          </div>
        </Block>
      </ReduceMotionContext.Provider>

      <Block title="Choreography" description="Things leave faster than they arrive. Nothing travels more than 24 pt, and nothing scales up from zero.">
        <Rows>
          {choreography.map(([a, b, c]) => (
            <div key={a} className="grid gap-1 py-3.5 text-subhead sm:grid-cols-[180px_1fr_80px] sm:items-center">
              <span className="font-medium text-ink">{a}</span>
              <span className="text-ink-2">{b}</span>
              <span className="sm:text-right">
                <Spec>{c}</Spec>
              </span>
            </div>
          ))}
        </Rows>
      </Block>

      <div className="grid gap-16 md:grid-cols-2">
        <Block title="Haptics" description="Every haptic pairs with a visible change. Haptics are never decoration.">
          <Rows>
            {haptics.map((h) => (
              <div key={h.moment} className="flex items-center justify-between gap-4 py-3.5 text-subhead">
                <span className="text-ink">{h.moment}</span>
                <Spec>{h.haptic}</Spec>
              </div>
            ))}
          </Rows>
        </Block>
        <Block title="Reduce Motion" description="Read @Environment(\.accessibilityReduceMotion) and make these substitutions.">
          <Rows>
            {[
              ['Slides and scales', 'Become a cross-fade'],
              ['Blur entrances', 'Become a fade'],
              ['Shimmer, breathing', 'Stop completely'],
              ['Haptics', 'Stay on'],
            ].map(([a, b]) => (
              <div key={a} className="flex items-center justify-between gap-4 py-3.5 text-subhead">
                <span className="text-ink">{a}</span>
                <span className="text-ink-2">{b}</span>
              </div>
            ))}
          </Rows>
        </Block>
      </div>
    </Section>
  )
}
