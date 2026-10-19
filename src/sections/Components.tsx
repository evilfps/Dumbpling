import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Block, Note, Rows, Section, Spec, Stage } from '../components/doc'
import { Avatar, Button, FeelingPicker, IconButton, ListGroup, ListRow, Segmented, SwipeRow, TabBar, TextField, Toggle, useSpring } from '../components/ios'
import { Icon } from '../components/icons'
import { feelings } from '../tokens'

const buttonSpecs = [
  ['Large', '52 pt · radius 14 · Headline', 'Main action at the bottom of a sheet or screen'],
  ['Medium', '44 pt · radius 13 · Subheadline semibold', 'Inline actions in content'],
  ['Small', '34 pt · capsule · Subheadline semibold', 'Actions inside cards and messages'],
]

const initialTasks = [
  { id: 1, t: 'Book the train to Bath', s: 'Jamie · Thursday' },
  { id: 2, t: 'Pick up flowers', s: 'You · Today' },
  { id: 3, t: 'Call Sam back', s: 'You · Friday' },
]

export function Components() {
  const [nudges, setNudges] = useState(true)
  const [quiet, setQuiet] = useState(false)
  const [share, setShare] = useState(true)
  const [range, setRange] = useState<'Week' | 'Month' | 'Year'>('Week')
  const [feeling, setFeeling] = useState('tender')
  const [tab, setTab] = useState('Today')
  const [tasks, setTasks] = useState(initialTasks)
  const smooth = useSpring('smooth')

  return (
    <Section
      id="components"
      index="07 — Components"
      title="Familiar, then refined."
      intro="Each component starts from its system counterpart and keeps its behaviour. We change only the surface: tone, weight and corner. Everything here works, so try it."
    >
      <Block title="Buttons" description="Use one primary action per screen, in ink. Everything else is secondary, glass or plain. The press response starts the moment a finger touches down.">
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <Stage className="flex flex-col justify-center gap-3 py-12">
            <Button full>Check in</Button>
            <Button full variant="secondary">
              Remind me later
            </Button>
            <Button full variant="plain">
              Not now
            </Button>
          </Stage>
          <Stage className="flex flex-col justify-center gap-7 py-12">
            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="md" icon="plus">
                New plan
              </Button>
              <Button size="md" variant="secondary" icon="pin">
                Add place
              </Button>
              <Button size="md" variant="destructive">
                Delete
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="sm">Going</Button>
              <Button size="sm" variant="secondary">
                Suggest a time
              </Button>
              <Button size="sm" variant="secondary" disabled>
                Sent
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <IconButton icon="plus" label="Add" variant="primary" />
              <IconButton icon="search" label="Search" />
              <IconButton icon="ellipsis" label="More" />
              <IconButton icon="close" label="Close" size={30} />
              <span className="ml-2 text-footnote text-ink-3">Icon buttons always have a 44 pt hit area</span>
            </div>
          </Stage>
        </div>
        <div className="mt-6">
          <Rows>
            {buttonSpecs.map(([n, s, u]) => (
              <div key={n} className="grid gap-1 py-3.5 text-subhead sm:grid-cols-[120px_300px_1fr]">
                <span className="font-medium text-ink">{n}</span>
                <span className="tnum text-ink-2">{s}</span>
                <span className="text-ink-3">{u}</span>
              </div>
            ))}
          </Rows>
        </div>
      </Block>

      <Block title="Selection" description="Switches turn settings on and off. Segmented controls switch between views of the same content. The feeling picker is the only colourful control in the app.">
        <div className="grid gap-4 md:grid-cols-3">
          <Stage caption="Press and hold: the thumb stretches, as UISwitch does." className="flex flex-col justify-center">
            <ListGroup>
              <ListRow title="Nudges" trailing={<Toggle on={nudges} onChange={setNudges} label="Nudges" />} />
              <ListRow title="Quiet hours" trailing={<Toggle on={quiet} onChange={setQuiet} label="Quiet hours" />} />
              <ListRow title="Share cycle" trailing={<Toggle on={share} onChange={setShare} label="Share cycle" />} last />
            </ListGroup>
          </Stage>
          <Stage caption={<Spec>.pickerStyle(.segmented) · .sensoryFeedback(.selection)</Spec>} className="flex flex-col justify-center gap-6">
            <Segmented options={['Week', 'Month', 'Year'] as const} value={range} onChange={setRange} />
            <div className="flex h-24 items-end gap-1.5">
              {Array.from({ length: range === 'Week' ? 7 : range === 'Month' ? 15 : 12 }, (_, i) => (
                <motion.span
                  key={`${range}-${i}`}
                  className="flex-1 rounded-t-[4px] bg-ink"
                  initial={{ height: 0 }}
                  animate={{ height: `${28 + ((i * 37 + range.length * 13) % 70)}%` }}
                  transition={{ ...smooth, delay: i * 0.015 }}
                  style={{ opacity: 0.25 + (((i * 37) % 70) / 100) }}
                />
              ))}
            </div>
          </Stage>
          <Stage caption="Six feelings, each as a soft orb. The selection ring is in ink." className="flex flex-col justify-center gap-5">
            <FeelingPicker value={feeling} onChange={setFeeling} />
            <p className="text-center text-subhead text-ink-2">
              You feel <span className="font-semibold text-ink">{feelings.find((f) => f.key === feeling)?.name.toLowerCase()}</span>
            </p>
          </Stage>
        </div>
      </Block>

      <Block title="Fields" description="Fields are filled rather than outlined. The label stays above the field, so it’s still visible while you type. On focus, a 1.5 pt ink ring appears.">
        <Stage className="grid gap-6 md:grid-cols-3">
          <TextField label="Plan" placeholder="Anniversary dinner" />
          <TextField label="Where" defaultValue="Padella, Borough Market" helper="Jamie will get an invite." />
          <TextField label="Date" defaultValue="31 February" error="That date doesn’t exist." />
        </Stage>
      </Block>

      <Block title="Lists" description="Use inset grouped lists for settings and shared lists. Swipe a row to the left to reveal its actions.">
        <Stage className="grid gap-8 md:grid-cols-2">
          <ListGroup header="Shared list" footer="Swipe left on a row.">
            <AnimatePresence initial={false}>
              {tasks.map((t, i) => (
                <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={smooth}>
                  <SwipeRow
                    actions={[
                      { label: 'Done', onClick: () => setTasks((s) => s.filter((x) => x.id !== t.id)) },
                      { label: 'Delete', tone: 'alert', onClick: () => setTasks((s) => s.filter((x) => x.id !== t.id)) },
                    ]}
                  >
                    <ListRow title={t.t} subtitle={t.s} chevron={false} last={i === tasks.length - 1} />
                  </SwipeRow>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <button type="button" onClick={() => setTasks(initialTasks)} className="flex h-[52px] w-full items-center justify-center gap-2 text-subhead text-ink-2">
                <Icon name="replay" size={17} /> All done. Reset
              </button>
            )}
          </ListGroup>
          <ListGroup header="Together">
            <ListRow title="Partner" trailing={<span className="flex items-center gap-2 text-body text-ink-2">Jamie <Avatar initials="J" size={28} /></span>} chevron={false} />
            <ListRow title="Anniversary" detail="26 Feb" />
            <ListRow title="Privacy" detail="Only you two" />
            <ListRow title={<span className="text-alert">Leave Dumbpling</span>} chevron={false} last />
          </ListGroup>
        </Stage>
      </Block>

      <Block title="Tab bar" description="A floating glass capsule with four tabs and no more. The selected tab switches to its filled glyph and gets a soft highlight. Content scrolls underneath and fades out at the bottom edge.">
        <Stage className="relative h-[300px] overflow-hidden p-0!" style={{ ['--canvas' as string]: 'var(--stage)' }}>
          <div className="space-y-3 p-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-surface" style={{ opacity: 1 - i * 0.15 }} />
            ))}
          </div>
          <TabBar active={tab} onChange={setTab} />
        </Stage>
      </Block>

      <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
        <Note kind="do">Use the system control, then restyle it. Accessibility, haptics and keyboard support come for free.</Note>
        <Note kind="dont">Build custom controls that look like system controls but behave differently.</Note>
      </div>
    </Section>
  )
}
