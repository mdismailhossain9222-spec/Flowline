import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import FlowScene from '../components/three/FlowScene'
import { Button, EASE, Heading, Kicker, PageHead, Panel, Reveal } from '../components/shared'
import { FEATURES } from '../data'
import { useRouter } from '../router'
import { cn } from '../utils/cn'

/* interactive: pick a trigger, see a flow assemble */
const RECIPES = [
  { trigger: 'New GitHub issue', steps: ['Classify with AI', 'Assign owner', 'Post to Slack', 'Add to sprint'] },
  { trigger: 'Stripe payment failed', steps: ['Enrich customer', 'Retry in 3 days', 'Email dunning', 'Flag CSM'] },
  { trigger: 'Form submitted', steps: ['Validate fields', 'Create CRM record', 'Route to rep', 'Send welcome'] },
]

function Builder() {
  const [active, setActive] = useState(0)
  const r = RECIPES[active]
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap gap-2 border-b border-line p-4">
        {RECIPES.map((rec, i) => (
          <button
            key={rec.trigger}
            onClick={() => setActive(i)}
            className={cn(
              'rounded-lg px-3.5 py-2 text-xs font-medium transition-colors',
              active === i ? 'bg-mint text-[#05221a]' : 'border border-line text-mist hover:text-cloud'
            )}
          >
            {rec.trigger}
          </button>
        ))}
      </div>
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 rounded-xl border border-mint/40 bg-mint/5 px-4 py-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint/15 text-mint">
                <Check size={15} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-mist">Trigger</p>
                <p className="text-sm font-medium text-cloud">{r.trigger}</p>
              </div>
            </div>
            {r.steps.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.09, ease: EASE }}
                className="ml-4 flex items-center gap-3"
              >
                <span className="h-6 w-px bg-line" />
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-slate-950 px-4 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-line text-mist">
                    <Plus size={14} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-mist">Step {i + 1}</p>
                    <p className="text-sm font-medium text-cloud">{s}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Panel>
  )
}

export default function Features() {
  const { navigate } = useRouter()
  return (
    <>
      <PageHead
        no="02"
        kicker="Features"
        title="Build it once,"
        accent="run it forever."
        sub="A visual canvas backed by a serious execution engine — logic, retries, versioning and observability built in."
      />

      {/* builder + 3D */}
      <section className="relative z-10 border-b border-line px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Kicker>Visual builder</Kicker>
            <Heading className="mt-5 text-3xl md:text-5xl">
              Pick a trigger.<span className="text-mint"> Watch it build.</span>
            </Heading>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
                Every automation starts with an event and flows through steps you can see.
                Switch triggers below to preview real recipes teams ship on day one.
              </p>
              <div className="mt-7">
                <Button label="Try the builder free" onClick={() => navigate('login')} />
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <Builder />
          </Reveal>
        </div>
      </section>

      {/* full feature grid */}
      <section className="relative z-10 px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.06}>
                <div className="group h-full rounded-2xl border border-line bg-panel/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-mint/40">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-slate-950 text-mint transition-transform duration-500 group-hover:scale-110">
                    <f.icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-cloud">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3D graph band */}
      <section className="relative z-10 overflow-hidden border-y border-line bg-slate-950">
        <FlowScene className="h-[42vh] min-h-[320px] w-full" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto max-w-md rounded-2xl border border-line bg-void/70 p-8 text-center backdrop-blur-md">
            <Heading className="text-2xl md:text-3xl">Observe every run in real time.</Heading>
            <p className="mt-3 text-sm text-mist">
              Live node states, payload inspection and one-click replay — no more guessing
              what your automation did at 3am.
            </p>
            <div className="mt-6 flex justify-center">
              <Button label="See it live" variant="outline" onClick={() => navigate('login')} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
