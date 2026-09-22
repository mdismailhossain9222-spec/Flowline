import {
  GitBranch, Workflow, Boxes, ShieldCheck, Gauge, Plug, Bell, Clock,
  Users, Building2, Rocket, LineChart,
} from 'lucide-react'

export const FEATURES = [
  { icon: Workflow, title: 'Visual builder', text: 'Drag nodes, draw connections, ship. No YAML, no glue code — just the flow you meant to build.' },
  { icon: Plug, title: '250+ integrations', text: 'Slack, GitHub, Stripe, Notion, HubSpot and everything else your team already lives in.' },
  { icon: GitBranch, title: 'Branching logic', text: 'Conditions, loops, retries and parallel paths. Model any real process, however messy.' },
  { icon: Clock, title: 'Schedules & triggers', text: 'Cron, webhooks, form submits or record changes — start a run from anything.' },
  { icon: Gauge, title: 'Real-time runs', text: 'Watch every step execute live, inspect payloads, and replay any run from any point.' },
  { icon: ShieldCheck, title: 'Enterprise security', text: 'SOC 2 Type II, SAML SSO, granular roles and full audit logs on every plan tier.' },
  { icon: Boxes, title: 'Reusable modules', text: 'Package a flow once, share it across teams, version it like code.' },
  { icon: Bell, title: 'Smart alerting', text: 'Get pinged only when something actually needs you — with the context to fix it fast.' },
]

export const SOLUTIONS = [
  { icon: Rocket, tag: 'Engineering', title: 'Ship & release ops', text: 'Automate CI hand-offs, changelog posts, incident routing and on-call escalation.', points: ['Deploy notifications', 'Incident auto-triage', 'Release notes'] },
  { icon: Users, tag: 'Revenue', title: 'Sales & lifecycle', text: 'Route leads, enrich records, sync your CRM and trigger the right message at the right moment.', points: ['Lead routing', 'CRM enrichment', 'Renewal nudges'] },
  { icon: LineChart, tag: 'Operations', title: 'Internal ops', text: 'Onboard employees, reconcile invoices and keep every internal tool in perfect sync.', points: ['Onboarding flows', 'Finance sync', 'Approvals'] },
  { icon: Building2, tag: 'Support', title: 'Customer success', text: 'Auto-tag tickets, surface churn risk and escalate the accounts that matter.', points: ['Ticket triage', 'Churn signals', 'CSAT loops'] },
]

export const METRICS = [
  { value: 14, suffix: 'M+', label: 'Workflows run monthly' },
  { value: 250, suffix: '+', label: 'Native integrations' },
  { value: 99.99, suffix: '%', label: 'Uptime SLA', decimals: 2 },
  { value: 8, suffix: 'k', label: 'Teams onboard' },
]

export const CUSTOMER_LOGOS = ['Northwind', 'Vertex', 'Lumen', 'Cobalt', 'Мonza', 'Halcyon', 'Kestrel', 'Meridian']

export const TESTIMONIALS = [
  { quote: 'Flowline replaced four internal scripts and a very fragile cron server. Our ops team got a week back every month.', name: 'Priya Nair', role: 'Head of Ops, Vertex', metric: '−72% manual work' },
  { quote: 'We modelled our entire incident process in an afternoon. Mean time to acknowledge dropped from 20 minutes to under two.', name: 'Marcus Feld', role: 'SRE Lead, Lumen', metric: '10× faster MTTA' },
  { quote: 'The visual builder means our RevOps folks build their own automations now. Engineering is finally out of the loop.', name: 'Dana Okoro', role: 'VP Revenue, Cobalt', metric: '+38% pipeline velocity' },
  { quote: 'Audit logs and SSO were table stakes for us. Flowline passed security review faster than any tool we have adopted.', name: 'Sven Aalto', role: 'CISO, Meridian', metric: 'SOC 2 in days' },
]

export const CASE_STUDIES = [
  { company: 'Vertex', industry: 'Fintech', result: 'Cut reconciliation time by 72%', text: 'Automated a nightly finance close that used to take three people until midnight.' },
  { company: 'Lumen', industry: 'DevTools', result: '10× faster incident response', text: 'Every alert now routes, enriches and escalates itself before a human wakes up.' },
  { company: 'Cobalt', industry: 'SaaS', result: '+38% pipeline velocity', text: 'RevOps builds its own lead flows — no more two-week engineering queue.' },
]

export type Plan = {
  name: string
  priceM: number | null
  priceY: number | null
  tagline: string
  popular?: boolean
  features: readonly string[]
  cta: string
}

export const PLANS: Plan[] = [
  {
    name: 'Starter', priceM: 0, priceY: 0, tagline: 'For individuals automating the basics.',
    features: ['3 active workflows', '1,000 runs / month', '50+ core integrations', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Team', priceM: 29, priceY: 24, tagline: 'For growing teams that ship daily.', popular: true,
    features: ['Unlimited workflows', '25,000 runs / month', '250+ integrations', 'Branching & retries', 'Role-based access', 'Priority support'],
    cta: 'Start 14-day trial',
  },
  {
    name: 'Business', priceM: 79, priceY: 66, tagline: 'For orgs that run on automation.',
    features: ['Everything in Team', '250,000 runs / month', 'SAML SSO & SCIM', 'Audit logs', 'Sandbox environments', 'Dedicated CSM'],
    cta: 'Start 14-day trial',
  },
  {
    name: 'Enterprise', priceM: null, priceY: null, tagline: 'For scale, compliance and control.',
    features: ['Unlimited runs', 'On-prem / VPC deploy', 'Custom SLA & DPA', 'HIPAA & SOC 2', 'Solutions engineering', '24/7 support'],
    cta: 'Talk to sales',
  },
] as const

export const FAQ = [
  ['Is there really a free plan?', 'Yes — Starter is free forever, no card required. It covers three active workflows and a thousand runs a month, which is plenty to automate the annoying stuff.'],
  ['What counts as a “run”?', 'One run is a single end-to-end execution of a workflow, however many steps it contains. Failed runs that stop at the first step are not counted.'],
  ['Can I self-host?', 'Enterprise customers can deploy Flowline in their own VPC or fully on-prem, with the same visual builder and a private control plane.'],
  ['How does security work?', 'We are SOC 2 Type II certified, encrypt data in transit and at rest, support SAML SSO and SCIM, and keep immutable audit logs of every action.'],
  ['Do you offer migration help?', 'Team plans and above include guided migration. Our solutions engineers will help port your existing Zapier, Make or homegrown scripts.'],
]

export const DOC_SECTIONS = [
  { icon: Rocket, title: 'Quickstart', desc: 'Build and run your first workflow in under five minutes.', tag: 'Guide' },
  { icon: Plug, title: 'Integrations', desc: 'Connect and authenticate any of 250+ supported apps.', tag: 'Reference' },
  { icon: GitBranch, title: 'Logic & control', desc: 'Branches, loops, retries, error handling and parallelism.', tag: 'Guide' },
  { icon: Workflow, title: 'API & webhooks', desc: 'Trigger runs programmatically and stream results back.', tag: 'Reference' },
  { icon: ShieldCheck, title: 'Security & SSO', desc: 'SAML, SCIM, roles, audit logs and data residency.', tag: 'Admin' },
  { icon: Boxes, title: 'Modules & reuse', desc: 'Package, version and share flows across your org.', tag: 'Guide' },
]
