import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Block, Note, Rows, Section, Spec } from '../components/doc'
import { Phone } from '../components/Phone'
import { Glass } from '../components/glass'
import { Icon } from '../components/icons'
import { Gauge, Vessel } from '../components/water'
import { Avatar, Button, IconButton, NumberText, useSpring } from '../components/ios'
import { ScrollEdge } from '../components/screen'
import { LogoMark } from '../components/Logo'
import { wallpapers } from '../photos'
import { feelings } from '../tokens'

const calm = feelings[2]
const GOAL = 8
const DAILY_NUDGES = 3
const bodies = ['A little water? You’re on {n} of 8 today.', 'Alex is thinking of you, and your water. {n} of 8 so far.', 'Quick sip? {n} of 8, nearly there.']

type Notice = { id: number; body: string; state: 'new' | 'open' | 'logged' | 'snoozed' }

function IslandRow({ icon, title, sub, trailing }: { icon: ReactNode; title: string; sub: string; trailing?: ReactNode }) {
  return (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ background: `radial-gradient(circle at 34% 28%, ${calm.b}, ${calm.a} 50%, ${calm.deep})` }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-subhead font-semibold">{title}</span>
        <span className="tnum block truncate text-footnote text-white/60">{sub}</span>
      </span>
      {trailing}
    </>
  )
}

/* ---------- Your phone ---------- */

function WaterScreen({ jamie, mine, left, nudged, onNudge }: { jamie: number; mine: number; left: number; nudged: boolean; onNudge: () => void }) {
  const logs = ['08:05', '09:40', '11:15', '12:30', '13:20', '14:10', '15:00', '16:20']
  return (
    <>
      <ScrollEdge opacity={1} height={104} />
      <div className="absolute inset-x-0 top-[54px] z-40 grid h-11 grid-cols-[44px_1fr_44px] items-center px-4">
        <IconButton icon="chevronLeft" label="Back" size={36} variant="glass" />
        <span className="text-center text-headline text-ink">Water</span>
        <IconButton icon="ellipsis" label="More" size={36} variant="glass" />
      </div>

      <div className="flex h-full flex-col items-center px-5 pt-[118px]">
        <p className="text-subhead text-ink-2">Jamie today</p>
        <div className="relative mt-5">
          <Vessel value={jamie} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[56px] font-semibold leading-none tracking-[-0.04em] text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.18)] mix-blend-normal" style={{ color: jamie / GOAL > 0.45 ? '#fff' : 'var(--ink)' }}>
              <NumberText value={jamie} />
            </span>
            <span className="mt-1 text-footnote font-medium" style={{ color: jamie / GOAL > 0.45 ? 'rgb(255 255 255 / 0.85)' : 'var(--ink-2)' }}>
              of {GOAL} glasses
            </span>
          </div>
        </div>

        <div className="mt-8 grid w-full grid-cols-3 divide-x divide-line text-center">
          {[
            [`${(jamie * 0.25).toFixed(2)} L`, 'Drunk'],
            [logs[Math.max(0, jamie - 1)], 'Last glass'],
            [`${mine} of 8`, 'You'],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="tnum text-headline text-ink">{v}</p>
              <p className="text-footnote text-ink-3">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex w-full justify-between px-2" aria-hidden>
          {Array.from({ length: GOAL }, (_, i) => (
            <motion.span key={i} initial={false} animate={{ opacity: i < jamie ? 1 : 0.25, scale: i < jamie ? 1 : 0.9 }} className="grid place-items-center" style={{ color: i < jamie ? calm.deep : 'var(--ink-3)' }}>
              <Icon name="water" size={26} filled={i < jamie} weight="medium" />
            </motion.span>
          ))}
        </div>

        <div className="mt-auto w-full pb-[46px]">
          <Button full icon="water" onClick={onNudge} disabled={left === 0} variant={nudged ? 'secondary' : 'primary'}>
            {nudged ? 'Nudge sent' : left === 0 ? 'No nudges left today' : 'Nudge Jamie'}
          </Button>
          <p className="tnum mt-3 text-center text-footnote text-ink-3">
            {left} of {DAILY_NUDGES} nudges left today · Quiet after 22:00
          </p>
        </div>
      </div>
    </>
  )
}

/* ---------- Jamie’s Lock Screen ---------- */

