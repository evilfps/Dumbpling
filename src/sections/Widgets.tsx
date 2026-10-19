import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Block, Note, Rows, Section, Spec, Stage } from '../components/doc'
import { Phone } from '../components/Phone'
import { Glass } from '../components/glass'
import { Icon, type IconName } from '../components/icons'
import { Gauge } from '../components/water'
import { AvatarPair, FeelingOrb, NumberText, Segmented, cx, useSpring } from '../components/ios'
import { LogoMark } from '../components/Logo'
import { gallery, wallpapers } from '../photos'
import { feelings } from '../tokens'

type Mode = 'Default' | 'Dark' | 'Clear'
type Size = 'small' | 'medium' | 'large'
const dims: Record<Size, [number, number]> = { small: [170, 170], medium: [364, 170], large: [364, 382] }
const calm = feelings[2]

/** WidgetKit container. Content margins 16 pt, corner radius follows the system (22 pt). */
function Widget({ size, mode, children, bleed, className }: { size: Size; mode: Mode; children: ReactNode; bleed?: boolean; className?: string }) {
  const [w, h] = dims[size]
  const base = 'relative overflow-hidden rounded-[22px]'
  const theme = mode === 'Default' ? undefined : 'dark'
  return (
    <div data-theme={theme} style={{ width: w, height: h }} className={cx(base, mode === 'Clear' ? 'lg lg-clear' : 'bg-surface shadow-e2', className)}>
      <div className={cx('relative z-[2] h-full', !bleed && 'p-4')}>{children}</div>
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-center text-[12px] font-medium text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.25)]">{children}</p>
}

/* ---------- Widgets ---------- */

function FeelingWidget({ mode }: { mode: Mode }) {
  return (
    <Widget size="small" mode={mode}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <FeelingOrb feeling="tender" size={44} glow={false} />
          <span className="tnum text-caption-1 text-ink-3">08:12</span>
        </div>
        <div>
          <p className="text-footnote text-ink-2">Jamie feels</p>
          <p className="text-lit text-title-2">Tender</p>
        </div>
      </div>
    </Widget>
  )
}

/** Interactive widget: Button(intent: LogGlassIntent()). Shows the pending state while the intent runs. */
function WaterWidget({ mode }: { mode: Mode }) {
  const [n, setN] = useState(5)
  const [pending, setPending] = useState(false)
  const snappy = useSpring('snappy')
  return (
    <Widget size="small" mode={mode}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-footnote font-medium text-ink-2">Water</span>
          <span style={{ color: calm.deep }}>
            <Icon name="water" size={16} filled weight="semibold" />
          </span>
        </div>
        <motion.p className="flex items-baseline gap-1" animate={{ opacity: pending ? 0.45 : 1 }} transition={{ duration: 0.2 }}>
          <span className="text-lit text-[40px] font-semibold leading-none tracking-[-0.03em]">
            <NumberText value={n} />
          </span>
          <span className="text-subhead text-ink-2">of 8</span>
        </motion.p>
        <div className="flex gap-[3px]">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.span key={i} className="h-1 flex-1 rounded-full" initial={false} animate={{ backgroundColor: i < n ? calm.a : 'rgb(128 128 128 / 0.22)' }} transition={{ duration: 0.4 }} />
          ))}
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={snappy}
          onClick={() => {
            if (pending) return
            setPending(true)
            setTimeout(() => {
              setN((v) => (v >= 8 ? 0 : v + 1))
              setPending(false)
            }, 450)
          }}
          className={cx('flex h-9 items-center justify-center gap-1.5 rounded-full text-subhead font-semibold', mode === 'Clear' ? 'bg-white/20 text-white' : 'bg-surface-2 text-ink')}
        >
          <Icon name="plus" size={15} weight="bold" /> Glass
        </motion.button>
      </div>
    </Widget>
  )
}

function TogetherWidget({ mode }: { mode: Mode }) {
  return (
    <Widget size="medium" mode={mode}>
      <div className="grid h-full grid-cols-2">
        <div className="flex flex-col justify-between pr-4">
          <span className="flex items-center gap-2 text-footnote font-medium text-ink-2">
            <LogoMark size={12} /> Together
          </span>
          <div>
            <p className="text-lit tnum text-[40px] font-semibold leading-[44px] tracking-[-0.03em]">1,204</p>
            <p className="text-footnote text-ink-2">days since 26 Feb 2022</p>
          </div>
        </div>
        <div className="relative flex flex-col justify-between pl-4">
          <span className="absolute inset-y-0 left-0 w-px bg-line" />
          <span className="text-footnote font-medium text-ink-2">Tonight</span>
          <div>
            <p className="text-headline text-ink">Dinner at Padella</p>
            <p className="tnum text-subhead text-ink-2">19:30 · Borough Market</p>
          </div>
          <AvatarPair size={24} ring="var(--surface)" />
        </div>
      </div>
    </Widget>
  )
}

