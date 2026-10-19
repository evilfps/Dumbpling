import { Conversation } from '../components/Conversation'
import { Block, Rows, Section, Spec, Stage } from '../components/doc'

const specs = [
  ['Bubble', 'Radius 18 · padding 12 × 7 · Body 17'],
  ['Width', 'At most 74% of the thread'],
  ['Rhythm', '2 pt within a group · 10 pt between senders'],
  ['Tail', 'Last bubble in a group only'],
  ['Sent', 'Ink, with a 40 pt highlight from the top'],
  ['Received', 'surface-2 · #E9E9EB / #232326'],
  ['Time', 'Centred, only after a gap of 60 minutes or more'],
  ['Receipt', 'Under the last sent message only'],
  ['Reactions', 'Press and hold 0.38 s · 30 pt badge'],
  ['Typing', 'Three dots · 1.4 s loop · 180 ms stagger'],
]

export function Messages() {
  return (
    <Section
      id="messages"
      index="08 — Messages"
      title="Feels like iMessage."
      intro="Messages is where couples spend most of their time, so it follows iMessage closely: the same rhythm, tails, receipts and reactions. The only change is tone. Your messages are ink, not blue."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Stage className="flex h-[640px] flex-col p-0!" caption="Send a message, then wait for the reply. Press and hold any bubble to react.">
          <Conversation className="h-full" composerClassName="pb-5" />
        </Stage>
        <div className="flex flex-col justify-between gap-10">
          <Block title="Specification">
            <Rows>
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[96px_1fr] gap-4 py-3 text-subhead">
                  <span className="text-ink-3">{k}</span>
                  <span className="tnum text-ink">{v}</span>
                </div>
              ))}
            </Rows>
          </Block>
          <div className="flex flex-col gap-2">
            <Spec>ScrollView {'{ … }'}.defaultScrollAnchor(.bottom)</Spec>
            <Spec>.scrollDismissesKeyboard(.interactively)</Spec>
            <Spec>.safeAreaInset(edge: .bottom) {'{ Composer() }'}</Spec>
            <Spec>.contextMenu {'{ … }'} preview: {'{ BubblePreview() }'}</Spec>
          </div>
        </div>
      </div>
    </Section>
  )
}
