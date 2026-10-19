import { useId, useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react'
import { Block, Note, Rows, Section } from '../components/doc'
import { Phone } from '../components/Phone'
import { LargeTitleScreen } from '../components/screen'
import { Icon } from '../components/icons'
import { Avatar, Button, IconButton, Segmented, Sheet, TextField, Toggle, cx, useReduce, useSpring } from '../components/ios'
import { Peek } from '../components/peek'
import { cameraRoll, gallery, type Photo } from '../photos'

const COL = (393 - 32 - 8) / 2

function masonry(items: Photo[]) {
  const cols: Photo[][] = [[], []]
  const h = [0, 0]
  for (const p of items) {
    const i = h[0] <= h[1] ? 0 : 1
    cols[i].push(p)
    h[i] += (COL * p.h) / p.w + 8
  }
  return cols
}

function Detail({ photo, ns, onClose, loved: lovedAtOpen, onLove }: { photo: Photo; ns: string; onClose: () => void; loved: boolean; onLove: (v: boolean) => void }) {
  const y = useMotionValue(0)
  const scale = useTransform(y, [0, 300], [1, 0.82])
  const fade = useTransform(y, [0, 260], [1, 0])
  const [loved, setLovedState] = useState(lovedAtOpen)
  const setLoved = (v: boolean) => {
    setLovedState(v)
    onLove(v)
  }
  const [burst, setBurst] = useState(0)
  const [widget, setWidget] = useState(photo.id === 'dog')
  const smooth = useSpring('smooth')
  const reduce = useReduce()
  const love = () => {
    setLoved(true)
    setBurst((b) => b + 1)
  }
  return (
    <div className="absolute inset-0 z-50">
      <motion.div className="absolute inset-0 bg-canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ opacity: fade }} transition={smooth} />
      <motion.div
        className="absolute inset-0 flex flex-col"
        drag={reduce ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.7 }}
        onDragEnd={(_, i) => (i.offset.y > 110 || i.velocity.y > 600) && onClose()}
        style={{ y }}
      >
        <div className="absolute inset-x-4 top-[58px] z-10 flex justify-between">
          <IconButton icon="chevronDown" label="Close" size={40} variant="glass" onClick={onClose} />
          <IconButton icon="share" label="Share" size={40} variant="glass" />
        </div>
        <motion.div className="relative mt-[110px] px-4" style={{ scale }}>
          <motion.img
            layoutId={`${ns}-${photo.id}`}
            src={photo.src}
            alt={photo.alt}
            onDoubleClick={love}
            transition={smooth}
            draggable={false}
            className="w-full select-none rounded-[22px] object-cover"
            style={{ aspectRatio: `${photo.w} / ${photo.h}`, maxHeight: 470 }}
          />
          <AnimatePresence>
            {burst > 0 && (
              <motion.span
                key={burst}
                className="pointer-events-none absolute inset-0 grid place-items-center text-white"
                initial={{ opacity: 0, scale: 0.5, filter: 'blur(6px)' }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1, 1.05], filter: 'blur(0px)' }}
                transition={{ duration: 0.9, times: [0, 0.25, 0.6, 1] }}
                onAnimationComplete={() => setBurst(0)}
              >
                <Icon name="heart" filled size={96} className="drop-shadow-[0_8px_24px_rgb(0_0_0/0.3)]" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div className="mt-5 flex flex-col gap-4 px-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ...smooth, delay: 0.08 }} style={{ opacity: fade }}>
          <div className="flex items-center gap-3">
            <Avatar initials={photo.by === 'you' ? 'A' : 'J'} size={36} />
            <div className="flex-1">
              <p className="text-headline text-ink">{photo.by === 'you' ? 'You' : 'Jamie'}</p>
              <p className="text-subhead text-ink-2">
                {photo.place} · {photo.date}
              </p>
            </div>
            <motion.button type="button" aria-pressed={loved} aria-label="Love" whileTap={{ scale: 0.85 }} onClick={() => (loved ? setLoved(false) : love())} className="grid size-11 place-items-center text-ink">
              <Icon name="heart" size={26} filled={loved} weight="medium" />
            </motion.button>
          </div>
          <div className="flex h-[52px] items-center justify-between rounded-lg bg-surface px-4">
            <span className="text-body text-ink">Show on Home Screen</span>
            <Toggle on={widget} onChange={setWidget} label="Show on Home Screen" />
          </div>
          <p className="text-center text-footnote text-ink-3">Double-tap to love · Swipe down to close</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function GalleryScreen() {
  const ns = useId()
  const [photos, setPhotos] = useState(gallery)
  const [who, setWho] = useState<'All' | 'Jamie' | 'You'>('All')
  const [open, setOpen] = useState<Photo | null>(null)
  const [posting, setPosting] = useState(false)
  const [pick, setPick] = useState(cameraRoll[0].id)
  const [loved, setLoved] = useState<Set<string>>(() => new Set(['dog']))
  const love = (id: string, v: boolean) => setLoved((s) => {
    const n = new Set(s)
    if (v) n.add(id)
    else n.delete(id)
    return n
  })
  const smooth = useSpring('smooth')
  const snappy = useSpring('snappy')
  const visible = photos.filter((p) => who === 'All' || (who === 'You' ? p.by === 'you' : p.by === 'them'))
  const cols = useMemo(() => masonry(visible), [visible])

  return (
    <LargeTitleScreen
      title="Gallery"
      subtitle={`${photos.length + 202} moments together`}
      tab="Gallery"
      trailing={<IconButton icon="search" label="Search" size={36} variant="glass" />}
      accessory={<IconButton icon="plus" label="Post" size={62} variant="glass" onClick={() => setPosting(true)} />}
      overlay={
        <>
          <AnimatePresence>{open && <Detail key={open.id} photo={open} ns={ns} onClose={() => setOpen(null)} loved={loved.has(open.id)} onLove={(v) => love(open.id, v)} />}</AnimatePresence>
          <Sheet open={posting} onClose={() => setPosting(false)}>
            <p className="text-center text-headline text-ink">New post</p>
            <div className="mt-5 grid grid-cols-3 gap-1.5">
              {cameraRoll.map((p) => (
                <motion.button
                  key={p.id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  transition={snappy}
                  onClick={() => setPick(p.id)}
                  aria-pressed={pick === p.id}
                  className="relative aspect-square overflow-hidden rounded-[12px]"
                >
                  <img src={p.src} alt={p.alt} className="size-full object-cover" />
                  <span className={cx('absolute inset-0 rounded-[12px] transition-shadow duration-200', pick === p.id && 'shadow-[inset_0_0_0_3px_var(--ink)]')} />
                  {pick === p.id && (
                    <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={snappy} className="absolute bottom-1.5 right-1.5 grid size-6 place-items-center rounded-full" style={{ backgroundImage: 'var(--btn-bg)', color: 'var(--btn-fg)' }}>
                      <Icon name="check" size={14} weight="bold" />
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
            <TextField className="mt-4" placeholder="Say something about it" aria-label="Caption" />
            <div className="mt-4">
              <Button
                full
                onClick={() => {
                  const p = cameraRoll.find((x) => x.id === pick)!
                  setPhotos((s) => (s.some((x) => x.id === p.id) ? s : [{ ...p, date: 'Just now' }, ...s]))
                  setWho('All')
                  setPosting(false)
                }}
              >
                Post to Gallery
              </Button>
            </div>
          </Sheet>
        </>
      }
    >
      <Segmented options={['All', 'Jamie', 'You'] as const} value={who} onChange={setWho} />
      <div className="mt-4 flex gap-2">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-1 flex-col gap-2">
            <AnimatePresence initial={false} mode="popLayout">
              {col.map((p) => (
                <motion.button
                  key={p.id}
                  layout
                  type="button"
                  onClick={() => setOpen(p)}
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)', transition: { duration: 0.2 } }}
                  transition={smooth}
                  className="relative block rounded-[14px]"
                  aria-label={`${p.alt}. Press and hold to peek.`}
                >
                  <Peek
                    ratio={p.w / p.h}
                    onCommit={() => setOpen(p)}
                    title={
                      <span className="truncate">
                        {p.by === 'you' ? 'You' : 'Jamie'} · {p.place}, {p.date}
                      </span>
                    }
                    preview={<img src={p.src} alt={p.alt} draggable={false} className="size-full object-cover" />}
                    actions={[
                      { label: loved.has(p.id) ? 'Unlove' : 'Love', icon: 'heart', onSelect: () => love(p.id, !loved.has(p.id)) },
                      { label: 'Share', icon: 'share' },
                      { label: 'Copy', icon: 'copy' },
                      { label: 'Delete', icon: 'trash', tone: 'alert', onSelect: () => setPhotos((s) => s.filter((x) => x.id !== p.id)) },
                    ]}
                  >
                    <span className="relative block overflow-hidden rounded-[14px]">
                      <motion.img layoutId={`${ns}-${p.id}`} src={p.src} alt="" draggable={false} className="block w-full rounded-[14px] object-cover" style={{ aspectRatio: `${p.w} / ${p.h}` }} transition={smooth} />
                      <span className="pointer-events-none absolute inset-0 rounded-[14px] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.06)]" />
                      {p.date === 'Just now' && <span className="lg lg-clear absolute left-2 top-2 rounded-full px-2 py-0.5 text-caption-2 font-semibold">New</span>}
                      <AnimatePresence>
                        {loved.has(p.id) && (
                          <motion.span
                            className="lg lg-clear absolute bottom-2 right-2 grid size-7 place-items-center rounded-full text-white"
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={snappy}
                          >
                            <Icon name="heart" size={14} filled className="relative z-[2]" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </Peek>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </LargeTitleScreen>
  )
}

const spec = [
  ['Grid', 'Two columns · 16 pt margins · 8 pt gutter'],
  ['Tiles', 'Original aspect ratio · radius 14 · no captions'],
  ['Order', 'Shortest column first, so both columns end level'],
  ['Open', 'Shared element: the tile itself becomes the detail'],
  ['Peek', 'Hold 0.42 s. The tile gathers to 95 %, then lifts above a blur with a menu'],
  ['Choose', 'Keep holding and slide onto an action, or tap the preview to open it'],
  ['Close', 'Swipe down. The photo shrinks with your finger'],
  ['Love', 'Double-tap. The heart blooms and fades in 0.9 s'],
  ['Post', 'Glass accessory beside the tab bar'],
]

export function GallerySection() {
  return (
    <Section
      id="gallery"
      index="13 — Gallery"
      title="Together, in pictures."
      intro="This is a shared feed that only the two of you can see. It’s quiet like VSCO and laid out like Pinterest: photos at their own proportions, no counts, no captions on the grid. The pictures do the talking."
    >
      <div className="grid items-start gap-12 lg:grid-cols-[auto_1fr]">
        <Phone label="Gallery">
          <GalleryScreen />
        </Phone>
        <div className="flex flex-col gap-12 pt-4">
          <Block title="Try it" description="Tap a photo to open it and swipe it down to close. Press and hold one to peek without opening it (right-click works too). Double-tap to love it. Switch the filter to watch the columns reflow. Use the + beside the tab bar to post.">
            <Rows>
              {spec.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[80px_1fr] gap-4 py-3 text-subhead">
                  <span className="text-ink-3">{k}</span>
                  <span className="text-ink">{v}</span>
                </div>
              ))}
            </Rows>
          </Block>
          <div className="flex flex-col gap-4">
            <Note kind="do">Keep each photo’s own aspect ratio. Cropping everything to squares makes a feed feel generic.</Note>
            <Note kind="do">Make the transition continuous: the same pixels grow into the detail view and shrink back.</Note>
            <Note kind="do">Let a peek put the photo back exactly where it came from, at the same size and corner radius.</Note>
            <Note kind="dont">Show like counts, follower numbers or anything that turns a relationship into metrics.</Note>
            <Note kind="dont">Lay text over photos in the grid. Metadata belongs in the detail view.</Note>
          </div>
        </div>
      </div>
    </Section>
  )
}
