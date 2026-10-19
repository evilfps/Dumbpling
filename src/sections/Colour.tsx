import { useState } from 'react'
import { contrast, cycle, feelings, neutrals } from '../tokens'
import { Block, Note, Rows, Section, Stage } from '../components/doc'
import { FeelingOrb, useSpring } from '../components/ios'
import { motion, AnimatePresence } from 'motion/react'

function Ramp({ mode }: { mode: 'light' | 'dark' }) {
  return (
    <div>
      <p className="mb-3 text-footnote text-ink-2">{mode === 'light' ? 'Light' : 'Dark'}</p>
      <div className="grid grid-cols-8 overflow-hidden rounded-[20px] shadow-[inset_0_0_0_0.5px_var(--line)]">
        {neutrals.map((n) => (
          <div key={n.token} className="h-28 shadow-[inset_0_0_0_0.5px_rgb(128_128_128/0.12)]" style={{ background: mode === 'light' ? n.light : n.dark }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-8 gap-2">
        {neutrals.map((n) => (
          <div key={n.token} className="min-w-0">
            <p className="truncate text-footnote font-medium text-ink">{n.token}</p>
            <p className="tnum truncate font-mono text-[10.5px] text-ink-3">{mode === 'light' ? n.light : n.dark}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CycleRing() {
  const day = 26
  const size = 220
  const r = 96
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {Array.from({ length: 28 }, (_, i) => {
        const d = i + 1
        const phase = d <= 5 ? 0 : d <= 13 ? 1 : d <= 16 ? 2 : 3
        const a = (i / 28) * Math.PI * 2 - Math.PI / 2
        const x = size / 2 + Math.cos(a) * r
        const y = size / 2 + Math.sin(a) * r
        const today = d === day
        return <circle key={d} cx={x} cy={y} r={today ? 7.5 : 4.5} fill={cycle[phase].c} opacity={d > day ? 0.45 : 1} stroke={today ? 'var(--ink)' : 'none'} strokeWidth={today ? 2 : 0} />
      })}
      <text x="50%" y="47%" textAnchor="middle" className="fill-ink-2 text-[13px]">
        Day
      </text>
      <text x="50%" y="62%" textAnchor="middle" className="fill-ink text-[36px] font-semibold tracking-[-0.03em]">
        18
      </text>
    </svg>
  )
}

export function Colour() {
  const [active, setActive] = useState('calm')
  const f = feelings.find((x) => x.key === active)!
  const gentle = useSpring('gentle')
  return (
    <Section
      id="colour"
      index="03 — Colour"
      title="Monochrome, until it matters."
      intro="The interface uses eight greys. Light mode is paper white and dark mode is true OLED black. Colour appears only when it describes a person, so when it shows up, it means something."
    >
      <Block title="Neutrals" description="These are the same eight tokens in both appearances. Every screen should work with these alone.">
        <div className="flex flex-col gap-10">
          <Ramp mode="light" />
          <Ramp mode="dark" />
        </div>
      </Block>

      <Block title="Feelings" description="Six soft hues, one for each feeling in a check-in. They are only ever used as light: fills, orbs and glows. Text never sits in a feeling colour. Select one to see it.">
        <Stage className="grid items-center gap-10 overflow-hidden py-14 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col items-center gap-8">
            <FeelingOrb feeling={active} size={200} />
            <div className="h-14 text-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={f.key} initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={gentle}>
                  <p className="text-lit text-title-2">{f.name}</p>
                  <p className="text-subhead text-ink-2">{f.note}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6">
            {feelings.map((x) => (
              <button key={x.key} type="button" onClick={() => setActive(x.key)} className="group flex flex-col items-start gap-3 text-left" aria-pressed={x.key === active}>
                <span
                  className="relative h-20 w-full rounded-[18px] transition-transform duration-300 group-active:scale-[0.97]"
                  style={{ background: `linear-gradient(160deg, ${x.b}, ${x.a} 55%, ${x.deep})`, boxShadow: x.key === active ? '0 0 0 2px var(--stage), 0 0 0 3.5px var(--ink)' : undefined }}
                />
                <span>
                  <span className="block text-subhead font-medium text-ink">{x.name}</span>
                  <span className="tnum block font-mono text-[10.5px] text-ink-3">{x.a}</span>
                </span>
              </button>
            ))}
          </div>
        </Stage>
      </Block>

      <Block title="Cycle" description="Cycle tracking uses a single rose family in four tints, one per phase. Future days are shown at reduced strength. Today is marked with an ink ring, never with an alarm colour.">
        <Stage className="flex flex-col items-center gap-10 py-12 md:flex-row md:justify-center md:gap-20">
          <CycleRing />
          <div className="flex flex-col gap-5">
            {cycle.map((c) => (
              <div key={c.name} className="flex items-center gap-4">
                <span className="size-4 rounded-full" style={{ background: c.c }} />
                <div>
                  <p className="text-subhead font-medium text-ink">{c.name}</p>
                  <p className="text-footnote text-ink-3">{c.days}</p>
                </div>
              </div>
            ))}
          </div>
        </Stage>
      </Block>

      <div className="grid gap-16 md:grid-cols-2">
        <Block title="Functional" description="Only two other colours exist, and each has a single job.">
          <Rows>
            <div className="flex items-center gap-4 py-4">
              <span className="size-3 rounded-full bg-alert" />
              <span className="flex-1 text-subhead text-ink">Alert</span>
              <span className="text-subhead text-ink-2">Destructive actions, errors</span>
            </div>
            <div className="flex items-center gap-4 py-4">
              <span className="size-3 rounded-full bg-live" />
              <span className="flex-1 text-subhead text-ink">Live</span>
              <span className="text-subhead text-ink-2">Presence dot only</span>
            </div>
          </Rows>
        </Block>
        <Block title="Contrast" description="WCAG 2.2 AA for all text in both appearances.">
          <Rows>
            {contrast.map((c) => (
              <div key={c.pair} className="tnum flex items-center py-4 text-subhead">
                <span className="flex-1 text-ink">{c.pair}</span>
                <span className="w-16 text-right text-ink-2">{c.light}</span>
                <span className="w-16 text-right text-ink-2">{c.dark}</span>
              </div>
            ))}
          </Rows>
        </Block>
      </div>

      <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
        <Note kind="do">Show who owns something with an avatar or a name. Your items use solid ink, your partner’s use ink at 40%.</Note>
        <Note kind="dont">Give each partner a colour. Colour belongs to feelings, so it shouldn’t be used to show ownership.</Note>
        <Note kind="do">Make the primary action ink: black in light mode and white in dark mode.</Note>
        <Note kind="dont">Use red to grab attention. Badges and reminders stay monochrome.</Note>
      </div>
    </Section>
  )
}
