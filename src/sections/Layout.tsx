import { layout, radii, spacing, feelings } from '../tokens'
import { Block, Note, Rows, Section, Spec, Stage } from '../components/doc'
import { Avatar, ListRow } from '../components/ios'

function Mark({ left, width, label, top = -28 }: { left: number | string; width: number; label: string; top?: number }) {
  return (
    <span className="absolute flex flex-col items-center" style={{ left, width, top }}>
      <span className="tnum mb-1 font-mono text-[10px] text-ink-2">{label}</span>
      <span className="flex h-[7px] w-full items-center">
        <span className="h-full w-px bg-ink-3" />
        <span className="h-px flex-1 bg-ink-3" />
        <span className="h-full w-px bg-ink-3" />
      </span>
    </span>
  )
}

const materials = [
  { name: 'Material', cls: 'bg-glass backdrop-blur-2xl backdrop-saturate-[1.8]', swift: '.regularMaterial', use: 'iOS 17–18 fallback' },
  { name: 'Liquid Glass', cls: 'lg', swift: '.glassEffect()', use: 'Tab bar, buttons, menus' },
  { name: 'Solid', cls: 'bg-surface', swift: 'Reduce Transparency', use: 'Automatic fallback' },
]

export function Layout() {
  return (
    <Section
      id="space"
      index="06 — Space and shape"
      title="Room to breathe."
      intro="Everything sits on a 4 pt grid. We separate with space first, tone second and lines last. If a screen feels crowded, take something away rather than making it smaller."
    >
      <Block title="Spacing" description="Nine steps. Every distance on every screen comes from this list.">
        <Rows>
          {spacing.map((s) => (
            <div key={s.token} className="grid grid-cols-[56px_48px_1fr] items-center gap-4 py-3.5 sm:grid-cols-[64px_56px_280px_1fr]">
              <span className="font-mono text-[12px] text-ink-3">{s.token}</span>
              <span className="tnum text-subhead font-medium text-ink">{s.value}</span>
              <span className="flex items-center">
                <span className="h-2 rounded-full bg-ink" style={{ width: s.value * 4 }} />
              </span>
              <span className="hidden text-subhead text-ink-2 sm:block">{s.use}</span>
            </div>
          ))}
        </Rows>
      </Block>

      <Block title="Anatomy of a row" description="The leading element, the text and the trailing accessory always land on the same x positions, so stacked rows read as one column. Separators begin where the text begins.">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Stage className="grid place-items-center px-10 pb-20 pt-20">
            <div className="relative w-full max-w-[361px]">
              <div className="overflow-hidden rounded-lg shadow-[0_0_0_1px_var(--ink-3)]">
                <ListRow leading={<Avatar initials="J" size={32} />} title="Jamie" subtitle="Checked in at 08:12" inset={60} last />
              </div>
              <Mark left={0} width={16} label="16" />
              <Mark left={16} width={32} label="32" />
              <Mark left={48} width={12} label="12" />
              <Mark left="calc(100% - 16px)" width={16} label="16" />
              <span className="absolute -right-12 top-0 flex h-full items-center gap-1.5">
                <span className="flex h-full w-[7px] flex-col items-center">
                  <span className="h-px w-full bg-ink-3" />
                  <span className="w-px flex-1 bg-ink-3" />
                  <span className="h-px w-full bg-ink-3" />
                </span>
                <span className="tnum font-mono text-[10px] text-ink-2">60</span>
              </span>
              <span className="absolute -bottom-10 left-[60px] right-0">
                <span className="block h-px bg-ink-3" />
                <span className="mt-1.5 block font-mono text-[10px] text-ink-2">Separator inset 60 = 16 + 32 + 12</span>
              </span>
            </div>
          </Stage>
          <div className="grid grid-cols-2 content-start gap-x-8">
            {layout.map((l) => (
              <div key={l.label} className="border-t border-line py-5">
                <p className="text-footnote text-ink-3">{l.label}</p>
                <p className="tnum mt-1 text-title-3 text-ink">{l.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Block>

      <Block title="Corners" description="The larger the surface, the rounder the corner. Every shape uses continuous (squircle) corners. Circular corners look slightly mechanical next to iOS.">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-6">
          {radii.map((r) => (
            <div key={r.token}>
              <div className="grid aspect-square place-items-center rounded-[22px] bg-stage">
                <div className="size-[58%] bg-ink" style={{ borderRadius: r.value * 0.9 }} />
              </div>
              <p className="tnum mt-3 text-subhead font-medium text-ink">{r.value} pt</p>
              <p className="text-footnote text-ink-3">
                {r.token} · {r.use}
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Concentric corners" description="A shape nested inside another uses the outer radius minus the padding between them. This is what makes a button feel as if it belongs to the sheet it sits in.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { ok: true, inner: 22, label: '38 − 16 = 22. The curves stay parallel.' },
            { ok: false, inner: 38, label: 'Copying the outer radius pinches the gap at the corners.' },
          ].map((c) => (
            <Stage key={c.label} caption={c.label} className="grid place-items-center py-12">
              <div className="w-full max-w-[320px] rounded-sheet bg-surface p-4 shadow-e2">
                <div className="mb-3 h-24 bg-surface-2" style={{ borderRadius: c.inner }} />
                <button type="button" className="h-[52px] w-full text-headline" style={{ borderRadius: c.inner, backgroundImage: 'var(--btn-bg)', color: 'var(--btn-fg)', boxShadow: 'var(--btn-shadow)' }}>
                  Check in
                </button>
              </div>
            </Stage>
          ))}
        </div>
        <p className="mt-4">
          <Spec>ConcentricRectangle() on iOS 26, or RoundedRectangle(cornerRadius: outer − padding, style: .continuous)</Spec>
        </p>
      </Block>

      <Block title="Materials" description="Glass is for things that float above content: the tab bar, menus and reactions. It never sits on another layer of glass. When Reduce Transparency is on, it becomes solid.">
        <div className="relative overflow-hidden rounded-[28px] bg-stage p-8">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {feelings.slice(0, 4).map((f, i) => (
              <span key={f.key} className="absolute size-56 rounded-full blur-2xl" style={{ background: f.a, left: `${8 + i * 22}%`, top: i % 2 ? '45%' : '5%', opacity: 0.8 }} />
            ))}
          </div>
          <div className="relative grid gap-4 md:grid-cols-3">
            {materials.map((mt) => (
              <div key={mt.name} className={`flex h-44 flex-col justify-between rounded-lg p-5 ring-[0.5px] ring-glass-line ${mt.cls}`}>
                <p className="text-headline text-ink">{mt.name}</p>
                <div>
                  <p className="text-subhead text-ink-2">{mt.use}</p>
                  <Spec>{mt.swift}</Spec>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Block>

      <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
        <Note kind="do">Keep shadows faint: 4–12% black in light mode. In dark mode, replace shadows with a 0.5 pt light edge.</Note>
        <Note kind="dont">Draw an outline and a shadow on the same card. Choose one, and usually choose neither.</Note>
        <Note kind="do">Make everything tappable at least 44 × 44 pt, even when the glyph is 17 pt.</Note>
        <Note kind="dont">Fill empty space for the sake of it. Empty space is part of the design.</Note>
      </div>
    </Section>
  )
}
