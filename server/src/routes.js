/* ------------------------------------------------------------------ */
/*  LIA API — routes                                                    */
/*  /api/auth       register · login · refresh · logout · me            */
/*  /api/enquiries  create · mine                                       */
/*  /api/support    message the studio                                  */
/* ------------------------------------------------------------------ */
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import {
  authOptional,
  authRequired,
  clearAuthCookies,
  config,
  enquirySchema,
  loginSchema,
  newJti,
  publicUser,
  registerSchema,
  setAuthCookies,
  signAccess,
  signRefresh,
  store,
  supportSchema,
  validate,
  verifyRefresh,
} from './lib.js'

/* Timing-uniform comparison target when an account doesn't exist */
const DUMMY_HASH = bcrypt.hashSync('placeholder-password', 12)

const issueSession = (res, user) => {
  const jti = newJti()
  const access = signAccess(user)
  const refresh = signRefresh(user.id, jti)
  store.refresh.put({
    jti,
    userId: user.id,
    exp: Date.now() + config.refreshTtlSec * 1000,
    revoked: false,
  })
  setAuthCookies(res, { access, refresh })
}

/* ============================ /api/auth ========================== */

export const authRouter = Router()

/* POST /api/auth/register */
authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.data
  if (store.users.byEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }
  const hash = await bcrypt.hash(password, 12)
  const user = store.users.insert({
    id: newJti(),
    name,
    email,
    hash,
    failedCount: 0,
    lockUntil: 0,
    createdAt: Date.now(),
  })
  issueSession(res, user)
  res.status(201).json({ user: publicUser(user) })
})

/* POST /api/auth/login — generic errors, lockout after N failures */
authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.data
  const user = store.users.byEmail(email)

  if (user?.lockUntil && user.lockUntil > Date.now()) {
    res.set('Retry-After', String(Math.ceil((user.lockUntil - Date.now()) / 1000)))
    return res
      .status(429)
      .json({ error: 'Too many failed attempts. Please wait before trying again.' })
  }

  const ok = await bcrypt.compare(password, user?.hash ?? DUMMY_HASH)
  if (!user || !ok) {
    if (user) {
      const failedCount = (user.failedCount ?? 0) + 1
      store.users.update(email, {
        failedCount: failedCount >= config.lockAfter ? 0 : failedCount,
        lockUntil: failedCount >= config.lockAfter ? Date.now() + config.lockMinutes * 60_000 : 0,
      })
    }
    // generic message on purpose — never reveal whether the account exists
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  store.users.update(email, { failedCount: 0, lockUntil: 0 })
  issueSession(res, user)
  res.json({ user: publicUser(user) })
})

/* POST /api/auth/refresh — rotating refresh tokens (reuse = revoked) */
authRouter.post('/refresh', (req, res) => {
  const token = req.cookies?.lia_refresh
  if (!token) return res.status(401).json({ error: 'No refresh token' })

  let payload
  try {
    payload = verifyRefresh(token)
  } catch {
    clearAuthCookies(res)
    return res.status(401).json({ error: 'Session expired — please sign in again' })
  }

  const record = store.refresh.get(payload.jti)
  if (!record || record.revoked || record.exp < Date.now()) {
    if (record) store.refresh.revoke(payload.jti)
    clearAuthCookies(res)
    return res.status(401).json({ error: 'Session expired — please sign in again' })
  }

  const account = store.users.byId(payload.sub)
  if (!account) {
    clearAuthCookies(res)
    return res.status(401).json({ error: 'Account not found' })
  }

  store.refresh.revoke(payload.jti) // rotate: the old refresh token dies here
  issueSession(res, account)
  res.json({ user: publicUser(account) })
})

/* POST /api/auth/logout */
authRouter.post('/logout', (req, res) => {
  const token = req.cookies?.lia_refresh
  if (token) {
    try {
      store.refresh.revoke(verifyRefresh(token).jti)
    } catch {
      /* already invalid — nothing to revoke */
    }
  }
  clearAuthCookies(res)
  res.json({ ok: true })
})

/* GET /api/auth/me */
authRouter.get('/me', authRequired, (req, res) => {
  res.json({ user: req.user })
})

/* ========================= /api/enquiries ======================== */

export const enquiryRouter = Router()

/* POST /api/enquiries — a project brief from the contact page */
enquiryRouter.post('/', authOptional, validate(enquirySchema), (req, res) => {
  const { company, ...fields } = req.data

  // honeypot: bots see success, nothing is stored
  if (company && company.length > 0) return res.status(200).json({ ok: true })

  const enquiry = store.enquiries.insert({
    id: `ARK-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: req.user?.id ?? null,
    ...fields,
    status: 'new', // new -> reading -> replied -> archived
    createdAt: Date.now(),
  })

  res.status(201).json({ enquiry: { id: enquiry.id, status: enquiry.status } })
})

/* GET /api/enquiries/mine — a client's own enquiries */
enquiryRouter.get('/mine', authRequired, (req, res) => {
  const mine = store.enquiries
    .forUser(req.user.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((e) => ({
      id: e.id,
      kind: e.kind,
      place: e.place,
      status: e.status,
      createdAt: e.createdAt,
    }))
  res.json({ enquiries: mine })
})

/* =========================== /api/support ======================== */

export const supportRouter = Router()

/* POST /api/support — contact the lab */
supportRouter.post('/', authOptional, validate(supportSchema), (req, res) => {
  const { company, ...fields } = req.data

  // honeypot: bots see success, nothing is stored
  if (company && company.length > 0) return res.status(200).json({ ok: true })

  const message = store.messages.insert({
    id: newJti(),
    userId: req.user?.id ?? null,
    ...fields,
    status: 'open',
    createdAt: Date.now(),
  })
  res.status(201).json({ ok: true, id: message.id })
})
