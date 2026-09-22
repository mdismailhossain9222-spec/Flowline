import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button, EASE, Heading, Kicker, PageHead, Reveal } from '../components/shared'
import { SOLUTIONS } from '../data'
import { useRouter } from '../router'
import { cn } from '../utils/cn'

export default function Solutions() {
  const { navigate } = useRouter()
  const [active, setActive] = useState(0)
  const s = SOLUTIONS[active]

  return (
    <>
      <PageHead
        no="03"
        kicker="Solutions"
        title="Built for every"
        accent="team."
        sub="However your team works, there's a Flowline pattern for the repetitive part. Pick a discipline to see how."
      />

      {/* tabbed solutions */}
      <section className="relative z-10 border-b border-line px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2">
            {SOLUTIONS.map((sol, i) => (
              <button
                key={sol.tag}
                onClick={() => setActive(i)}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
                  active === i
                    ? 'border-mint/50 bg-mint/10 text-mint'
                    : 'border-line text-mist hover:border-mint/30 hover:text-cloud'
                )}
              >
                <sol.icon size={16} />
                {sol.tag}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-slate-950 text-mint">
                  <s.icon size={26} strokeWidth={1.75} />
                </span>
                <h2 className="mt-6 font-display text-3xl font-semibold text-cloud md:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-mist">{s.text}</p>
                <ul className="mt-8 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-mint/10 text-mint">
                        <Check size={13} />
                      </span>
                      <span className="text-sm text-cloud">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button label="Start automating" onClick={() => navigate('login')} />
                </div>
              </div>

              {/* mock automation card */}
              <div className="rounded-2xl border border-line bg-panel/40 p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-mono text-xs text-mist">{s.tag.toLowerCase()}-flow.yaml</span>
                  <span className="flex items-center gap-2 text-xs text-mint">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" /> active
                  </span>
                </div>
                <div className="mt-5 space-y-2.5">
                  {['on:', ...s.points.map((p) => `  - ${p.toLowerCase().replace(/ /g, '_')}`), 'run: continuous'].map(
                    (line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="font-mono text-sm"
                      >
                        <span className={i === 0 || line.startsWith('run') ? 'text-azure' : 'text-mist'}>
                          {line}
                        </span>
                      </motion.p>
                    )
                  )}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
                  {[['Saved / wk', '12h'], ['Accuracy', '99%'], ['Setup', '1 day']].map(([k, v]) => (
                    <div key={k}>
                      <p className="font-display text-lg font-semibold text-cloud">{v}</p>
                      <p className="text-[11px] text-mist">{k}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* all disciplines grid */}
      <section className="relative z-10 px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Kicker>Every discipline</Kicker>
          <Heading className="mt-5 text-3xl md:text-5xl">
            If it repeats, it can<span className="text-mint"> flow.</span>
          </Heading>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS.map((sol, i) => (
              <Reveal key={sol.tag} delay={(i % 4) * 0.06}>
                <button
                  onClick={() => setActive(i)}
                  className="group h-full w-full rounded-2xl border border-line bg-panel/40 p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-mint/40"
                >
                  <sol.icon size={22} className="text-mint" strokeWidth={1.75} />
                  <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-mist">{sol.tag}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-cloud">{sol.title}</h3>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