function PhotoWidget({ mode }: { mode: Mode }) {
  const p = gallery.find((x) => x.id === 'dog')!
  return (
    <Widget size="large" mode={mode} bleed>
      <img src={p.src} alt={p.alt} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute right-4 top-4">
        <Glass variant="clear" className="grid size-8 place-items-center rounded-full">
          <LogoMark size={10} />
        </Glass>
      </div>
      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="text-footnote font-medium text-white/75">Jamie posted</p>
        <p className="text-title-3">
          {p.place}, {p.date}
        </p>
      </div>
    </Widget>
  )
}

const nudges: { icon: IconName; label: string }[] = [
  { icon: 'water', label: 'Water' },
  { icon: 'heart', label: 'Love' },
  { icon: 'moon', label: 'Goodnight' },
]

function NudgeWidget({ mode }: { mode: Mode }) {
  const [sent, setSent] = useState<string | null>(null)
  const snappy = useSpring('snappy')
  return (
    <Widget size="medium" mode={mode}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-footnote font-medium text-ink-2">Send Jamie</span>
          <AvatarPair size={22} ring="var(--surface)" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {nudges.map((n) => {
            const done = sent === n.label
            return (
              <motion.button
                key={n.label}
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={snappy}
                onClick={() => {
                  setSent(n.label)
                  setTimeout(() => setSent((s) => (s === n.label ? null : s)), 1600)
                }}
                className={cx('flex h-[86px] flex-col items-center justify-center gap-2 rounded-[14px]', mode === 'Clear' ? 'bg-white/15 text-white' : 'bg-surface-2 text-ink')}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={done ? 'd' : 'i'} initial={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.6 }} transition={snappy}>
                    <Icon name={done ? 'check' : n.icon} size={22} weight="medium" filled={!done && n.icon !== 'moon'} />
                  </motion.span>
                </AnimatePresence>
                <span className="text-footnote font-medium">{done ? 'Sent' : n.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </Widget>
  )
}

/* ---------- Home Screen ---------- */

const apps: { icon: IconName; label: string }[] = [
  { icon: 'pencil', label: 'Notes' },
  { icon: 'pin', label: 'Maps' },
  { icon: 'sun', label: 'Weather' },
]
const dock: IconName[] = ['messages', 'camera', 'gallery', 'clock']

function AppIcon({ icon, mode, brand }: { icon?: IconName; mode: Mode; brand?: boolean }) {
  const liquid = useSpring('liquid')
  const cls = brand ? 'bg-black' : mode === 'Clear' ? 'lg lg-clear' : mode === 'Dark' ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'
  return (
    <motion.span whileTap={{ scale: 0.9 }} transition={liquid} className={cx('grid size-[62px] place-items-center rounded-[15px] shadow-[0_2px_8px_rgb(0_0_0/0.12)]', cls)}>
      {brand ? <LogoMark size={22} /> : <Icon name={icon!} size={28} weight="medium" className="relative z-[2]" />}
    </motion.span>
  )
}

function HomeScreen({ mode }: { mode: Mode }) {
  return (
    <div className="relative flex h-full flex-col items-center pt-[70px]">
      {mode === 'Clear' && <div className="absolute inset-0 bg-black/10" />}
      <div className="relative grid w-[364px] grid-cols-2 gap-x-6">
        <div>
          <FeelingWidget mode={mode} />
          <Label>Dumbpling</Label>
        </div>
        <div>
          <WaterWidget mode={mode} />
          <Label>Water</Label>
        </div>
      </div>
      <div className="relative mt-4">
        <TogetherWidget mode={mode} />
        <Label>Dumbpling</Label>
      </div>
      <div className="relative mt-4 grid w-[364px] grid-cols-4">
        <div className="flex flex-col items-center">
          <AppIcon mode={mode} brand />
          <Label>Dumbpling</Label>
        </div>
        {apps.map((a) => (
          <div key={a.label} className="flex flex-col items-center">
            <AppIcon icon={a.icon} mode={mode} />
            <Label>{a.label}</Label>
          </div>
        ))}
      </div>
      <Glass variant="clear" className="relative mt-auto flex h-[30px] items-center gap-1.5 rounded-full px-3.5 text-footnote font-semibold text-white">
        <Icon name="search" size={13} weight="bold" className="relative z-[2]" />
        <span className="relative z-[2]">Search</span>
      </Glass>
      <Glass variant="clear" className="relative mb-[14px] mt-4 grid h-[92px] w-[369px] grid-cols-4 place-items-center rounded-[38px]">
        {dock.map((d) => (
          <span key={d} className="relative z-[2]">
            <AppIcon icon={d} mode={mode} />
          </span>
        ))}
      </Glass>
    </div>
  )
}

/* ---------- Lock Screen accessories ---------- */

function Accessories() {
  return (
    <div className="relative overflow-hidden rounded-[28px]">
      <img src={wallpapers.lock} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative flex flex-col items-center gap-5 px-6 py-10 text-white">
        <p className="flex items-center gap-1.5 text-subhead font-semibold text-white/85">
          <Icon name="heart" size={13} filled /> 1,204 days together
        </p>
        <div className="flex items-center gap-3">
          <Glass variant="clear" className="grid size-[72px] place-items-center rounded-full">
            <Gauge value={5} size={60} stroke={5} color="#fff">
              <span className="flex flex-col items-center">
                <Icon name="water" size={14} weight="semibold" />
                <span className="text-[15px] font-semibold leading-4">5</span>
              </span>
            </Gauge>
          </Glass>
          <Glass variant="clear" className="flex h-[72px] w-[164px] flex-col justify-center rounded-[20px] px-3.5">
            <span className="relative z-[2] text-footnote font-semibold">Tonight · 19:30</span>
            <span className="relative z-[2] text-subhead font-semibold leading-5">Padella</span>
            <span className="relative z-[2] text-footnote text-white/70">Borough Market</span>
          </Glass>
          <Glass variant="clear" className="grid size-[72px] place-items-center rounded-full">
            <span className="relative z-[2] flex flex-col items-center leading-none">
              <span className="text-[15px] font-semibold">26</span>
              <span className="mt-0.5 text-[10px] font-medium text-white/75">cycle</span>
            </span>
          </Glass>
        </div>
        <div className="flex gap-8 font-mono text-[10.5px] text-white/70">
          <span>accessoryInline</span>
          <span>Circular · Rectangular · Circular</span>
        </div>
      </div>
    </div>
  )
}

const specs = [
  ['Small', '170 × 170 · Feeling, Water'],
  ['Medium', '364 × 170 · Together, Send Jamie'],
  ['Large', '364 × 382 · Photo of us'],
  ['Margins', '16 pt content margins · .containerBackground(for: .widget)'],
  ['Corners', 'ContainerRelativeShape(), so inner shapes are concentric'],
  ['Buttons', 'Button(intent: LogGlassIntent()) · .invalidatableContent()'],
  ['Clear and tinted', '.widgetAccentable() on glyphs · photos keep their colour'],
]

export function Widgets() {
  const [mode, setMode] = useState<Mode>('Default')
  return (
    <Section
      id="widgets"
      index="14 — Widgets"
      title="A glance, a tap."
      intro="Widgets are where Dumbpling lives most of the day. Each one answers a single question at a glance. The interactive ones do their one job right there, without opening the app."
    >
      <div className="grid items-start gap-12 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-6">
          <Segmented className="w-[300px]" options={['Default', 'Dark', 'Clear'] as const} value={mode} onChange={setMode} />
          <Phone label="Home Screen" wallpaper={wallpapers.home} light time="9:41">
            <HomeScreen mode={mode} />
          </Phone>
        </div>
        <div className="flex flex-col gap-12 pt-[56px]">
          <Block title="Specification" description="Tap + Glass on the water widget: it dims while the intent runs, then the number rolls. Switch to Clear to see iOS 26’s glass Home Screen.">
            <Rows>
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[112px_1fr] gap-4 py-3 text-subhead">
                  <span className="text-ink-3">{k}</span>
                  <span className="text-ink">{v}</span>
                </div>
              ))}
            </Rows>
          </Block>
          <div className="flex flex-col gap-4">
            <Note kind="do">Answer one question per widget. If it needs a title to explain it, it’s doing too much.</Note>
            <Note kind="do">Keep the 16 pt content margins and let the system round the corners. Inner shapes stay concentric.</Note>
            <Note kind="dont">Put more than three buttons in a widget, or a button that only opens the app.</Note>
          </div>
        </div>
      </div>

      <Block title="More widgets" description="The large photo widget shows the latest picture from your Gallery. The medium widget sends Jamie a nudge in one tap.">
        <div className="grid gap-4 xl:grid-cols-[auto_1fr]">
          <Stage className="grid place-items-center">
            <PhotoWidget mode={mode} />
          </Stage>
          <div className="flex flex-col gap-4">
            <Stage className="grid place-items-center py-10">
              <NudgeWidget mode={mode === 'Clear' ? 'Default' : mode} />
            </Stage>
            <Accessories />
          </div>
        </div>
        <p className="mt-5">
          <Spec>struct DumbplingWidgets: WidgetBundle {'{ Feeling(); Water(); Together(); PhotoOfUs(); SendJamie() }'}</Spec>
        </p>
      </Block>
    </Section>
  )
}
