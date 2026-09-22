/* ------------------------------------------------------------------ */
/*  LIA API — core library                                              */
/*  config · json store · tokens/cookies · validation schemas · mw     */
/* ------------------------------------------------------------------ */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

/* ============================ config ============================ */

const isProd = process.env.NODE_ENV === 'production'

function secret(name, devFallback) {
  const value = process.env[name]
  if (value && value.length >= 32) return value
  if (isProd) throw new Error(`[config] ${name} must be set (min 32 chars) in production`)
  return devFallback // development-only fallback — never used in prod
}

export const config = {
  isProd,
  port: Number(process.env.PORT ?? 4000),
  clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim()),
  accessSecret: secret('JWT_ACCESS_SECRET', 'dev-only-access-secret-change-me-32ch'),
  refreshSecret: secret('JWT_REFRESH_SECRET', 'dev-only-refresh-secret-change-me-32c'),
  dataFile: process.env.DATA_FILE ?? path.resolve(process.cwd(), 'data.json'),
  accessTtlSec: 15 * 60, // 15 minutes
  refreshTtlSec: 7 * 24 * 60 * 60, // 7 days
  lockAfter: 5, // failed logins before lockout
  lockMinutes: 15,
}

/* ========================== json store =========================== */
/*  Zero-dependency persistence so the API runs anywhere. Swap this   */
/*  module for Postgres/Prisma in production — the route code does    */
/*  not change.                                                       */

let cache = null

function load() {
  if (cache) return cache
  try {
    cache = JSON.parse(fs.readFileSync(config.dataFile, 'utf8'))
  } catch {
    cache = { users: [], reservations: [], refreshTokens: [] }
  }
  cache.users ??= []
  cache.refreshTokens ??= []
  cache.enquiries ??= []
  cache.messages ??= []
  return cache
}

function persist() {
  const tmp = `${config.dataFile}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2))
  fs.renameSync(tmp, config.dataFile) // atomic write
}

export const store = {
  enquiries: {
    insert(e) {
      load().enquiries.push(e)
      persist()
      return e
    },
    forUser(userId) {
      return load().enquiries.filter((e) => e.userId === userId)
    },
  },
  messages: {
    insert(m) {
      load().messages.push(m)
      persist()
      return m
    },
  },
  users: {
    byEmail(email) {
      return load().users.find((u) => u.email === email) ?? null
    },
    byId(id) {
      return load().users.find((u) => u.id === id) ?? null
    },
    insert(user) {
      load().users.push(user)
      persist()
      return user
    },
    update(email, patch) {
      const u = this.byEmail(email)
      if (!u) return null
      Object.assign(u, patch)
      persist()
      return u
    },
  },
  refresh: {
    put(rec) {
      const db = load()
      db.refreshTokens = db.refreshTokens.filter((t) => t.exp > Date.now()) // gc
      db.refreshTokens.push(rec)
      persist()
    },
    get(jti) {
      return load().refreshTokens.find((t) => t.jti === jti) ?? null
    },
    revoke(jti) {
      const t = this.get(jti)
      if (t) {
        t.revoked = true
        persist()
      }
    },
  },
}

/* ========================= tokens/cookies ======================== */

export const newJti = () => crypto.randomUUID()

export const signAccess = (user) =>
  jwt.sign({ sub: user.id, name: user.name, email: user.email }, config.accessSecret, {
    expiresIn: config.accessTtlSec,
  })

export const signRefresh = (userId, jti) =>
  jwt.sign({ sub: userId, jti }, config.refreshSecret, { expiresIn: config.refreshTtlSec })

export const verifyAccess = (token) => jwt.verify(token, config.accessSecret)
export const verifyRefresh = (token) => jwt.verify(token, config.refreshSecret)

const baseCookie = {
  httpOnly: true, // not readable from JS — mitigates XSS token theft
  sameSite: 'strict', // CSRF defense
  secure: config.isProd, // HTTPS-only in production
}

export function setAuthCookies(res, { access, refresh }) {
  res.cookie('lia_access', access, { ...baseCookie, maxAge: config.accessTtlSec * 1000, path: '/' })
  res.cookie('lia_refresh', refresh, {
    ...baseCookie,
    maxAge: config.refreshTtlSec * 1000,
    path: '/api/auth', // refresh token only travels to auth endpoints
  })
}

export function clearAuthCookies(res) {
  res.clearCookie('lia_access', { ...baseCookie, path: '/' })
  res.clearCookie('lia_refresh', { ...baseCookie, path: '/api/auth' })
}

/* ============================ schemas ============================ */

const sanitize = (s) => s.replace(/[<>"`]/g, '').trim()

