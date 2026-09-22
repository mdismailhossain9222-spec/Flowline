import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import FlowScene from '../components/three/FlowScene'
import { Button, Counter, EASE, Heading, Kicker, LogoRow, Panel, Reveal } from '../components/shared'
import { useRouter } from '../router'
import { FEATURES, METRICS, CUSTOMER_LOGOS, TESTIMONIALS } from '../data'

/* animated pipeline row — nodes light up in sequence */
function PipelineDemo() {
  const steps = ['Trigger', 'Enrich', 'Branch', 'Notify', 'Log']
  return (
    <Panel glow className="relative overflow-hidden p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs text-mist">
          <span className="h-2 w-2 rounded-full bg-mint animate-pulse-dot" /> live run · #48213
        </div>
        <span className="font-mono text-xs text-mist">312 ms</span>
      </div>
      <div className="mt-6 flex items-center gap-2 overflow-hidden">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <motion.div
              initial={{ opacity: 0.3, borderColor: 'rgba(30,38,54,1)' }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              animate={{ borderColor: ['rgba(30,38,54,1)', 'rgba(78,240,176,0.7)', 'rgba(30,38,54,1)'] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
              className="flex-1 rounded-lg border bg-slate-950 px-3 py-2.5 text-center"
            >
              <span className="text-[11px] font-medium text-cloud md:text-xs">{s}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="relative h-px w-4 shrink-0 bg-line md:w-6">
                <motion.span
                  className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-mint"
                  animate={{ left: ['0%', '100%'] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
        {[['Runs today', '2,481'], ['Success', '99.8%'], ['Saved', '46 hrs']].map(([k, v]) => (
          <div key={k}>
            <p className="font-display text-xl font-semibold text-cloud">{v}</p>
            <p className="text-[11px] text-mist">{k}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { navigate } = useRouter()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yScene = useTransform(scrollYProgress, [0, 1], [0, 160])
  const show = started ? 'visible' : 'hidden'

  return (
    <section ref={ref} className="relative overflow-hidden px-6 pt-32 md:px-10 md:pt-40">
      <div className="grid-fade absolute inset-0" />
      {/* 3D scene layer */}
      <motion.div style={{ y: yScene }} className="pointer-events-none absolute inset-0 z-0">
        <FlowScene className="h-full w-full opacity-70 md:opacity-100" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={show}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="flex justify-center"
        >
          <Kicker>New — AI step suggestions</Kicker>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={show}
          transition={{ duration: 1, ease: EASE, delay: 0.42 }}
          className="mt-7 font-display text-[clamp(2.8rem,8vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-grad"
        >
          Automate the
          <br />
          <span className="text-mint">busywork.</span>
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={show}
          transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg"
        >
          Flowline lets your team build powerful workflows visually — connect every tool,
          add logic, and let the platform run it. No code, no fragile scripts.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={show}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button label="Start free" onClick={() => navigate('login')} />
          <Button label="Watch 2-min demo" variant="outline" icon={false} onClick={() => navigate('features')} />
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate={show}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-5 flex items-center justify-center gap-2 text-xs text-mist"
        >
          <Check size={14} className="text-mint" /> Free forever plan · No credit card
        </motion.p>
      </div>

      {/* pipeline demo card */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        animate={show}
        transition={{ duration: 1, ease: EASE, delay: 1 }}
        className="relative z-10 mx-auto mt-16 max-w-3xl"
      >
        <PipelineDemo />
      </motion.div>

      {/* logos */}
      <div className="relative z-10 mx-auto mt-20 max-w-5xl border-t border-line py-10">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-mist">
          Trusted by 8,000+ teams
        </p>
        <LogoRow names={CUSTOMER_LOGOS.slice(0, 6)} />
      </div>
    </section>
  )
}

function Metrics() {
  return (
    <section className="relative z-10 border-y border-line bg-slate-950 px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {METRICS.map((m) => (
          <Reveal key={m.label} className="text-center md:text-left">
            <p className="font-display text-4xl font-bold text-cloud md:text-5xl">
              <Counter value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
            </p>
            <p className="mt-2 text-sm text-mist">{m.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FeatureGrid() {
  const { navigate } = useRouter()
  return (
    <section className="relative z-10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Kicker>Everything you need</Kicker>
          <Heading className="mt-5 text-4xl md:text-6xl">
            One canvas for every<span className="text-mint"> workflow.</span>
          </Heading>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">
              From a two-step alert to a hundred-node revenue engine — build it once, watch
              it run forever.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <div
                data-hover
                className="group h-full rounded-2xl border border-line bg-panel/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-mint/40 hover:bg-panel"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-slate-950 text-mint transition-transform duration-500 group-hover:scale-110">
                  <f.icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-cloud">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Button label="Explore all features" variant="outline" onClick={() => navigate('features')} />
        </Reveal>
      </div>
    </section>
  )
}

function Testimonials() {
  const { navigate } = useRouter()
  return (
    <section className="relative z-10 border-t border-line bg-slate-950 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Kicker>Loved by teams</Kicker>
            <Heading className="mt-5 text-4xl md:text-5xl">Results, not just runs.</Heading>
          </div>
          <Button label="Read customer stories" variant="ghost" onClick={() => navigate('customers')} />
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.slice(0, 4).map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.08}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-panel/40 p-7">
                <p className="font-display text-lg leading-relaxed text-cloud md:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                  <div>
                    <p className="text-sm font-semibold text-cloud">{t.name}</p>
                    <p className="text-xs text-mist">{t.role}</p>
                  </div>
                  <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-medium text-mint">
                    {t.metric}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const { navigate } = useRouter()
  return (
    <section className="relative z-10 overflow-hidden px-6 py-28 md:px-10 md:py-40">
      <div className="grid-fade absolute inset-0" />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <Heading className="text-4xl md:text-6xl">
          Ship your first workflow<span className="text-mint"> today.</span>
        </Heading>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-mist md:text-lg">
          Start free in minutes. Invite your team, connect your stack, and let Flowline
          handle the busywork.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button label="Start free" onClick={() => navigate('login')} />
          <Button label="Compare plans" variant="outline" icon={false} onClick={() => navigate('pricing')} />
        </div>
      </Reveal>
    </section>
  )
}

export default function Home({ started }: { started: boolean }) {
  return (
    <>
      <Hero started={started} />
      <Metrics />
      <FeatureGrid />
      <Testimonials />
      <CTA />
    </>
  )
}
