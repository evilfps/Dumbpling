import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { Block, Note, Rows, Section } from '../components/doc'
import { Phone } from '../components/Phone'
import { LargeTitleScreen } from '../components/screen'
import { Icon, type IconName } from '../components/icons'
import { Avatar, Button, FeelingOrb, FeelingPicker, IconButton, ListGroup, ListRow, NumberText, Segmented, Toggle, cx, useReduce, useSpring } from '../components/ios'
import { cycle, feelings } from '../tokens'

/* ---------- Model ---------- */

const TODAY = 14 // Saturday 14 June. Dates are days of June; 31+ runs into July.
const LENGTH = 28
const PERIOD = 5
const LAST_START = -11 // 20 May
const rose = cycle[0].c

type Flow = 'Light' | 'Medium' | 'Heavy'
type Share = { phase: boolean; symptoms: boolean; mood: boolean }
type Log = { start: number; flow: Flow; symptoms: string[]; mood: string | null; share: Share; at: string }

const symptomList = ['Cramps', 'Headache', 'Bloating', 'Tender breasts', 'Back pain', 'Fatigue', 'Cravings', 'Acne', 'Poor sleep']
const dayOf = (start: number, date = TODAY) => ((((date - start) % LENGTH) + LENGTH) % LENGTH) + 1
const phaseOf = (d: number) => (d <= PERIOD ? 0 : d <= 13 ? 1 : d <= 16 ? 2 : 3)
const nextStart = (start: number) => start + LENGTH * (Math.floor((TODAY - start) / LENGTH) + 1)
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekday = (date: number) => days[(((6 + date - TODAY) % 7) + 7) % 7]
const longDate = (date: number) => (date <= 30 ? `${weekday(date)} ${date} June` : `${weekday(date)} ${date - 30} July`)

const herPhase = ['Rest when you can. Warmth and iron-rich food help.', 'Energy usually builds through this week.', 'Often the days with the most energy.', 'Energy can dip in the days before your period.']

function status(log: Log, who: 'her' | 'him') {
  const day = dayOf(log.start)
  const until = nextStart(log.start) - TODAY
  if (day <= PERIOD) return who === 'her' ? `Period · day ${day} of about ${PERIOD}` : `Day ${day} of her period`
  if (until === 1) return 'Period expected tomorrow'
  return who === 'her' ? `Period in ${until} days` : `Period in about ${until} days`
}

type Care = { id: string; icon: IconName; title: string; body: string; note: string }

/** Turns what she shares into a few small, kind things to do. */
function careFor(log: Log): Care[] {
  const day = dayOf(log.start)
  const s = new Set(log.share.symptoms ? log.symptoms : [])
  const list: Care[] = []
  if ((log.share.phase && day <= 2) || s.has('Cramps') || s.has('Back pain'))
    list.push({ id: 'warm', icon: 'heart', title: 'Bring a hot water bottle', body: 'Warmth eases cramps and backache.', note: 'Hot water bottle on its way' })
  if (s.has('Fatigue') || s.has('Poor sleep')) list.push({ id: 'dinner', icon: 'moon', title: 'Take dinner tonight', body: 'Let her rest. You cook or order in.', note: 'Alex is making dinner tonight' })
  if (s.has('Cravings')) list.push({ id: 'snack', icon: 'pin', title: 'Snack run on the way home', body: 'Something sweet goes a long way.', note: 'Snacks are on the way' })
  if (s.has('Headache')) list.push({ id: 'quiet', icon: 'clock', title: 'Keep tonight low-key', body: 'Dim lights, fewer plans.', note: 'Alex cleared tonight' })
  if (log.share.phase) {
    const p = phaseOf(day)
    if (p === 3) list.push({ id: 'cosy', icon: 'plans', title: 'Plan a cosy night in', body: 'Energy often dips before a period.', note: 'Alex planned a night in' })
    if (p === 1 || p === 2) list.push({ id: 'out', icon: 'sun', title: 'Plan something outdoors', body: 'Energy tends to rise around now.', note: 'Alex wants to get outside this weekend' })
  }
  list.push({ id: 'ask', icon: 'messages', title: 'Check in', body: 'Ask how she’s doing. No need to fix anything.', note: 'How are you feeling, love?' })
  return list.slice(0, 3)
}

/* ---------- Dial ---------- */

