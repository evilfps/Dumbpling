import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bubble, Button, Composer, TypingBubble, Avatar, IconButton, cx, useReduce, useSpring, type Partner, type Reaction } from './ios'
import { Glass } from './glass'
import { Icon } from './icons'
import { snapShots } from '../photos'
import { motion as m } from '../tokens'

type Snap = { src: string; seconds: number; caption?: string; opened?: boolean }
export type Msg = { id: number; from: Partner; text?: string; plan?: boolean; reaction?: Reaction; snap?: Snap; system?: string }

export const seedThread: Msg[] = [
  { id: 1, from: 'them', text: 'Morning. Slept so well' },
  { id: 2, from: 'them', snap: { src: snapShots[0], seconds: 5, caption: 'Sunday light' } },
  { id: 3, from: 'them', text: 'Are we still on for Padella tonight?' },
  { id: 4, from: 'you', text: 'Yes, I added it to Plans', reaction: 'heart' },
  { id: 5, from: 'you', plan: true },
  { id: 6, from: 'them', text: 'Perfect. I’ll get there early and queue' },
]

const replies = ['Love that', 'Deal. See you at 19:30', 'Ha, perfect', 'Can’t wait']
const snapReplies = ['Stop, that’s so nice', 'Wish I was there', 'Saving that one']
const timers = [3, 5, 10, 0] as const

