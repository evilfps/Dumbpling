import { useState } from 'react'
import { motion } from 'motion/react'
import { glyphs, Icon, type IconName } from '../components/icons'
import { Block, Note, Section, Spec, Stage } from '../components/doc'
import { Segmented, cx, useSpring } from '../components/ios'

const names = Object.keys(glyphs) as IconName[]
const weightMap = { Light: 'light', Regular: 'regular', Semibold: 'semibold' } as const

function Plate({ name }: { name: IconName }) {
  const snappy = useSpring('snappy')
  const cells = Array.from({ length: 25 }, (_, i) => i)
  return (
    <div className="relative aspect-square w-full max-w-[360px]">
      <svg viewBox="0 0 24 24" className="absolute inset-0 size-full text-line" aria-hidden>
        {cells.map((i) => (
          <g key={i}>
            <line x1={i} x2={i} y1={0} y2={24} stroke="currentColor" strokeWidth={0.03} />
            <line y1={i} y2={i} x1={0} x2={24} stroke="currentColor" strokeWidth={0.03} />
          </g>
        ))}
        <rect x="2" y="2" width="20" height="20" fill="none" stroke="var(--ink-3)" strokeWidth={0.04} strokeDasharray="0.3 0.3" />
        <circle cx="12" cy="12" r="10" fill="none" stroke="var(--ink-3)" strokeWidth={0.04} strokeDasharray="0.3 0.3" />
        <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="none" stroke="var(--ink-3)" strokeWidth={0.04} strokeDasharray="0.3 0.3" />
      </svg>
      <motion.div key={name} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={snappy} className="absolute inset-0 text-ink">
        <Icon name={name} size={360} weight="regular" filled={false} className="size-full" />
      </motion.div>
    </div>
  )
}

export function Iconography() {
  const [active, setActive] = useState<IconName>('messages')
  const [weight, setWeight] = useState<keyof typeof weightMap>('Regular')
  const [filled, setFilled] = useState<'Outline' | 'Filled'>('Outline')
  return (
    <Section
      id="icons"
      index="04 — Iconography"
      title="Drawn, not downloaded."
      intro="A small set of glyphs, all built on one grid with one stroke and one set of corner rules. In the app, each glyph maps to the SF Symbol named below it, so they scale with Dynamic Type. These drawings exist for brand surfaces and for this page."
    >
      <Stage className="grid items-center gap-12 p-10 md:grid-cols-[360px_1fr]">
        <Plate name={active} />
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-title-2 text-ink">{active}</p>
            <p className="mt-1 font-mono text-[12px] text-ink-3">SF Symbol · {glyphs[active].sf}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-subhead">
            {[
              ['Grid', '24 × 24 pt'],
              ['Live area', '20 pt, 2 pt padding'],
              ['Stroke', '1.6 at Regular'],
              ['Caps and joins', 'Round'],
              ['Corner radius', '2.75–3.5 pt'],
              ['Optical size', 'Circle 20, square 17'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-footnote text-ink-3">{k}</dt>
                <dd className="mt-0.5 text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-footnote text-ink-3">The dashed keylines show the circle, square and live-area guides. Select any glyph below to inspect it.</p>
        </div>
      </Stage>

      <Block
        title="The set"
        description="Use the outline style by default. The filled style marks a selected state, such as the current tab. Match the weight to the text beside the icon."
        aside={
          <div className="flex flex-wrap gap-3">
            <Segmented className="w-[240px]" options={['Light', 'Regular', 'Semibold'] as const} value={weight} onChange={setWeight} />
            <Segmented className="w-[170px]" options={['Outline', 'Filled'] as const} value={filled} onChange={setFilled} />
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[28px] bg-line sm:grid-cols-5 lg:grid-cols-8">
          {names.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setActive(n)}
              className={cx('group flex aspect-square flex-col items-center justify-center gap-3 bg-stage transition-colors', active === n ? 'bg-surface dark:bg-surface-2' : 'hover:bg-surface/60')}
            >
              <Icon name={n} size={28} weight={weightMap[weight]} filled={filled === 'Filled'} className="text-ink transition-transform duration-300 group-active:scale-90" />
              <span className="font-mono text-[10px] text-ink-3">{n}</span>
            </button>
          ))}
        </div>
      </Block>

      <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
        <Note kind="do">Use 17 pt icons inline with body text, 20 pt in toolbars and 24 pt in the tab bar.</Note>
        <Note kind="dont">Put icons inside coloured tiles or circles to fill space. If a row reads clearly without an icon, leave it out.</Note>
        <Note kind="do">Label every icon-only button for VoiceOver, with a 44 pt hit area. <Spec>.accessibilityLabel("Send")</Spec></Note>
        <Note kind="dont">Mix stroke weights or icon families on one screen.</Note>
      </div>
    </Section>
  )
}