const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(120)
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or fewer') // bcrypt input limit
  .regex(/[A-Za-z]/, 'Password needs at least one letter')
  .regex(/\d/, 'Password needs at least one number')

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(60).transform(sanitize),
  email,
  password,
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required').max(72),
})

const TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '21:00', '21:30', '22:30']
const AREAS = ['Hearth Counter', 'Dining Room', "Chef's Table"]

export const reservationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .refine((d) => {
      const t = new Date(`${d}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return t >= today
    }, 'Date must be in the future'),
  time: z.enum(TIMES),
  guests: z.number().int().min(1).max(14),
  area: z.enum(AREAS),
  name: z.string().trim().min(2).max(60).transform(sanitize),
  email,
  occasion: z.string().trim().max(40).transform(sanitize).optional().default(''),
  notes: z.string().max(280, 'Notes must be under 280 characters').transform(sanitize).optional().default(''),
  company: z.string().max(64).optional().default(''), // honeypot
})

/* ---- enquiries ---- */
const KINDS = ['New build', 'Extension', 'Interior', 'Adaptive reuse', 'Something else']
const BUDGETS = ['Under \u20ac500k', '\u20ac500k \u2013 \u20ac1.5m', '\u20ac1.5m \u2013 \u20ac4m', 'Above \u20ac4m', 'Not yet known']
const TIMINGS = ['Within 6 months', '6\u201312 months', '12\u201324 months', 'Exploring']

export const enquirySchema = z.object({
  kind: z.enum(KINDS),
  place: z.string().trim().min(2, 'Tell us where the site is').max(120).transform(sanitize),
  budget: z.enum(BUDGETS),
  timing: z.enum(TIMINGS),
  name: z.string().trim().min(2, 'Please tell us your name').max(60).transform(sanitize),
  email,
  note: z.string().max(2000).transform(sanitize).optional().default(''),
  company: z.string().max(64).optional().default(''), // honeypot
})

/* ---- support inbox ---- */
export const supportSchema = z.object({
  name: z.string().trim().min(2).max(60).transform(sanitize),
  email,
  topic: z.string().trim().max(40).transform(sanitize).optional().default('Other'),
  message: z.string().trim().min(10, 'A few more words — ten characters minimum').max(2000).transform(sanitize),
  company: z.string().max(64).optional().default(''), // honeypot
})

/* =========================== middleware ========================== */

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(422).json({
      error: 'Validation failed',
      issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    })
  }
  req.data = parsed.data
  next()
}

function bearer(req) {
  const h = req.headers.authorization
  return h?.startsWith('Bearer ') ? h.slice(7) : null
}

export function authRequired(req, res, next) {
  const token = req.cookies?.lia_access ?? bearer(req)
  if (!token) return res.status(401).json({ error: 'Authentication required' })
  try {
    const p = verifyAccess(token)
    req.user = { id: p.sub, name: p.name, email: p.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Session expired — please sign in again' })
  }
}

export function authOptional(req, _res, next) {
  const token = req.cookies?.lia_access ?? bearer(req)
  if (token) {
    try {
      const p = verifyAccess(token)
      req.user = { id: p.sub, name: p.name, email: p.email }
    } catch {
      /* anonymous */
    }
  }
  next()
}

export const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email })

export function notFound(_req, res) {
  res.status(404).json({ error: 'Not found' })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500
  if (status >= 500 && !config.isProd) console.error(err)
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message })
}
