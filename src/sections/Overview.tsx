import { LogoMark } from '../components/Logo'
import { Reveal } from '../components/doc'

const principles = [
  { t: 'Quiet', b: 'Black, white and grey carry the interface. Type sets the hierarchy. Chrome steps back so your partner’s words come first.' },
  { t: 'Meaningful colour', b: 'Colour appears only when it says something about a person: how they feel, or where they are in their cycle.' },
  { t: 'Native', b: 'SF Pro, Dynamic Type, system gestures, haptics and materials. When iOS already has an answer, we use it.' },
  { t: 'Unhurried', b: 'Springs answer touch straight away. Ambient motion is slow, like light moving across a surface. Nothing performs.' },
]

export function Overview() {
  return (
    <section id="overview" className="relative pb-28 pt-20 md:pt-28">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 opacity-40 blur-[110px] dark:opacity-[0.22]" aria-hidden>
        <div className="absolute left-[18%] top-[20%] size-[340px] rounded-full bg-tender" />
        <div className="absolute right-[18%] top-[26%] size-[320px] rounded-full bg-calm" />
      </div>

      <Reveal className="relative flex flex-col items-center text-center">
        <LogoMark size={56} breathe />
        <h1 className="text-shimmer mt-12 pb-2 text-[56px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[80px]">
          Quietly made
          <br />
          for two.
        </h1>
        <p className="mt-7 max-w-[540px] text-[19px] leading-[29px] tracking-[-0.015em] text-ink-2">
          This is the design system for Dumbpling, an iPhone app that couples share. The interface is monochrome and native first, and colour is used for one thing only: how you feel.
        </p>
        <p className="tnum mt-8 font-mono text-[12px] text-ink-3">v2.0 · iOS 17+ · SF Pro · 393 × 852 pt</p>
      </Reveal>

      <Reveal className="relative mt-28 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" delay={0.1}>
        {principles.map((p, i) => (
          <div key={p.t} className="border-t border-line pt-5">
            <p className="tnum font-mono text-[12px] text-ink-3">0{i + 1}</p>
            <h3 className="mt-3 text-headline text-ink">{p.t}</h3>
            <p className="mt-2 text-subhead text-ink-2">{p.b}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
