import { useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Block, Note, Rows, Section, Spec, Stage } from '../components/doc'
import { Glass } from '../components/glass'
import { Icon, type IconName } from '../components/icons'
import { IconButton, TabBar, useSpring } from '../components/ios'
import { gallery } from '../photos'

const bg = (id: string) => gallery.find((p) => p.id === id)!.src

function PhotoStage({ src, children, className = '', height = 'h-[420px]' }: { src: string; children: ReactNode; className?: string; height?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] ${height} ${className}`}>
      <img src={src} alt="" className="absolute inset-0 size-full object-cover" draggable={false} />
      {children}
    </div>
  )
}

function Lens() {
  const area = useRef<HTMLDivElement>(null)
  const liquid = useSpring('liquid')
  return (
    <PhotoStage src={bg('dance')}>
      <div ref={area} className="absolute inset-6">
        <motion.div
          drag
          dragConstraints={area}
          dragElastic={0.12}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 30 }}
          whileDrag={{ scale: 1.06 }}
          transition={liquid}
          className="absolute left-1/2 top-1/2 -ml-[130px] -mt-[44px] cursor-grab active:cursor-grabbing"
        >
          <Glass interactive className="flex h-[88px] w-[260px] items-center justify-center gap-3 rounded-full">
            <Icon name="us" size={26} weight="medium" className="text-ink" />
            <span className="text-headline text-ink">Drag the glass</span>
          </Glass>
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
        {(['heart', 'messages', 'camera', 'share'] as IconName[]).map((i) => (
          <IconButton key={i} icon={i} label={i} size={48} variant="glass" />
        ))}
      </div>
    </PhotoStage>
  )
}

const actions: { icon: IconName; label: string }[] = [
  { icon: 'snap', label: 'Snap' },
  { icon: 'gallery', label: 'Post' },
  { icon: 'water', label: 'Water' },
  { icon: 'plans', label: 'Plan' },
]

/** One glass shape that grows into a toolbar. SwiftUI: GlassEffectContainer + glassEffectID. */
function Morph() {
  const [open, setOpen] = useState(false)
  const liquid = useSpring('liquid')
  return (
    <div className="flex h-full items-center justify-center">
      <Glass className="rounded-full" style={{ padding: 0 }}>
        <motion.div initial={false} animate={{ width: open ? 296 : 56 }} transition={liquid} className="flex h-14 items-center overflow-hidden rounded-full">
          <AnimatePresence initial={false}>
            {open &&
              actions.map((a, i) => (
                <motion.button
                  key={a.label}
                  type="button"
                  className="flex h-14 w-[60px] shrink-0 flex-col items-center justify-center gap-0.5 text-ink"
                  initial={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { ...liquid, delay: 0.04 * i } }}
                  exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
                >
                  <Icon name={a.icon} size={20} weight="medium" />
                  <span className="text-[10px] font-semibold">{a.label}</span>
                </motion.button>
              ))}
          </AnimatePresence>
          <motion.button
            type="button"
            aria-label={open ? 'Close' : 'Open actions'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="ml-auto grid size-14 shrink-0 place-items-center text-ink"
          >
            <motion.span animate={{ rotate: open ? 45 : 0 }} transition={liquid}>
              <Icon name="plus" size={22} weight="semibold" />
            </motion.span>
          </motion.button>
        </motion.div>
      </Glass>
    </div>
  )
}

function Press() {
  const [loved, setLoved] = useState(false)
  return (
    <div className="flex h-full items-center justify-center gap-6">
      <Glass as="button" interactive label="Love" onClick={() => setLoved((l) => !l)} className="grid size-[88px] place-items-center rounded-full">
        <motion.span key={String(loved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="text-ink">
          <Icon name="heart" size={34} filled={loved} weight="medium" />
        </motion.span>
      </Glass>
      <Glass as="button" interactive className="flex h-[52px] items-center rounded-full px-7 text-headline text-ink">
        Press and hold
      </Glass>
    </div>
  )
}

function Minimize() {
  const ref = useRef<HTMLDivElement>(null)
  const [min, setMin] = useState(false)
  const last = useRef(0)
  return (
    <div className="relative h-full overflow-hidden rounded-[20px]" style={{ ['--canvas' as string]: 'var(--stage)' }}>
      <div
        ref={ref}
        onScroll={(e) => {
          const y = e.currentTarget.scrollTop
          if (y > 60 && y > last.current + 3) setMin(true)
          else if (y < last.current - 3 || y < 30) setMin(false)
          last.current = y
        }}
        className="no-scrollbar h-full overflow-y-auto"
      >
        <div className="grid grid-cols-2 gap-2 p-3 pb-28">
          {gallery.slice(0, 8).map((p) => (
            <img key={p.id} src={p.src} alt="" className="aspect-[4/5] w-full rounded-[14px] object-cover" />
          ))}
        </div>
      </div>
      <TabBar active="Gallery" minimized={min} accessory={<IconButton icon="plus" label="Post" size={62} variant="glass" />} />
    </div>
  )
}

const swift = [
  ['Surface', '.glassEffect(.regular, in: .capsule)'],
  ['Interactive', '.glassEffect(.regular.interactive())'],
  ['Clear', '.glassEffect(.clear) over media, with a dimming layer'],
  ['Prominent', '.buttonStyle(.glassProminent).tint(.primary)'],
  ['Morph', 'GlassEffectContainer { … }.glassEffectID("plus", in: ns)'],
  ['Tab bar', '.tabBarMinimizeBehavior(.onScrollDown) · .tabViewBottomAccessory'],
  ['Fallback', 'iOS 17–18: .regularMaterial · Reduce Transparency: solid'],
]

export function LiquidGlass() {
  return (
    <Section
      id="glass"
      index="05 — Liquid Glass"
      title="A layer of light."
      intro="On iOS 26, controls and navigation float above the content on Liquid Glass. It bends what’s behind it, catches light at its edges and responds when you touch it. Dumbpling uses it only for the layer you interact with, never for the content itself."
    >
      <Lens />

      <Block title="Variants" description="Regular glass works almost anywhere. Clear glass is for use over photos and always has white content. Prominent glass is tinted ink and is reserved for the single main action.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { v: 'regular' as const, t: 'Regular', img: 'mug', text: 'text-ink' },
            { v: 'clear' as const, t: 'Clear', img: 'tower', text: 'text-white' },
            { v: 'prominent' as const, t: 'Prominent', img: 'flowers', text: '' },
          ].map((x) => (
            <figure key={x.t} className="flex flex-col gap-3">
              <PhotoStage src={bg(x.img)} height="h-64">
                {x.v === 'clear' && <div className="absolute inset-0 bg-black/15" />}
                <div className="absolute inset-0 grid place-items-center">
                  <Glass as="button" interactive variant={x.v} className={`flex h-[52px] items-center gap-2 rounded-full px-6 text-headline ${x.text}`}>
                    <Icon name="heart" size={20} weight="semibold" filled={x.v === 'prominent'} />
                    Send love
                  </Glass>
                </div>
              </PhotoStage>
              <figcaption className="px-1 text-footnote text-ink-3">{x.t}</figcaption>
            </figure>
          ))}
        </div>
      </Block>

      <Block title="Interactions" description="Glass is never static. It responds to touch, changes shape and steps aside when you scroll. Try each one.">
        <div className="grid gap-4 md:grid-cols-2">
          <Stage caption="Press · the glass swells by 4% and light blooms from your finger, then settles with the liquid spring (0.38 s · 0.64)." className="h-[260px] p-0!">
            <Press />
          </Stage>
          <Stage caption="Morph · one shape grows into a toolbar. The actions emerge from it rather than appearing beside it." className="h-[260px] p-0!">
            <Morph />
          </Stage>
          <Stage caption="Lift · press and drag across the tab bar. The selection lifts into a lens that follows your finger, then drops into the nearest tab." className="grid h-[260px] place-items-center">
            <TabBar active="Messages" floating={false} />
          </Stage>
          <Stage caption="Minimise · scroll down and the tab bar shrinks to the current tab. Scroll up and it returns." className="h-[260px] p-3!">
            <Minimize />
          </Stage>
        </div>
      </Block>

      <div className="grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Note kind="do">Use glass only on the navigation layer: tab bars, toolbars, bar buttons, sheets and menus.</Note>
          <Note kind="dont">Put glass on glass. When two surfaces meet, merge them into one shape with a container.</Note>
          <Note kind="do">Over photos, use clear glass with a 15% dimming layer so white glyphs stay legible.</Note>
          <Note kind="dont">Make list rows, cards or message bubbles out of glass. Content stays solid.</Note>
          <Note kind="do">Group related controls into one capsule. Space them with the shape, not with gaps.</Note>
        </div>
        <Rows>
          {swift.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[96px_1fr] gap-4 py-3 text-subhead">
              <span className="text-ink-3">{k}</span>
              <Spec>{v}</Spec>
            </div>
          ))}
        </Rows>
      </div>
    </Section>
  )
}
