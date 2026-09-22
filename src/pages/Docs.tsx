import { useMemo, useState } from 'react'
import { ArrowRight, Search, Terminal } from 'lucide-react'
import { Button, Heading, Kicker, PageHead, Panel, Reveal } from '../components/shared'
import { DOC_SECTIONS } from '../data'
import { useRouter } from '../router'

export default function Docs() {
  const { navigate } = useRouter()
  const [q, setQ] = useState('')

  const shown = useMemo(
    () =>
      DOC_SECTIONS.filter(
        (d) =>
          d.title.toLowerCase().includes(q.toLowerCase()) ||
          d.desc.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  )

  return (
    <>
      <PageHead
        no="06"
        kicker="Documentation"
        title="Everything you need to"
        accent="build."
        sub="Guides, references and copy-paste examples. Most teams ship their first automation before their coffee gets cold."
      />

      {/* search */}
      <section className="relative z-10 border-b border-line px-6 py-12 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 px-4 py-3.5 transition-colors focus-within:border-mint/50">
            <Search size={18} className="text-mist" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the docs…"
              className="w-full bg-transparent text-sm text-cloud outline-none placeholder:text-mist"
            />
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-mist sm:block">/</kbd>
          </div>
        </div>
      </section>

      {/* sections */}
      <section className="relative z-10 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((d, i) => (
              <Reveal key={d.title} delay={(i % 3) * 0.05}>
                <button
                  onClick={() => navigate('docs')}
                  className="group h-full w-full rounded-2xl border border-line bg-panel/40 p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-mint/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-slate-950 text-mint transition-transform duration-500 group-hover:scale-110">
                      <d.icon size={20} strokeWidth={1.75} />
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-mist">
                      {d.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-cloud">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{d.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-mint">
                    Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
          {shown.length === 0 && (
            <p className="py-16 text-center text-mist">No results for &ldquo;{q}&rdquo;.</p>
          )}
        </div>
      </section>

      {/* code sample */}
      <section className="relative z-10 border-t border-line px-6 py-24 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Kicker>API-first</Kicker>
            <Heading className="mt-5 text-3xl md:text-4xl">
              Trigger runs from<span className="text-mint"> anywhere.</span>
            </Heading>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
              Every workflow gets a secure webhook and a typed SDK. Fire a run from your app,
              your CI, or a cron — and stream the results straight back.
            </p>
            <div className="mt-7 flex gap-3">
              <Button label="API reference" onClick={() => navigate('docs')} />
              <Button label="Get an API key" variant="outline" icon={false} onClick={() => navigate('login')} />
            </div>
          </div>

          <Reveal delay={0.1}>
            <Panel className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <Terminal size={14} className="text-mint" />
                <span className="font-mono text-xs text-mist">trigger-run.ts</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                <code>
                  <span className="text-violet">import</span>{' '}
                  <span className="text-cloud">{'{ Flowline }'}</span>{' '}
                  <span className="text-violet">from</span>{' '}
                  <span className="text-mint">&apos;@flowline/sdk&apos;</span>
                  {'\n\n'}
                  <span className="text-violet">const</span> <span className="text-cloud">fl</span> ={' '}
                  <span className="text-violet">new</span> <span className="text-azure">Flowline</span>(
                  <span className="text-cloud">apiKey</span>)
                  {'\n\n'}
                  <span className="text-mist">{'// kick off a workflow'}</span>
                  {'\n'}
                  <span className="text-violet">await</span> <span className="text-cloud">fl</span>.
                  <span className="text-azure">run</span>(<span className="text-mint">&apos;lead-router&apos;</span>, {'{'}
                  {'\n  '}
                  <span className="text-cloud">email</span>:{' '}
                  <span className="text-mint">&apos;sam@acme.io&apos;</span>,
                  {'\n  '}
                  <span className="text-cloud">source</span>:{' '}
                  <span className="text-mint">&apos;pricing_page&apos;</span>,
                  {'\n'}
                  {'}'})
                </code>
              </pre>
            </Panel>
          </Reveal>
        </div>
      </section>
    </>
  )
}
