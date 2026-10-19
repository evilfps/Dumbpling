import { Block, Note, Rows, Section } from '../components/doc'

const voice = [
  ['Warm, not soppy', 'Jamie’s thinking of you.', 'Aww, your bae is sending SO much love!!'],
  ['Plain, not clever', 'Dinner moved to 20:00.', 'Plot twist! Your dinner plans have evolved.'],
  ['Even-handed', 'You haven’t walked together this week.', 'Jamie walked 3 times. You didn’t walk at all.'],
  ['Gentle with feelings', 'Jamie’s feeling low today.', 'Alert: Jamie’s mood dropped 40%.'],
  ['British English', 'Favourite, organise, 14 June, 19:30, £', 'Favorite, organize, June 14th, 7:30 PM, $'],
]

const a11y = [
  ['Dynamic Type', 'Every screen works from xSmall to AX5. Rows grow taller, and titles wrap instead of truncating.'],
  ['VoiceOver', 'Every glyph button has a label. Feeling orbs read out their feeling’s name, not their colour.'],
  ['Colour independence', 'A feeling is always shown with its name as well as its colour. Nothing relies on hue alone.'],
  ['Hit targets', 'At least 44 × 44 pt, however small the glyph.'],
  ['Reduce Motion', 'Movement becomes a cross-fade. Ambient motion stops.'],
  ['Reduce Transparency', 'Glass becomes solid surface. Increase Contrast moves hairlines to ink-3.'],
]

export function Guidelines() {
  return (
    <Section
      id="guidelines"
      index="16 — Guidelines"
      title="Kind by default."
      intro="Dumbpling holds something personal: two people and how they feel. The words, the defaults and the way the app treats each partner matter as much as the pixels."
    >
      <Block title="Voice" description="Write like a thoughtful friend who knows you both. Keep it short and specific. Never write anything that makes one partner look bad to the other.">
        <Rows>
          {voice.map(([t, y, n]) => (
            <div key={t} className="grid gap-2 py-5 text-subhead md:grid-cols-[200px_1fr_1fr] md:items-baseline">
              <span className="font-medium text-ink">{t}</span>
              <span className="text-ink">{y}</span>
              <span className="text-ink-3 line-through decoration-ink-3/50">{n}</span>
            </div>
          ))}
        </Rows>
      </Block>

      <Block title="Designing for two" description="Most apps are designed for one person. These rules come from designing for two.">
        <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
          <Note kind="do">Show shared progress as one total, with each person’s share inside it.</Note>
          <Note kind="dont">Rank partners, show leaderboards, or compare one person’s activity with the other’s.</Note>
          <Note kind="do">Keep things private by default. Share only after both people agree, and make it easy to stop sharing.</Note>
          <Note kind="dont">Use streaks, red badges or guilt (“Jamie is waiting”) to bring people back.</Note>
          <Note kind="do">Let a low feeling be low. Suggest a gentle gesture, never a fix.</Note>
          <Note kind="dont">Notify a partner about cycle or mood changes unless the person has chosen to share them.</Note>
        </div>
      </Block>

      <Block title="Accessibility" description="Every screen meets these before it ships.">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {a11y.map(([t, b]) => (
            <div key={t} className="border-t border-line pt-5">
              <p className="text-headline text-ink">{t}</p>
              <p className="mt-1.5 text-subhead text-ink-2">{b}</p>
            </div>
          ))}
        </div>
      </Block>
    </Section>
  )
}
