import { useState } from 'react'
import { motion } from 'motion/react'
import { Section } from '../components/doc'
import { LargeTitleScreen } from '../components/screen'
import { Gauge } from '../components/water'
import { Phone } from '../components/Phone'
import { Conversation } from '../components/Conversation'
import { Icon } from '../components/icons'
import { Avatar, AvatarPair, Button, FeelingOrb, FeelingPicker, IconButton, ListGroup, ListRow, NumberText, Segmented, Sheet, Toggle, cx, useSpring } from '../components/ios'
import { cycle, feelings } from '../tokens'

function MiniCycle() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      {Array.from({ length: 28 }, (_, i) => {
        const d = i + 1
        const p = d <= 5 ? 0 : d <= 13 ? 1 : d <= 16 ? 2 : 3
        const a = (i / 28) * Math.PI * 2 - Math.PI / 2
        return <circle key={d} cx={22 + Math.cos(a) * 18} cy={22 + Math.sin(a) * 18} r={d === 26 ? 3 : 1.8} fill={cycle[p].c} opacity={d > 26 ? 0.4 : 1} />
      })}
    </svg>
  )
}

function TodayScreen() {
  const [open, setOpen] = useState(false)
  const [mine, setMine] = useState<string | null>(null)
  const [pick, setPick] = useState('calm')
  const [water, setWater] = useState(5)
  const gentle = useSpring('gentle')
  const f = feelings.find((x) => x.key === pick)!
  const minef = feelings.find((x) => x.key === mine)
  return (
    <>
      <LargeTitleScreen title="Today" subtitle="Saturday 14 June" tab="Today" trailing={<AvatarPair size={30} ring="var(--canvas)" />}>
        <article className="rounded-lg bg-surface p-4">
          <div className="flex items-center gap-4">
            <FeelingOrb feeling="tender" size={52} glow={false} />
            <div className="flex-1">
              <p className="text-headline text-ink">Jamie feels tender</p>
              <p className="tnum text-subhead text-ink-2">Checked in at 08:12</p>
            </div>
          </div>
          <div className="my-4 hairline bg-line" />
          <div className="flex h-[52px] items-center gap-4">
            {minef ? (
              <motion.div className="flex flex-1 items-center gap-4" initial={{ opacity: 0, filter: 'blur(6px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={gentle}>
                <FeelingOrb feeling={minef.key} size={52} glow={false} />
                <div className="flex-1">
                  <p className="text-headline text-ink">You feel {minef.name.toLowerCase()}</p>
                  <p className="text-subhead text-ink-2">Shared just now</p>
                </div>
              </motion.div>
            ) : (
              <>
                <span className="grid size-[52px] place-items-center rounded-full shadow-[inset_0_0_0_1.5px_var(--line)] text-ink-3">
                  <Icon name="plus" size={20} />
                </span>
                <div className="flex-1">
                  <p className="text-headline text-ink">How are you?</p>
                  <p className="text-subhead text-ink-2">Not checked in yet</p>
                </div>
                <Button size="sm" onClick={() => setOpen(true)}>
                  Check in
                </Button>
              </>
            )}
          </div>
        </article>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <article className="flex h-[132px] flex-col justify-between rounded-lg bg-surface p-4">
            <p className="text-subhead text-ink-2">Together</p>
            <div>
              <p className="text-lit tnum text-title-1">1,204</p>
              <p className="text-footnote text-ink-2">days</p>
            </div>
          </article>
          <article className="flex h-[132px] flex-col justify-between rounded-lg bg-surface p-4">
            <div className="flex items-start justify-between">
              <p className="text-subhead text-ink-2">Cycle</p>
              <MiniCycle />
            </div>
            <div>
              <p className="text-lit tnum text-title-1">Day 26</p>
              <p className="text-footnote text-ink-2">Period in 3 days</p>
            </div>
          </article>
        </div>

        <article className="mt-3 flex items-center gap-4 rounded-lg bg-surface p-4">
          <Gauge value={water} size={52} stroke={5} color={feelings[2].deep} track="var(--fill)">
            <span className="tnum text-subhead font-semibold text-ink">
              <NumberText value={water} />
            </span>
          </Gauge>
          <div className="flex-1">
            <p className="text-headline text-ink">Jamie’s water</p>
            <p className="tnum text-subhead text-ink-2">{water} of 8 glasses · last at 13:20</p>
          </div>
          <Button size="sm" variant="secondary" icon="water" onClick={() => setWater((w) => Math.min(8, w + 1))}>
            Nudge
          </Button>
        </article>

        <h2 className="mb-2 mt-8 px-1 text-title-3 text-ink">Up next</h2>
        <ListGroup>
          {[
            ['19:30', 'Dinner at Padella', 'Tonight · Borough Market', 'both'],
            ['Tue', 'Sam’s birthday', 'Card is in the drawer', 'J'],
            ['Wed', 'Big shop', 'Shared list · 12 items', 'A'],
          ].map(([t, a, b, w], i, arr) => (
            <ListRow
              key={a}
              leading={<span className="tnum w-11 text-subhead font-medium text-ink-2">{t}</span>}
              title={a}
              subtitle={b}
              trailing={w === 'both' ? <AvatarPair size={24} ring="var(--surface)" /> : <Avatar initials={w} size={24} />}
              inset={72}
              last={i === arr.length - 1}
            />
          ))}
        </ListGroup>
        <div className="h-40" />
      </LargeTitleScreen>

      <Sheet open={open} onClose={() => setOpen(false)}>
        <p className="text-center text-headline text-ink">How are you feeling?</p>
        <div className="my-7 flex flex-col items-center gap-3">
          <FeelingOrb feeling={pick} size={132} />
          <p className="text-lit mt-2 text-title-2">{f.name}</p>
          <p className="text-subhead text-ink-2">{f.note}</p>
        </div>
        <FeelingPicker value={pick} onChange={setPick} />
        <div className="mt-7">
          <Button
            full
            onClick={() => {
              setMine(pick)
              setOpen(false)
            }}
          >
            Share with Jamie
          </Button>
        </div>
      </Sheet>
    </>
  )
}

function MessagesScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative z-30 bg-gradient-to-b from-canvas via-canvas/90 to-canvas/0 pb-2 pt-[54px] backdrop-blur-[6px]" style={{ maskImage: 'linear-gradient(black 80%, transparent)', WebkitMaskImage: 'linear-gradient(black 80%, transparent)' }}>
        <div className="relative flex h-[74px] flex-col items-center justify-center gap-1">
          <span className="absolute left-2 top-2">
            <IconButton icon="chevronLeft" label="Back" size={36} variant="glass" />
          </span>
          <Avatar initials="J" size={44} />
          <span className="flex items-center gap-0.5 text-caption-1 font-medium text-ink">
            Jamie <Icon name="chevronRight" size={11} weight="semibold" className="text-ink-3" />
          </span>
        </div>
      </div>
      <Conversation className="min-h-0 flex-1" composerClassName="pb-[38px]" />
    </div>
  )
}