/** 28 days around a ring. Past days are full strength, future days faint. The ink ring marks today. */
function Dial({ day, size = 264, children }: { day: number; size?: number; children?: ReactNode }) {
  const gentle = useSpring('gentle')
  const reduce = useReduce()
  const c = size / 2
  const R = c - 14
  const t = useMotionValue(day - 1)
  const prev = useRef(day - 1)
  useEffect(() => {
    // Always travel the short way round, so day 26 → day 1 moves forward through 27 and 28.
    const from = ((prev.current % LENGTH) + LENGTH) % LENGTH
    let diff = (((day - 1 - from) % LENGTH) + LENGTH) % LENGTH
    if (diff > LENGTH / 2) diff -= LENGTH
    prev.current += diff
    if (reduce) t.set(prev.current)
    else animate(t, prev.current, gentle)
  }, [day, gentle, reduce, t])
  const angle = (v: number) => (v / LENGTH) * Math.PI * 2 - Math.PI / 2
  const mx = useTransform(t, (v) => c + Math.cos(angle(v)) * R)
  const my = useTransform(t, (v) => c + Math.sin(angle(v)) * R)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0" aria-hidden>
        {Array.from({ length: LENGTH }, (_, i) => {
          const d = i + 1
          return (
            <motion.circle
              key={d}
              cx={c + Math.cos(angle(i)) * R}
              cy={c + Math.sin(angle(i)) * R}
              r={5}
              initial={false}
              animate={{ fill: cycle[phaseOf(d)].c, opacity: d <= day ? 1 : 0.3 }}
              transition={gentle}
            />
          )
        })}
        <motion.circle cx={mx} cy={my} r={11.5} fill="var(--canvas)" stroke="var(--ink)" strokeWidth={2.5} />
        <motion.circle cx={mx} cy={my} r={6} initial={false} animate={{ fill: cycle[phaseOf(day)].c }} transition={gentle} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

function MiniDial({ day }: { day: number }) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden className="shrink-0">
      {Array.from({ length: LENGTH }, (_, i) => {
        const d = i + 1
        const a = (i / LENGTH) * Math.PI * 2 - Math.PI / 2
        const today = d === day
        return <circle key={d} cx={26 + Math.cos(a) * 21} cy={26 + Math.sin(a) * 21} r={today ? 3.6 : 2} fill={today ? 'var(--ink)' : cycle[phaseOf(d)].c} opacity={d > day ? 0.35 : 1} />
      })}
    </svg>
  )
}