function Notification({ n, jamie, onOpen, onLog, onSnooze }: { n: Notice; jamie: number; onOpen: () => void; onLog: () => void; onSnooze: () => void }) {
  const liquid = useSpring('liquid')
  const smooth = useSpring('smooth')
  const open = n.state === 'open'
  const done = n.state === 'logged' || n.state === 'snoozed'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 60, scale: 0.9, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, scale: 0.96, filter: 'blur(8px)', transition: { duration: 0.3 } }}
      transition={liquid}
      className="flex flex-col gap-2"
    >
      <Glass as="button" interactive variant="clear" onClick={done ? undefined : onOpen} className="w-full rounded-[26px] p-3.5 text-left">
        <motion.div layout="position" className="relative z-[2] flex gap-3">
          <span className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-black">
            <LogoMark size={14} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-subhead font-semibold">{done ? 'Dumbpling' : 'Alex'}</span>
              <span className="text-footnote text-white/60">now</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={n.state === 'logged' ? 'l' : n.state === 'snoozed' ? 's' : 'b'} className="text-subhead text-white/90" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={smooth}>
                {n.state === 'logged' ? `Logged. ${jamie} of 8 today. Alex will see it.` : n.state === 'snoozed' ? 'Okay. I’ll remind you again at 14:35.' : n.body.replace('{n}', String(jamie))}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </Glass>
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg lg-clear overflow-hidden rounded-[22px]"
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={liquid}
            style={{ transformOrigin: '50% 0%' }}
          >
            {[
              { label: 'Log a glass', icon: 'water' as const, on: onLog },
              { label: 'Remind me in 30 min', icon: 'clock' as const, on: onSnooze },
            ].map((a, i) => (
              <button key={a.label} type="button" onClick={a.on} className="relative z-[2] flex h-[50px] w-full items-center justify-between px-4 text-body text-white transition-colors active:bg-white/10">
                {a.label}
                <Icon name={a.icon} size={20} weight="medium" />
                {i === 0 && <span className="hairline absolute inset-x-4 bottom-0 bg-white/25" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function LockScreen({ jamie, notice, onOpen, onLog, onSnooze }: { jamie: number; notice: Notice | null; onOpen: () => void; onLog: () => void; onSnooze: () => void }) {
  return (
    <div className="relative flex h-full flex-col items-center text-white">
      <div className="absolute inset-0 bg-black/10" />
      <span className="relative mt-[62px]">
        <Icon name="lock" size={18} weight="semibold" />
      </span>
      <p className="relative mt-3 text-[19px] font-semibold tracking-[-0.2px] text-white/85">Saturday 14 June</p>
      <p className="tnum relative -mt-1 bg-gradient-to-b from-white to-white/70 bg-clip-text text-[104px] font-semibold leading-[1] tracking-[-0.04em] text-transparent [filter:drop-shadow(0_2px_16px_rgb(0_0_0/0.12))]">14:05</p>

      <div className="relative mt-4 flex items-center gap-2.5">
        <Glass variant="clear" className="grid size-[72px] place-items-center rounded-full">
          <Gauge value={jamie} size={60} stroke={5} color="#fff">
            <span className="flex flex-col items-center">
              <Icon name="water" size={14} weight="semibold" />
              <span className="tnum text-[15px] font-semibold leading-4">
                <NumberText value={jamie} />
              </span>
            </span>
          </Gauge>
        </Glass>
        <Glass variant="clear" className="flex h-[72px] w-[164px] flex-col justify-center rounded-[20px] px-3.5">
          <span className="relative z-[2] flex items-center gap-1.5 text-footnote font-semibold">
            <Icon name="heart" size={13} filled /> Alex
          </span>
          <span className="relative z-[2] text-subhead font-semibold leading-5">Feels calm</span>
          <span className="relative z-[2] text-footnote text-white/70">Checked in 12:40</span>
        </Glass>
        <Glass variant="clear" className="grid size-[72px] place-items-center rounded-full">
          <span className="relative z-[2] flex flex-col items-center leading-none">
            <span className="tnum text-[15px] font-semibold">1,204</span>
            <span className="mt-0.5 text-[10px] font-medium text-white/75">days</span>
          </span>
        </Glass>
      </div>

      <div className="relative mt-auto w-full px-4 pb-[118px]">
        <AnimatePresence>{notice && <Notification key={notice.id} n={notice} jamie={jamie} onOpen={onOpen} onLog={onLog} onSnooze={onSnooze} />}</AnimatePresence>
        {!notice && <p className="text-center text-footnote text-white/60">No new notifications</p>}
      </div>

      <div className="absolute inset-x-[46px] bottom-[46px] flex justify-between">
        <IconButton icon="flashlight" label="Torch" size={50} variant="clear" />
        <IconButton icon="camera" label="Camera" size={50} variant="clear" />
      </div>
    </div>
  )
}

/* ---------- Section ---------- */

const anatomy = [
  ['Surface', 'Clear glass · radius 26 · padding 14'],
  ['Icon', '38 pt · radius 10 · continuous'],
  ['Title', 'Subheadline semibold, the sender’s name'],
  ['Body', 'Subheadline, two lines at most, with today’s count'],
  ['Actions', 'Log a glass · Remind me in 30 min'],
  ['Level', '.active, never .timeSensitive'],
]

export function Hydration() {
  const [jamie, setJamie] = useState(5)
  const [left, setLeft] = useState(DAILY_NUDGES)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [island, setIsland] = useState<ReactNode>(null)
  const [nudged, setNudged] = useState(false)
  const count = useRef(0)
  const timers = useRef<number[]>([])
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const flashIsland = (node: ReactNode) => {
    setIsland(node)
    later(2600, () => setIsland(null))
  }

  const nudge = () => {
    if (!left || nudged) return
    setLeft((l) => l - 1)
    setNudged(true)
    flashIsland(<IslandRow icon={<Icon name="water" size={18} weight="semibold" className="text-white" />} title="Nudge sent" sub={`Jamie · ${jamie} of 8 today`} trailing={<Avatar initials="J" size={32} />} />)
    later(900, () => setNotice({ id: Date.now(), body: bodies[count.current++ % bodies.length], state: 'new' }))
    later(3200, () => setNudged(false))
  }

  const log = () => {
    const n = Math.min(GOAL, jamie + 1)
    setJamie(n)
    setNotice((x) => (x ? { ...x, state: 'logged' } : x))
    later(1800, () => setNotice(null))
    later(500, () => flashIsland(<IslandRow icon={<Icon name="check" size={18} weight="bold" className="text-white" />} title="Jamie logged a glass" sub={`${n} of 8 today`} trailing={<Avatar initials="J" size={32} />} />))
  }

  const snooze = () => {
    setNotice((x) => (x ? { ...x, state: 'snoozed' } : x))
    later(1800, () => setNotice(null))
  }

  return (
    <Section
      id="water"
      index="11 — Water"
      title="Little nudges."
      intro="Couples look after each other in small ways. Dumbpling lets you send a gentle reminder to drink some water. It arrives as a calm notification, and she can log a glass straight from her Lock Screen without opening the app."
    >
      <Block title="Try it" description="On your phone, tap Nudge Jamie. Then, on Jamie’s Lock Screen, tap the notification and log a glass. Watch the water rise on your side.">
        <div className="no-scrollbar -mx-6 overflow-x-auto px-6 pb-4">
          <div className="mx-auto flex w-max items-start gap-12 xl:[zoom:0.92]">
            <Phone label="Your phone · Water" island={island}>
              <WaterScreen jamie={jamie} mine={6} left={left} nudged={nudged} onNudge={nudge} />
            </Phone>
            <Phone label="Jamie’s phone · Lock Screen" wallpaper={wallpapers.lock} light time=" ">
              <LockScreen jamie={jamie} notice={notice} onOpen={() => setNotice((x) => (x && x.state === 'new' ? { ...x, state: 'open' } : x))} onLog={log} onSnooze={snooze} />
            </Phone>
          </div>
        </div>
      </Block>

      <div className="grid gap-16 md:grid-cols-2">
        <Block title="Notification">
          <Rows>
            {anatomy.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[96px_1fr] gap-4 py-3 text-subhead">
                <span className="text-ink-3">{k}</span>
                <span className="text-ink">{v}</span>
              </div>
            ))}
          </Rows>
          <div className="mt-5 flex flex-col gap-2">
            <Spec>UNNotificationCategory(identifier: "water.nudge", actions: [log, snooze])</Spec>
            <Spec>UNNotificationAction(identifier: "log", title: "Log a glass", options: [])</Spec>
            <Spec>content.interruptionLevel = .active · content.relevanceScore = 0.4</Spec>
          </div>
        </Block>
        <Block title="Nudge etiquette">
          <div className="flex flex-col gap-4">
            <Note kind="do">Limit nudges to three a day, and say how many are left so the limit never feels like a bug.</Note>
            <Note kind="do">Respect Focus modes and quiet hours. Nudges can wait. They are never time-sensitive.</Note>
            <Note kind="do">Let her log a glass from the notification. Don’t open the app just to tap one button.</Note>
            <Note kind="dont">Shame or count failures: “You’re behind”, “Only 2 today”. Always share progress, not shortfall.</Note>
            <Note kind="dont">Escalate. A second nudge is no louder than the first.</Note>
          </div>
        </Block>
      </div>
    </Section>
  )
}
