# ARKHE API — client portal, enquiries & support

Hardened Express backend for the ARKHE studio site: cookie-based client
sessions with rotating refresh tokens, bcrypt password hashing, brute-force
lockouts, strict validation and rate limiting.

## Quick start

```bash
cd server
npm install
cp .env.example .env   # or export the variables below
npm run dev            # http://localhost:4000
```

Data is persisted to a local `data.json` with atomic writes so the API runs
anywhere with zero setup. Swap `src/lib.js → store` for Postgres/Prisma in
production — the route code does not change.

## Environment

| Variable             | Default                 | Notes                           |
| -------------------- | ----------------------- | ------------------------------- |
| `PORT`               | `4000`                  |                                 |
| `CLIENT_ORIGIN`      | `http://localhost:5173` | Comma-separated allowlist       |
| `JWT_ACCESS_SECRET`  | — (dev fallback)        | **Required in prod**, 32+ chars |
| `JWT_REFRESH_SECRET` | — (dev fallback)        | **Required in prod**, 32+ chars |
| `DATA_FILE`          | `./data.json`           |                                 |

Generate secrets: `openssl rand -hex 32`

## Endpoints

| Method | Path                    | Auth     | Description                                          |
| ------ | ----------------------- | -------- | ---------------------------------------------------- |
| POST   | `/api/auth/register`    | —        | Create client access (20 req/15 min throttle)        |
| POST   | `/api/auth/login`       | —        | Sign in; locks 15 min after 5 failures               |
| POST   | `/api/auth/refresh`     | cookie   | Rotate refresh token (reuse = revoked)               |
| POST   | `/api/auth/logout`      | —        | Revoke refresh token, clear cookies                  |
| GET    | `/api/auth/me`          | client   | Current signed-in client                             |
| POST   | `/api/enquiries`        | optional | Project brief from the contact page (honeypot)       |
| GET    | `/api/enquiries/mine`   | client   | A client's own enquiries                             |
| POST   | `/api/support`          | optional | Message the studio                                   |
| GET    | `/api/health`           | —        | Liveness probe                                       |

Enquiry fields are validated against fixed enums (`kind`, `budget`, `timing`)
and every free-text field is length-capped and sanitised before storage.

## Security checklist (implemented)

- **bcrypt (12 rounds)** password hashing; passwords never logged or returned
- **JWT access (15 min) + rotating refresh (7 d)** in `httpOnly`,
  `SameSite=Strict`, `Secure` (prod) cookies; refresh cookie scoped to `/api/auth`
- **Account lockout** after 5 failed logins, generic 401 messages and a
  dummy-hash comparison for uniform timing (no account enumeration)
- **Rate limiting**: 300/15 min across the API, 20/15 min on credentials
- **Helmet**: CSP, HSTS, `nosniff`, frame guard; `X-Powered-By` disabled
- **Strict CORS** origin allowlist with credentials
- **Zod validation** on every body, field sanitisation, 10 kb body cap
- **Honeypot** anti-spam on enquiries and support messages (fake-200 for bots)
- **Centralised error handler** — no stack traces leak in production

## Wiring the frontend

Set `VITE_API_URL=http://localhost:4000` in the frontend `.env`. Without it the
site runs in a self-contained demo mode (hashed passwords, 12-hour sessions,
lockouts, local enquiry ledger) and upgrades automatically once the URL is set.

## Production hardening (next steps)

- Managed Postgres + migrations; move refresh tokens to Redis with TTL
- Object storage (S3) with signed, short-lived URLs for portal drawings
- Secrets via a manager (Doppler/Vault/KMS); rotate quarterly
- Structured logging (pino) and alerting on 401/429 spikes
- Dependency audits in CI (`npm audit`), Dependabot enabled
