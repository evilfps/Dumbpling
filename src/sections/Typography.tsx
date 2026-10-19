import { useState } from 'react'
import { typeScale } from '../tokens'
import { Block, Note, Rows, Section, Spec, Stage } from '../components/doc'
import { IconButton, NumberText } from '../components/ios'

const weights = [
  { w: 400, name: 'Regular', use: 'Body and messages' },
  { w: 500, name: 'Medium', use: 'Labels and controls' },
  { w: 600, name: 'Semibold', use: 'Headlines and titles' },
  { w: 700, name: 'Bold', use: 'Large Title only' },
]

const treatments = [
  { name: 'Flat', cls: 'text-ink', swift: '.foregroundStyle(.primary)', note: 'Use for body text, rows and anything 20 pt or smaller.' },
  { name: 'Lit', cls: 'text-lit', swift: '.foregroundStyle(.lit)', note: 'A soft top-to-bottom falloff. Use for display numbers and titles of 22 pt and above.' },
  { name: 'Shimmer', cls: 'text-shimmer', swift: '.shimmer()  // 9 s, once per screen', note: 'A slow highlight drifts across. Use it for one hero moment per screen, at most.' },
]

export function Typography() {
  const [saved, setSaved] = useState(1240)
  return (
    <Section
      id="typography"
      index="02 — Typography"
      title="Type does the work."
      intro="We use one typeface, SF Pro, the system font on every iPhone. It switches between Text and Display shapes at 20 pt automatically and scales with Dynamic Type. Hierarchy comes from size and weight, never from colour or decoration."
    >
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Stage className="flex min-h-[380px] flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between">
            <p className="text-footnote text-ink-2">SF Pro</p>
            <p className="text-right text-footnote text-ink-3">
              Text below 20 pt
              <br />
              Display from 20 pt
            </p>
          </div>
          <p className="text-lit select-none pb-2 text-[200px] font-semibold leading-[0.85] tracking-[-0.06em]">Aa</p>
          <p className="text-callout tracking-[-0.01em] text-ink-2">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 £ ’ “ ” –</p>
        </Stage>
        <Stage className="flex flex-col justify-center p-0!">
          {weights.map(({ w, name, use }, i) => (
            <div key={w} className={`flex items-center gap-6 px-8 py-6 ${i ? 'border-t border-line' : ''}`}>
              <span className="w-16 text-[40px] leading-none tracking-[-0.03em] text-ink" style={{ fontWeight: w }}>
                Aa
              </span>
              <div>
                <p className="text-headline text-ink">
                  {name} <span className="tnum font-normal text-ink-3">{w}</span>
                </p>
                <p className="text-subhead text-ink-2">{use}</p>
              </div>
            </div>
          ))}
        </Stage>
      </div>

      <Block title="Luminous text" description="Display text should feel lit from within. That comes from a gentle vertical gradient and, in dark mode, a faint glow of 14% white. The effect should be felt rather than noticed.">
        <div className="grid gap-4 md:grid-cols-3">
          {treatments.map((t) => (
            <Stage key={t.name} caption={t.note} className="flex min-h-[220px] flex-col justify-between">
              <p className="text-footnote font-medium text-ink-2">{t.name}</p>
              <p className={`${t.cls} tnum pb-1 text-[44px] font-semibold leading-[48px] tracking-[-0.035em]`}>1,204 days</p>
              <Spec>{t.swift}</Spec>
            </Stage>
          ))}
        </div>
      </Block>

      <Block title="Scale" description="These are the eleven iOS text styles. Always set a text style, never a point size, so every screen reflows from xSmall up to AX5.">
        <Rows>
          {typeScale.map((t) => (
            <div key={t.name} className="grid items-baseline gap-x-8 gap-y-1 py-5 md:grid-cols-[170px_1fr_170px]">
              <div>
                <p className="text-subhead font-medium text-ink">{t.name}</p>
                <p className="font-mono text-[11px] text-ink-3">{t.swift}</p>
              </div>
              <p className={`${t.className} truncate text-ink`}>{t.sample}</p>
              <p className="tnum flex gap-4 font-mono text-[11.5px] text-ink-3 md:justify-end">
                <span>
                  {t.size}/{t.leading}
                </span>
                <span>{t.tracking > 0 ? `+${t.tracking}` : t.tracking}</span>
                <span className="w-16 md:text-right">{t.weight}</span>
              </p>
            </div>
          ))}
        </Rows>
      </Block>

      <Block title="Numbers" description="Dumbpling shows a lot of numbers. Always use tabular figures so digits line up. When a value changes, its digits roll into place rather than jumping.">
        <Stage className="flex flex-col items-center gap-8 py-14" caption={<Spec>Text(amount, format: .currency(code: "GBP")).monospacedDigit().contentTransition(.numericText(value: amount))</Spec>}>
          <p className="text-lit pb-1 text-[64px] font-semibold leading-none tracking-[-0.04em]">
            <NumberText value={saved} format={(n) => `£${n.toLocaleString('en-GB')}`} />
          </p>
          <div className="flex items-center gap-3">
            <IconButton icon="minus" label="Decrease" size={44} onClick={() => setSaved((s) => Math.max(0, s - 10))} />
            <span className="w-28 text-center text-subhead text-ink-2">Saved for Lisbon</span>
            <IconButton icon="plus" label="Increase" size={44} onClick={() => setSaved((s) => s + 10)} />
          </div>
        </Stage>
      </Block>

      <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
        <Note kind="do">Use two sizes and two weights per component, at most. Let space do the separating.</Note>
        <Note kind="dont">Use Light, Thin or Ultralight. They fall apart on small screens and look dated.</Note>
        <Note kind="do">Use sentence case everywhere: titles, buttons, tabs.</Note>
        <Note kind="dont">Use all capitals with wide letter-spacing for section headers. Use a footnote-size label instead.</Note>
        <Note kind="do">Use real punctuation: ’ “ ” – and en-GB formats such as 14 June and 19:30.</Note>
        <Note kind="dont">Shrink text to fit. Let it wrap, or move it to a detail screen.</Note>
      </div>
    </Section>
  )
}
