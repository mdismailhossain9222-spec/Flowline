import { Button, Counter, Heading, Kicker, LogoRow, PageHead, Reveal } from '../components/shared'
import { CASE_STUDIES, TESTIMONIALS, CUSTOMER_LOGOS, METRICS } from '../data'
import { useRouter } from '../router'

export default function Customers() {
  const { navigate } = useRouter()
  return (
    <>
      <PageHead
        no="05"
        kicker="Customers"
        title="Teams that ship"
        accent="on autopilot."
        sub="From two-person startups to public companies — see what teams build when the busywork disappears."
      />

      {/* logos */}
      <section className="relative z-10 border-b border-line px-6 py-14 md:px-10">
        <div className="mx-auto max-w-6xl">
          <LogoRow names={CUSTOMER_LOGOS} />
        </div>
      </section>

      {/* case studies */}
      <section className="relative z-10 px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {CASE_STUDIES.map((c, i) => (
              <Reveal key={c.company} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-2xl border border-line bg-panel/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-mint/40">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-semibold text-cloud">{c.company}</span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-mist">
                      {c.industry}
                    </span>
                  </div>
                  <p className="mt-6 font-display text-2xl font-semibold text-mint">{c.result}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{c.text}</p>
                  <button
                    onClick={() => navigate('customers')}
                    className="mt-6 text-left text-sm font-medium text-cloud transition-colors hover:text-mint"
                    data-hover
                  >
                    Read case study →
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* metrics band */}
      <section className="relative z-10 border-y border-line bg-slate-950 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
          {METRICS.map((m) => (
            <Reveal key={m.label} className="text-center">
              <p className="font-display text-4xl font-bold text-cloud md:text-5xl">
                <Counter value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
              </p>
              <p className="mt-2 text-sm text-mist">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* testimonial wall */}
      <section className="relative z-10 px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Kicker>In their words</Kicker>
          <Heading className="mt-5 text-3xl md:text-5xl">Fewer scripts. More shipping.</Heading>
          <div className="mt-12 columns-1 gap-4 md:columns-2 lg:columns-3">
            {[...TESTIMONIALS, ...TESTIMONIALS.slice(0, 2)].map((t, i) => (
              <Reveal key={i} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid">
                <div className="rounded-2xl border border-line bg-panel/40 p-6">
                  <p className="text-sm leading-relaxed text-cloud">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-mint/10 text-xs font-bold text-mint">
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-cloud">{t.name}</p>
                      <p className="text-xs text-mist">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 overflow-hidden border-t border-line px-6 py-24 text-center md:px-10 md:py-32">
        <div className="grid-fade absolute inset-0" />
        <Reveal className="relative mx-auto max-w-2xl">
          <Heading className="text-3xl md:text-5xl">
            Join 8,000 teams on<span className="text-mint"> Flowline.</span>
          </Heading>
          <div className="mt-8 flex justify-center">
            <Button label="Start free" onClick={() => navigate('login')} />
          </div>
        </Reveal>
      </section>
    </>
  )
}