function DialCenter({ log, who }: { log: Log; who: 'her' | 'him' }) {
  const day = dayOf(log.start)
  const p = cycle[phaseOf(day)]
  const gentle = useSpring('gentle')
  return (
    <>
      <span className="text-footnote font-medium text-ink-2">{who === 'her' ? 'Cycle day' : 'Her cycle day'}</span>
      <span className="text-lit tnum text-[64px] font-semibold leading-[68px] tracking-[-0.04em]">
        <NumberText value={day} />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={p.name + status(log, who)} className="flex flex-col items-center" initial={{ opacity: 0, filter: 'blur(6px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={gentle}>
          <span className="flex items-center gap-1.5 text-headline text-ink">
            <span className="size-2 rounded-full" style={{ background: p.c }} />
            {p.name}
          </span>
          <span className="tnum mt-0.5 text-subhead text-ink-2">{status(log, who)}</span>
        </motion.span>
      </AnimatePresence>
    </>
  )
}

/** The week around today. Logged period days are filled, predicted ones dashed. */
function Week({ start }: { start: number }) {
  const dates = Array.from({ length: 7 }, (_, i) => TODAY - 3 + i)
  return (
    <div className="grid grid-cols-7">
      {dates.map((date) => {
        const d = dayOf(start, date)
        const period = d <= PERIOD
        const logged = period && date <= TODAY
        const predicted = period && date > TODAY
        const today = date === TODAY
        return (
          <div key={date} className="flex flex-col items-center gap-1.5">
            <span className={cx('text-caption-2 font-semibold', today ? 'text-ink' : 'text-ink-3')}>{weekday(date)[0]}</span>
            <span
              className={cx(
                'tnum grid size-9 place-items-center rounded-full text-subhead transition-[background-color,box-shadow,color] duration-500',
                logged ? 'font-semibold text-white' : today ? 'font-semibold text-ink' : 'text-ink-2',
                predicted && 'border-[1.5px] border-dashed',
              )}
              style={{
                background: logged ? rose : undefined,
                borderColor: predicted ? rose : undefined,
                boxShadow: today ? (logged ? '0 0 0 2px var(--canvas), 0 0 0 3.5px var(--ink)' : 'inset 0 0 0 1.5px var(--ink)') : undefined,
              }}
            >
              {date}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex justify-center gap-4">
      {cycle.map((p) => (
        <span key={p.name} className="flex items-center gap-1.5 text-caption-1 text-ink-2">
          <span className="size-2 rounded-full" style={{ background: p.c }} />
          {p.name}
        </span>
      ))}
    </div>
  )
}

/* ---------- Pieces ---------- */

function Card({ title, aside, children, className }: { title?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-lg bg-surface p-4', className)}>
      {title && (
        <div className="mb-3 flex h-6 items-center justify-between">
          <h3 className="text-headline text-ink">{title}</h3>
          {aside}
        </div>
      )}
      {children}
    </section>
  )
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  const snappy = useSpring('snappy')
  return (
    <motion.button
      type="button"
      aria-pressed={on}
      whileTap={{ scale: 0.95 }}
      transition={snappy}
      onClick={onClick}
      className={cx('flex h-9 items-center rounded-full px-3.5 text-subhead font-medium transition-colors duration-200', on ? 'bg-ink text-canvas' : 'bg-surface-2 text-ink')}
    >
      <motion.span className="flex overflow-hidden" initial={false} animate={{ width: on ? 20 : 0, opacity: on ? 1 : 0 }} transition={snappy}>
        <Icon name="check" size={14} weight="bold" className="shrink-0" />
      </motion.span>
      {label}
    </motion.button>
  )
}

function IslandRow({ leading, title, sub, trailing }: { leading: ReactNode; title: string; sub: string; trailing?: ReactNode }) {
  return (
    <>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block text-subhead font-semibold">{title}</span>
        <span className="block truncate text-footnote text-white/60">{sub}</span>
      </span>
      {trailing}
    </>
  )
}

/* ---------- Navigation: push with parallax, swipe from the left edge to go back ---------- */

function Stack({ pushed, onBack, root, children }: { pushed: boolean; onBack: () => void; root: ReactNode; children: ReactNode }) {
  const W = 393
  const smooth = useSpring('smooth')
  const reduce = useReduce()
  const x = useMotionValue(pushed ? 0 : W)
  useEffect(() => {
    animate(x, pushed ? 0 : W, reduce ? { duration: 0 } : smooth)
  }, [pushed, reduce, smooth, x])
  const rootX = useTransform(x, [0, W], [-W * 0.3, 0])
  const dim = useTransform(x, [0, W], [1, 0])
  const visibility = useTransform(x, (v) => (v >= W - 0.5 ? 'hidden' : 'visible'))
  return (
    <>
      <motion.div className="absolute inset-0" style={{ x: rootX }} inert={pushed}>
        {root}
        <motion.div className="pointer-events-none absolute inset-0 z-[45] bg-black/20" style={{ opacity: dim }} />
      </motion.div>
      <motion.div className="absolute inset-0 bg-canvas shadow-[-16px_0_40px_rgb(0_0_0/0.14)]" style={{ x, visibility }} inert={!pushed}>
        {children}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-0 top-[100px] z-[45] w-5 touch-none"
            onPan={(_, i) => x.set(Math.max(0, i.offset.x))}
            onPanEnd={(_, i) => (i.offset.x > 110 || i.velocity.x > 500 ? onBack() : animate(x, 0, smooth))}
          />
        )}
      </motion.div>
    </>
  )
}

function TodayRoot({ log, who, onOpen }: { log: Log; who: 'her' | 'him'; onOpen: () => void }) {
  const day = dayOf(log.start)
  const shared = who === 'her' || log.share.phase
  const snappy = useSpring('snappy')
  return (
    <LargeTitleScreen title="Today" subtitle="Saturday 14 June" tab="Today" trailing={<Avatar initials={who === 'her' ? 'J' : 'A'} size={30} />}>
      <article className="flex items-center gap-4 rounded-lg bg-surface p-4">
        <FeelingOrb feeling={who === 'her' ? 'calm' : (log.share.mood && log.mood) || 'tender'} size={52} glow={false} />
        <div className="flex-1">
          <p className="text-headline text-ink">{who === 'her' ? 'Alex feels calm' : `Jamie feels ${feelings.find((f) => f.key === ((log.share.mood && log.mood) || 'tender'))!.name.toLowerCase()}`}</p>
          <p className="tnum text-subhead text-ink-2">Checked in at 08:12</p>
        </div>
      </article>
      <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.98 }} transition={snappy} className="mt-3 flex w-full items-center gap-4 rounded-lg bg-surface p-4 text-left">
        {shared ? <MiniDial day={day} /> : <span className="grid size-[52px] place-items-center rounded-full bg-surface-2 text-ink-3"><Icon name="lock" size={20} /></span>}
        <div className="min-w-0 flex-1">
          <p className="text-subhead text-ink-2">{who === 'her' ? 'Cycle' : 'Jamie’s cycle'}</p>
          <p className="tnum text-title-3 text-ink">{shared ? `Day ${day} · ${cycle[phaseOf(day)].name}` : 'Not shared'}</p>
          {shared && <p className="tnum text-footnote text-ink-2">{status(log, who)}</p>}
        </div>
        <Icon name="chevronRight" size={16} weight="semibold" className="text-ink-3" />
      </motion.button>
    </LargeTitleScreen>
  )
}

/* ---------- Her screen: log and track ---------- */

function HerCycle({ log, onBack, onStart, onUndo, onFlow, onSymptom, onMood, onShare }: {
  log: Log
  onBack: () => void
  onStart: () => void
  onUndo: () => void
  onFlow: (f: Flow) => void
  onSymptom: (s: string) => void
  onMood: (m: string) => void
  onShare: (k: keyof Share, v: boolean) => void
}) {
  const day = dayOf(log.start)
  const started = log.start === TODAY
  const smooth = useSpring('smooth')
  const mood = feelings.find((f) => f.key === log.mood)
  return (
    <LargeTitleScreen title="Cycle" subtitle="Shared with Alex" tab="Today" tabBar={false} leading={<IconButton icon="chevronLeft" label="Back to Today" variant="glass" size={36} onClick={onBack} />}>
      <div className="flex flex-col items-center pt-1">
        <Dial day={day}>
          <DialCenter log={log} who="her" />
        </Dial>
        <p className="mt-3 max-w-[280px] text-center text-footnote text-ink-2">{herPhase[phaseOf(day)]}</p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Week start={log.start} />
        <Legend />
      </div>

      <div className="mt-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {started ? (
            <motion.div key="flow" initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={smooth}>
              <Card
                title="Period started today"
                aside={
                  <button type="button" onClick={onUndo} className="text-subhead text-ink-2 transition-colors hover:text-ink">
                    Undo
                  </button>
                }
              >
                <p className="mb-3 text-footnote text-ink-2">Flow · only you see this</p>
                <Segmented options={['Light', 'Medium', 'Heavy'] as const} value={log.flow} onChange={onFlow} />
              </Card>
            </motion.div>
          ) : (
            <motion.div key="log" initial={{ opacity: 0, filter: 'blur(6px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={smooth}>
              <Button full icon="drop" onClick={onStart}>
                Period started today
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Card title="Symptoms" aside={<span className="tnum text-subhead text-ink-3">{log.symptoms.length || ''}</span>} className="mt-4">
        <div className="flex flex-wrap gap-2">
          {symptomList.map((s) => (
            <Chip key={s} label={s} on={log.symptoms.includes(s)} onClick={() => onSymptom(s)} />
          ))}
        </div>
      </Card>

      <Card title="Feeling" aside={<span className="text-subhead text-ink-2">{mood?.name ?? 'Not set'}</span>} className="mt-4">
        <FeelingPicker value={log.mood ?? ''} onChange={onMood} />
      </Card>

      <ListGroup header="Shared with Alex" footer="Alex only sees what’s switched on. Flow and notes never leave your phone." className="mt-8">
        <ListRow title="Cycle and predictions" trailing={<Toggle on={log.share.phase} onChange={(v) => onShare('phase', v)} label="Share cycle and predictions" />} chevron={false} />
        <ListRow title="Symptoms" trailing={<Toggle on={log.share.symptoms} onChange={(v) => onShare('symptoms', v)} label="Share symptoms" />} chevron={false} />
        <ListRow title="Feeling" trailing={<Toggle on={log.share.mood} onChange={(v) => onShare('mood', v)} label="Share feeling" />} chevron={false} last />
      </ListGroup>
    </LargeTitleScreen>
  )
}

/* ---------- Your screen: read-only, with ways to help ---------- */

function HisCycle({ log, onBack, onCare }: { log: Log; onBack: () => void; onCare: (c: Care) => void }) {
  const day = dayOf(log.start)
  const [sent, setSent] = useState<string[]>([])
  const smooth = useSpring('smooth')
  const symptoms = log.share.symptoms ? log.symptoms : []
  const mood = log.share.mood ? feelings.find((f) => f.key === log.mood) : undefined
  const showToday = log.share.symptoms || log.share.mood
  const care = careFor(log)
  const fade = { initial: { opacity: 0, filter: 'blur(6px)' }, animate: { opacity: 1, filter: 'blur(0px)' }, exit: { opacity: 0, filter: 'blur(6px)' }, transition: smooth }

  return (
    <LargeTitleScreen title="Jamie" subtitle="Her cycle, shared with you" tab="Today" tabBar={false} leading={<IconButton icon="chevronLeft" label="Back to Today" variant="glass" size={36} onClick={onBack} />}>
      <AnimatePresence mode="popLayout" initial={false}>
        {log.share.phase ? (
          <motion.div key="dial" {...fade}>
            <div className="flex flex-col items-center pt-1">
              <Dial day={day}>
                <DialCenter log={log} who="him" />
              </Dial>
              <p className="tnum mt-3 text-center text-footnote text-ink-2">Next period around {longDate(nextStart(log.start))}</p>
            </div>
            <div className="mt-6">
              <Week start={log.start} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="private" {...fade}>
            <Card>
              <div className="flex flex-col items-center py-6 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-ink-2">
                  <Icon name="lock" size={22} />
                </span>
                <p className="mt-3 text-headline text-ink">Jamie isn’t sharing her cycle</p>
                <p className="mt-1 max-w-[240px] text-subhead text-ink-2">If she turns it on, you’ll see it here.</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showToday && (
          <motion.div key="today" {...fade} className="mt-6">
            <Card title="Today" aside={<span className="tnum text-footnote text-ink-3">Updated {log.at}</span>}>
              {mood && (
                <div className="mb-3 flex items-center gap-3">
                  <FeelingOrb feeling={mood.key} size={36} glow={false} />
                  <p className="text-body text-ink">Feeling {mood.name.toLowerCase()}</p>
                </div>
              )}
              {symptoms.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {symptoms.map((s) => (
                      <motion.span key={s} layout initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.8 }} transition={smooth} className="flex h-8 items-center rounded-full bg-surface-2 px-3 text-footnote font-medium text-ink">
                        {s}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                !mood && <p className="text-subhead text-ink-2">Nothing logged yet today.</p>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <ListGroup header="Ways to care" footer="Ideas come only from what Jamie shares." className="mt-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {care.map((c, i) => {
            const done = sent.includes(c.id)
            return (
              <motion.div key={c.id} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={smooth}>
                <ListRow
                  leading={
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink">
                      <Icon name={c.icon} size={18} weight="medium" />
                    </span>
                  }
                  title={c.title}
                  subtitle={c.body}
                  inset={64}
                  last={i === care.length - 1}
                  trailing={
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={done ? 'check' : undefined}
                      disabled={done}
                      onClick={() => {
                        setSent((s) => [...s, c.id])
                        onCare(c)
                      }}
                    >
                      {done ? 'Sent' : 'Send'}
                    </Button>
                  }
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </ListGroup>
    </LargeTitleScreen>
  )
}

/* ---------- Section ---------- */

const spec = [
  ['Dial', '28 dots, one per day. Past days full, future days at 30 %. An ink ring marks today'],
  ['Colour', 'Four tints of one rose family, one per phase. Nothing else on the screen is coloured'],
  ['Logging', 'Period, flow, symptoms and feeling. One tap each, undo always visible'],
  ['Sharing', 'Per category. Off means it never leaves her phone'],
  ['Partner', 'Read-only. Never sees flow or notes, and can’t change her log'],
  ['Alerts', 'Only “period started”, and only when she shares her cycle'],
  ['Navigation', 'Opens from Today with a push. Swipe from the left edge to go back'],
]

export function Cycle() {
  const [log, setLog] = useState<Log>({ start: LAST_START, flow: 'Medium', symptoms: ['Bloating', 'Fatigue'], mood: 'tired', share: { phase: true, symptoms: true, mood: true }, at: '08:12' })
  const [herOpen, setHerOpen] = useState(true)
  const [hisOpen, setHisOpen] = useState(true)
  const [herIsland, setHerIsland] = useState<ReactNode>(null)
  const [hisIsland, setHisIsland] = useState<ReactNode>(null)
  const timers = useRef<number[]>([])
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const flash = (set: (n: ReactNode) => void, node: ReactNode) => {
    set(node)
    later(2800, () => set(null))
  }
  const update = (patch: Partial<Log>) => setLog((l) => ({ ...l, ...patch, at: 'just now' }))

  const start = () => {
    update({ start: TODAY, flow: 'Medium' })
    if (log.share.phase)
      later(600, () =>
        flash(
          setHisIsland,
          <IslandRow
            leading={
              <span className="grid size-10 shrink-0 place-items-center rounded-full text-white" style={{ background: rose }}>
                <Icon name="drop" size={18} filled />
              </span>
            }
            title="Jamie’s period started"
            sub="Day 1 · logged just now"
            trailing={<Avatar initials="J" size={32} />}
          />,
        ),
      )
  }

  const care = (c: Care) =>
    later(500, () =>
      flash(
        setHerIsland,
        <IslandRow leading={<Avatar initials="A" size={40} />} title="Alex" sub={c.note} trailing={<Icon name="heart" size={22} filled className="text-[#EE9FB6]" />} />,
      ),
    )

  return (
    <Section
      id="cycle"
      index="12 — Cycle"
      title="Her cycle, shared with care."
      intro="Jamie logs her period, symptoms and how she feels. You see only what she chooses to share, turned into small, kind ways to help. Whatever she does on the left shows up on the right."
    >
      <div className="no-scrollbar -mx-6 overflow-x-auto px-6 pb-4">
        <div className="mx-auto flex w-max gap-12">
          <Phone label="Jamie’s iPhone · she logs" island={herIsland}>
            <Stack pushed={herOpen} onBack={() => setHerOpen(false)} root={<TodayRoot log={log} who="her" onOpen={() => setHerOpen(true)} />}>
              <HerCycle
                log={log}
                onBack={() => setHerOpen(false)}
                onStart={start}
                onUndo={() => update({ start: LAST_START })}
                onFlow={(flow) => update({ flow })}
                onSymptom={(s) => update({ symptoms: log.symptoms.includes(s) ? log.symptoms.filter((x) => x !== s) : [...log.symptoms, s] })}
                onMood={(mood) => update({ mood })}
                onShare={(k, v) => setLog((l) => ({ ...l, share: { ...l.share, [k]: v } }))}
              />
            </Stack>
          </Phone>
          <Phone label="Your iPhone · you see what she shares" island={hisIsland}>
            <Stack pushed={hisOpen} onBack={() => setHisOpen(false)} root={<TodayRoot log={log} who="him" onOpen={() => setHisOpen(true)} />}>
              <HisCycle log={log} onBack={() => setHisOpen(false)} onCare={care} />
            </Stack>
          </Phone>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <Block title="Try it" description="On Jamie’s phone, tap Period started today and the dial on yours moves to day 1. Add symptoms and the ideas on yours change. Send one and it arrives on hers. Turn sharing off and it disappears from yours.">
          <Rows>
            {spec.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[96px_1fr] gap-4 py-3 text-subhead">
                <span className="text-ink-3">{k}</span>
                <span className="text-ink">{v}</span>
              </div>
            ))}
          </Rows>
        </Block>
        <div className="flex flex-col gap-4 lg:pt-[68px]">
          <Note kind="do">Let her choose what to share, category by category. Keep flow and notes private by default.</Note>
          <Note kind="do">Turn what she shares into small, kind actions for her partner, not charts and data.</Note>
          <Note kind="do">Use the same dial on both phones, so you’re both looking at the same thing.</Note>
          <Note kind="dont">Let a partner edit or delete anything she has logged.</Note>
          <Note kind="dont">Notify the partner about every symptom. Only a period starting is worth an alert.</Note>
        </div>
      </div>
    </Section>
  )
}