const week = [
  { d: 'M', n: 9, p: 0 },
  { d: 'T', n: 10, p: 1 },
  { d: 'W', n: 11, p: 1 },
  { d: 'T', n: 12, p: 0 },
  { d: 'F', n: 13, p: 2 },
  { d: 'S', n: 14, p: 2 },
  { d: 'S', n: 15, p: 1 },
]

function PlansScreen() {
  const [view, setView] = useState<'Upcoming' | 'Ideas' | 'Past'>('Upcoming')
  const [day, setDay] = useState(14)
  const [mineAmt, setMineAmt] = useState(680)
  const jamie = 560
  const total = mineAmt + jamie
  const snappy = useSpring('snappy')
  const smooth = useSpring('smooth')
  return (
    <LargeTitleScreen title="Plans" tab="Plans" trailing={<IconButton icon="plus" label="New plan" size={34} variant="glass" />}>
      <Segmented options={['Upcoming', 'Ideas', 'Past'] as const} value={view} onChange={setView} />

      <div className="mt-5 flex justify-between px-1">
        {week.map((w) => {
          const on = w.n === day
          return (
            <button key={w.n} type="button" onClick={() => setDay(w.n)} className="relative flex h-[68px] w-11 flex-col items-center justify-center gap-1">
              {on && <motion.span layoutId="plans-day" transition={snappy} className="absolute inset-0 rounded-full" style={{ backgroundImage: 'var(--btn-bg)', boxShadow: 'var(--btn-shadow)' }} />}
              <span className={cx('relative text-caption-2 font-medium', on ? 'text-[var(--btn-fg)] opacity-60' : 'text-ink-3')}>{w.d}</span>
              <span className={cx('tnum relative text-headline', on ? 'text-[var(--btn-fg)]' : 'text-ink')}>{w.n}</span>
              <span className="relative flex h-1 gap-[3px]">
                {Array.from({ length: w.p }, (_, i) => (
                  <span key={i} className={cx('size-1 rounded-full', on ? 'bg-[var(--btn-fg)]' : 'bg-ink-3')} />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <ListGroup header="Saturday 14 June" className="mt-6">
        <ListRow leading={<span className="tnum w-11 text-subhead font-medium text-ink-2">10:00</span>} title="Farmers’ market" subtitle="Broadway Market" trailing={<Avatar initials="A" size={24} />} inset={72} />
        <ListRow leading={<span className="tnum w-11 text-subhead font-medium text-ink-2">19:30</span>} title="Dinner at Padella" subtitle="Borough Market" trailing={<AvatarPair size={24} ring="var(--surface)" />} inset={72} last />
      </ListGroup>
      <ListGroup header="Sunday 15 June" className="mt-6">
        <ListRow leading={<span className="tnum w-11 text-subhead font-medium text-ink-2">14:00</span>} title="Call Jamie’s mum" subtitle="FaceTime" trailing={<Avatar initials="J" size={24} />} inset={72} last />
      </ListGroup>

      <h2 className="mb-2 mt-8 px-1 text-title-3 text-ink">Saving for</h2>
      <article className="rounded-lg bg-surface p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-subhead text-ink-2">Lisbon in October</p>
            <p className="text-lit mt-1 text-title-1">
              <NumberText value={total} format={(n) => `£${n.toLocaleString('en-GB')}`} />
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setMineAmt((v) => v + 20)}>
            Add £20
          </Button>
        </div>
        <div className="mt-4 flex h-1.5 gap-[2px] overflow-hidden rounded-full bg-fill">
          <motion.span className="h-full rounded-l-full bg-ink" animate={{ width: `${(mineAmt / 2000) * 100}%` }} transition={smooth} />
          <span className="h-full bg-ink opacity-40" style={{ width: `${(jamie / 2000) * 100}%` }} />
        </div>
        <p className="tnum mt-2.5 flex justify-between text-footnote text-ink-2">
          <span>
            You £{mineAmt} · Jamie £{jamie}
          </span>
          <span>of £2,000</span>
        </p>
      </article>
    </LargeTitleScreen>
  )
}

export function Screens() {
  const [grid, setGrid] = useState(false)
  return (
    <Section
      id="screens"
      index="15 — In use"
      title="Put together."
      intro="Three core screens built only from the tokens and components above, at the real 393 × 852 pt size. Turn on the layout grid to see what everything aligns to: 16 pt edges, 20 pt titles, 32 pt content and the centre axis."
    >
      <div className="-mt-8 flex justify-end">
        <label className="flex items-center gap-3 rounded-full bg-stage py-1.5 pl-4 pr-1.5">
          <span className="text-subhead font-medium text-ink">Layout grid</span>
          <Toggle on={grid} onChange={setGrid} label="Show layout grid" />
        </label>
      </div>
      <div className="no-scrollbar -mx-6 -mt-16 overflow-x-auto px-6 pb-6">
        <div className="mx-auto flex w-max gap-10 xl:[zoom:0.88]">
          <Phone label="Today" grid={grid}>
            <TodayScreen />
          </Phone>
          <Phone label="Messages" grid={grid}>
            <MessagesScreen />
          </Phone>
          <Phone label="Plans" grid={grid}>
            <PlansScreen />
          </Phone>
        </div>
      </div>
    </Section>
  )
}
