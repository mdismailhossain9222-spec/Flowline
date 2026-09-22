import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Plus } from 'lucide-react'
import { Button, EASE, Heading, Kicker, PageHead, Reveal } from '../components/shared'
import { PLANS, FAQ } from '../data'
import { useRouter } from '../router'
import { cn } from '../utils/cn'

export default function Pricing() {
  const { navigate } = useRouter()
  const [yearly, setYearly] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <PageHead
        no="04"
        kicker="Pricing"
        title="Simple pricing that"
        accent="scales."
        sub="Start free, upgrade when your team does. Every plan includes the visual builder and real-time runs."
      />

      {/* billing toggle */}
      <section className="relative z-10 px-6 pt-14 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4">
          <span className={cn('text-sm font-medium', !yearly ? 'text-cloud' : 'text-mist')}>Monthly</span>
          <button
            onClick={() => setYearly((v) => !v)}
            className="relative h-7 w-14 rounded-full border border-line bg-panel"
            aria-label="Toggle billing period"
          >
            <motion.span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-mint"
              animate={{ left: yearly ? '2rem' : '0.15rem' }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            />
          </button>
          <span className={cn('text-sm font-medium', yearly ? 'text-cloud' : 'text-mist')}>
            Yearly <span className="text-mint">— save 20%</span>
          </span>
        </div>
      </section>

      {/* plans */}
      <section className="relative z-10 px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-4">
          {PLANS.map((p, i) => {
            const price = yearly ? p.priceY : p.priceM
            return (
              <Reveal key={p.name} delay={i * 0.06}>
                <div
                  className={cn(
                    'flex h-full flex-col rounded-2xl border p-7 transition-colors',
                    p.popular ? 'border-mint/50 bg-panel glow-mint' : 'border-line bg-panel/40'
                  )}
                >
                  {p.popular && (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-mint px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#05221a]">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold text-cloud">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-mist">{p.tagline}</p>
                  <div className="mt-6 flex items-end gap-1">
                    {price === null ? (
                      <span className="font-display text-4xl font-bold text-cloud">Custom</span>
                    ) : (
                      <>
                        <span className="font-display text-5xl font-bold text-cloud">${price}</span>
                        <span className="mb-1.5 text-sm text-mist">/user/mo</span>
                      </>
                    )}
                  </div>
                  <Button
                    label={p.cta}
                    variant={p.popular ? 'primary' : 'outline'}
                    icon={false}
                    className="mt-6 w-full"
                    onClick={() => navigate(price === null ? 'customers' : 'login')}
                  />
                  <ul className="mt-7 space-y-3 border-t border-line pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-cloud">
                        <Check size={16} className="mt-0.5 shrink-0 text-mint" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 border-t border-line px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl">
          <Kicker>Questions</Kicker>
          <Heading className="mt-5 text-3xl md:text-5xl">Good to know.</Heading>
          <div className="mt-12 border-t border-line">
            {FAQ.map(([q, a], i) => {
              const open = openFaq === i
              return (
                <div key={q} className="border-b border-line">
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={open}
                  >
                    <span className={cn('font-display text-lg font-medium md:text-xl', open ? 'text-mint' : 'text-cloud')}>
                      {q}
                    </span>
                    <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors', open ? 'border-mint text-mint' : 'border-line text-mist')}>
                      {open ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-sm leading-relaxed text-mist md:text-base">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