/** Shared plan. A calendar tile, the essentials, and one decision. Once answered it folds into a status line. */
function PlanCard() {
  const [rsvp, setRsvp] = useState<'going' | 'no' | null>(null)
  const smooth = useSpring('smooth')
  const reduce = useReduce()
  const enter = reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', scale: 0.98 }
  const shown = { opacity: 1, filter: 'blur(0px)', scale: 1 }
  return (
    <div className="flex justify-end">
      <motion.div layout={!reduce} transition={smooth} className="w-[252px] rounded-[20px] bg-surface p-3 shadow-[inset_0_0_0_0.5px_var(--line)]">
        <motion.div layout="position" className="flex items-center gap-3">
          <div className="flex size-[46px] shrink-0 flex-col items-center justify-center rounded-[12px] bg-surface-2">
            <span className="text-[10px] font-semibold uppercase leading-3 tracking-[0.08em] text-ink-2">Sat</span>
            <span className="tnum text-[20px] font-semibold leading-6 tracking-[-0.02em] text-ink">14</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-headline text-ink">Dinner at Padella</p>
            <p className="tnum truncate text-footnote text-ink-2">19:30 · Borough Market</p>
          </div>
        </motion.div>
        <AnimatePresence mode="popLayout" initial={false}>
          {rsvp ? (
            <motion.div key="status" initial={enter} animate={shown} exit={{ opacity: 0 }} transition={smooth} className="mt-3 flex h-9 items-center justify-between rounded-full bg-surface-2 pl-1.5 pr-1">
              <span className="flex items-center gap-2 text-subhead font-medium text-ink">
                <span
                  className={cx('grid size-6 place-items-center rounded-full', rsvp === 'no' && 'bg-fill text-ink-2')}
                  style={rsvp === 'going' ? { backgroundImage: 'var(--btn-bg)', color: 'var(--btn-fg)' } : undefined}
                >
                  <Icon name={rsvp === 'going' ? 'check' : 'close'} size={13} weight="bold" />
                </span>
                {rsvp === 'going' ? 'You’re both going' : 'You can’t make it'}
              </span>
              <button type="button" onClick={() => setRsvp(null)} className="h-7 rounded-full px-3 text-footnote font-medium text-ink-2 transition-colors hover:text-ink">
                Change
              </button>
            </motion.div>
          ) : (
            <motion.div key="ask" initial={enter} animate={shown} exit={{ opacity: 0 }} transition={smooth} className="mt-3 grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => setRsvp('going')}>
                Going
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setRsvp('no')}>
                Can’t go
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ---------- Snap message states ---------- */

function SnapMessage({ msg, onOpen }: { msg: Msg; onOpen: () => void }) {
  const snap = msg.snap!
  const mine = msg.from === 'you'
  const snappy = useSpring('snappy')
  const reduce = useReduce()
  const label = snap.seconds ? `${snap.seconds}s` : '∞'

  if (mine || snap.opened) {
    return (
      <div className={cx('flex', mine ? 'justify-end' : 'justify-start')}>
        <div
          className={cx('flex h-9 items-center gap-2 rounded-[18px] pl-3 pr-3.5 text-subhead font-medium', mine ? '' : 'bg-[var(--bubble-them)] text-ink-2')}
          style={mine ? { backgroundImage: 'linear-gradient(180deg, var(--bubble-me-top), var(--bubble-me))', color: 'var(--bubble-me-fg)' } : undefined}
        >
          <Icon name="snap" size={16} weight="semibold" filled={mine && !snap.opened} />
          <span>{mine ? (snap.opened ? 'Opened' : 'Snap sent') : 'Opened'}</span>
          <span className="tnum opacity-50">{label}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <motion.button
        type="button"
        onClick={onOpen}
        whileTap={reduce ? { opacity: 0.7 } : { scale: 0.97 }}
        transition={snappy}
        className="flex items-center gap-3 rounded-[20px] bg-[var(--bubble-them)] py-1.5 pl-1.5 pr-4 text-left"
        aria-label={`Snap from Jamie, ${snap.seconds ? `${snap.seconds} seconds` : 'no time limit'}. Tap to view.`}
      >
        <span className="relative size-11 shrink-0 overflow-hidden rounded-[14px] bg-black">
          <img src={snap.src} alt="" className="size-full scale-150 object-cover opacity-80 blur-[8px]" draggable={false} />
          <span className="absolute inset-0 grid place-items-center text-white">
            <Icon name="snap" size={18} filled weight="semibold" />
          </span>
        </span>
        <span className="flex flex-col">
          <span className="text-headline text-ink">New snap</span>
          <span className="tnum text-footnote text-ink-2">Tap to view · {label}</span>
        </span>
        <span className="ml-2 size-2 rounded-full bg-ink" aria-hidden />
      </motion.button>
    </div>
  )
}

/* ---------- Viewer: tap to close, hold to pause ---------- */

function SnapViewer({ snap, onDone }: { snap: Snap; onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const paused = useRef(false)
  const downAt = useRef(0)
  const done = useRef(onDone)
  done.current = onDone
  const duration = (snap.seconds || 8) * 1000

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let elapsed = 0
    const tick = (now: number) => {
      if (!paused.current) elapsed += now - last
      last = now
      const p = Math.min(1, elapsed / duration)
      setProgress(p)
      if (p >= 1 && snap.seconds) return done.current()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, snap.seconds])

  return (
    <motion.div
      className="absolute inset-0 z-[66] overflow-hidden rounded-[inherit] bg-black text-white"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02, transition: m.fade }}
      transition={m.smooth}
      onPointerDown={() => {
        paused.current = true
        downAt.current = performance.now()
      }}
      onPointerUp={() => {
        paused.current = false
        if (performance.now() - downAt.current < 220) onDone()
      }}
    >
      <img src={snap.src} alt="Snap from Jamie" className="absolute inset-0 size-full select-none object-cover" draggable={false} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-x-4 top-[60px]">
        <div className="h-[3px] overflow-hidden rounded-full bg-white/30">
          <div className="h-full rounded-full bg-white" style={{ width: `${(snap.seconds ? progress : 1) * 100}%` }} />
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <Avatar initials="J" size={32} />
          <div className="leading-tight">
            <p className="text-subhead font-semibold">Jamie</p>
            <p className="tnum text-caption-1 text-white/70">09:31 · {snap.seconds ? `${snap.seconds}s` : 'No limit'}</p>
          </div>
        </div>
      </div>
      {snap.caption && (
        <div className="lg lg-clear absolute inset-x-0 top-[58%] py-2.5 text-center text-body font-medium">
          <span className="relative z-[2]">{snap.caption}</span>
        </div>
      )}
      <p className="absolute inset-x-0 bottom-12 text-center text-footnote text-white/60">Hold to pause · Tap to close</p>
    </motion.div>
  )
}

/* ---------- Camera ---------- */

function SnapCamera({ onClose, onSend }: { onClose: () => void; onSend: (s: Snap) => void }) {
  const [shot, setShot] = useState<string | null>(null)
  const [lens, setLens] = useState(1)
  const [flash, setFlash] = useState(false)
  const [burst, setBurst] = useState(0)
  const [timer, setTimer] = useState<(typeof timers)[number]>(5)
  const [caption, setCaption] = useState('')
  const liquid = useSpring('liquid')
  const reduce = useReduce()
  const src = shot ?? snapShots[lens]

  return (
    <motion.div
      className="absolute inset-0 z-[66] overflow-hidden rounded-[inherit] bg-black text-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40, transition: m.fade }}
      transition={m.smooth}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-cover"
          style={{ animation: shot || reduce ? undefined : 'kenburns 14s ease-in-out infinite alternate' }}
          initial={{ opacity: 0, filter: 'blur(16px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0 }}
          transition={m.smooth}
        />
      </AnimatePresence>
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Flash on capture */}
      <AnimatePresence>
        {burst > 0 && (
          <motion.div key={burst} className="absolute inset-0 z-10 bg-white" initial={{ opacity: flash ? 1 : 0.7 }} animate={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }} />
        )}
      </AnimatePresence>

      {/* Top row: close · recipient · timer */}
      <div className="absolute inset-x-4 top-[58px] z-20 grid grid-cols-[44px_1fr_44px] items-center">
        <IconButton icon="close" label={shot ? 'Retake' : 'Close camera'} variant="clear" size={40} onClick={() => (shot ? setShot(null) : onClose())} />
        <div className="flex justify-center">
          <Glass variant="clear" className="flex h-9 items-center gap-2 rounded-full pl-1 pr-3.5">
            <span className="relative z-[2]">
              <Avatar initials="J" size={28} />
            </span>
            <span className="relative z-[2] text-subhead font-semibold">Jamie</span>
          </Glass>
        </div>
        <Glass
          as="button"
          interactive
          variant="clear"
          label={`Timer ${timer || 'no limit'}`}
          onClick={() => setTimer(timers[(timers.indexOf(timer) + 1) % timers.length])}
          className="tnum grid size-10 place-items-center rounded-full text-footnote font-semibold"
        >
          <span className="relative z-[2]">{timer ? `${timer}s` : '∞'}</span>
        </Glass>
      </div>

      {/* Bottom */}
      <div className="absolute inset-x-0 bottom-[44px] z-20 px-6">
        {shot ? (
          <motion.div className="flex flex-col gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={m.smooth}>
            <Glass variant="clear" className="flex h-11 items-center rounded-full px-4">
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption"
                className="relative z-[2] w-full bg-transparent text-body text-white outline-none placeholder:text-white/60"
              />
            </Glass>
            <div className="grid grid-cols-[48px_1fr_48px] items-center gap-4">
              <IconButton icon="share" label="Save" variant="clear" size={48} />
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                transition={liquid}
                onClick={() => onSend({ src: shot, seconds: timer, caption: caption.trim() || undefined })}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-white text-headline text-black shadow-[0_8px_24px_-6px_rgb(0_0_0/0.4)]"
              >
                Send to Jamie <Icon name="arrowUp" size={18} weight="bold" className="rotate-90" />
              </motion.button>
              <span />
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-[48px_1fr_48px] items-center">
            <IconButton icon="flash" label={flash ? 'Flash on' : 'Flash off'} variant="clear" size={48} filled={flash} onClick={() => setFlash((f) => !f)} />
            <div className="flex justify-center">
              <motion.button
                type="button"
                aria-label="Take snap"
                onClick={() => {
                  setBurst((b) => b + 1)
                  setShot(snapShots[lens])
                }}
                className="group grid size-[82px] place-items-center rounded-full border-[5px] border-white"
              >
                <motion.span className="block size-[62px] rounded-full bg-white" whileTap={{ scale: 0.84 }} transition={liquid} />
              </motion.button>
            </div>
            <IconButton icon="flip" label="Flip camera" variant="clear" size={48} onClick={() => setLens((l) => (l + 1) % snapShots.length)} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ---------- Thread ---------- */

export function Conversation({ className, composerClassName }: { className?: string; composerClassName?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>(seedThread)
  const [typing, setTyping] = useState(false)
  const [camera, setCamera] = useState(false)
  const [viewing, setViewing] = useState<Msg | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const replyIndex = useRef(0)
  const pending = useRef<number[]>([])
  const smooth = useSpring('smooth')
  const reduce = useReduce()

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [msgs, typing, reduce])

  useEffect(() => () => pending.current.forEach(clearTimeout), [])

  const later = (ms: number, fn: () => void) => pending.current.push(window.setTimeout(fn, ms))
  const reply = (list: string[]) => {
    later(900, () => setTyping(true))
    later(2900, () => {
      setTyping(false)
      setMsgs((mm) => [...mm, { id: Date.now(), from: 'them', text: list[replyIndex.current++ % list.length] }])
    })
  }

  const send = (text: string) => {
    setMsgs((mm) => [...mm, { id: Date.now(), from: 'you', text }])
    reply(replies)
  }

  const sendSnap = (snap: Snap) => {
    const id = Date.now()
    setCamera(false)
    setMsgs((mm) => [...mm, { id, from: 'you', snap }])
    later(1800, () => setMsgs((mm) => mm.map((x) => (x.id === id ? { ...x, snap: { ...x.snap!, opened: true } } : x))))
    later(400, () => reply(snapReplies))
  }

  const lastMine = [...msgs].reverse().find((x) => x.from === 'you' && !x.snap)?.id

  return (
    <>
      <div className={cx('flex min-h-0 flex-col', className)}>
        <div ref={scroller} className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col justify-end px-4 pb-3 pt-6">
            <p className="tnum mb-4 text-center text-caption-1 text-ink-3">
              <span className="font-semibold">Today</span> 09:12
            </p>
            {msgs.map((msg, i) => {
              const next = msgs[i + 1]
              const prev = msgs[i - 1]
              const groupEnd = !next || next.from !== msg.from || Boolean(next.snap)
              const newGroup = (prev && prev.from !== msg.from) || msg.snap || prev?.snap
              const seeded = msg.id < 100
              return (
                <motion.div
                  key={msg.id}
                  layout={reduce ? false : 'position'}
                  initial={seeded ? false : reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={smooth}
                  style={{ transformOrigin: msg.from === 'you' ? '100% 100%' : '0% 100%' }}
                  className={cx(newGroup ? 'mt-2.5' : i > 0 && 'mt-[2px]', msg.reaction && 'mt-4')}
                >
                  {msg.plan ? (
                    <PlanCard />
                  ) : msg.snap ? (
                    <SnapMessage msg={msg} onOpen={() => setViewing(msg)} />
                  ) : (
                    <Bubble from={msg.from} tail={groupEnd} reactable reaction={msg.reaction}>
                      {msg.text}
                    </Bubble>
                  )}
                  {msg.id === lastMine && (!next || next.from !== 'you') && (
                    <p className="tnum mt-1 pr-1 text-right text-caption-2 font-medium text-ink-3">{i === msgs.length - 1 ? 'Delivered' : 'Read 09:20'}</p>
                  )}
                </motion.div>
              )
            })}
            <AnimatePresence>
              {typing && (
                <motion.div
                  className="mt-2.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
                  transition={smooth}
                  style={{ transformOrigin: '0% 100%' }}
                >
                  <TypingBubble />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className={cx('px-3 pt-2', composerClassName)}>
          <Composer onSend={send} onCamera={() => setCamera(true)} />
        </div>
      </div>

      <AnimatePresence>{camera && <SnapCamera key="camera" onClose={() => setCamera(false)} onSend={sendSnap} />}</AnimatePresence>
      <AnimatePresence>
        {viewing?.snap && (
          <SnapViewer
            key="viewer"
            snap={viewing.snap}
            onDone={() => {
              const id = viewing.id
              setViewing(null)
              setMsgs((mm) => mm.map((x) => (x.id === id ? { ...x, snap: { ...x.snap!, opened: true } } : x)))
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
