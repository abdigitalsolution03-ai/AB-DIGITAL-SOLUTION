# Security Audit & Hardening Report — AB Digital Solution

Status: **Implemented** · Date: 2026-07-31 · Scope: frontend (Vite/React SPA) + new serverless API layer (Vercel Functions)

## Executive summary

The application was previously **100% client-side**: authentication was mocked in
`localStorage` (plaintext passwords, hardcoded bootstrap credentials, forgeable session
tokens) and contact forms stored leads in browser storage. All of that has been replaced by
a server-side, rate-limited, JWT-based auth system with optional TOTP 2FA, RBAC, a security
audit log, and sanitized API endpoints. All frontend features and UI are preserved.

---

## 1. What was found (pre-hardening)

| # | Finding | Severity | Resolution |
|---|---------|----------|-----------|
| 1 | Passwords stored in plaintext in `localStorage` (`ab_users`), including a hardcoded `admin@abdigitalsolution.com` / `Admin@123456` bootstrap account seeded in client code | Critical | Removed. Passwords are now bcrypt-hashed (cost 12) server-side only. No credentials exist in client code. |
| 2 | "Authentication" was a random 64-hex token in `localStorage` (`ab_crm_session`) with no verification — anyone could write it via DevTools and access `/admin` | Critical | Replaced with HS256 JWTs (15 min access) + rotating refresh tokens (30 d), verified server-side; `ProtectedRoute` validates via `/api/auth/me` |
| 3 | No rate limiting or brute-force protection on login | High | Login IP rate limit (10/min) + per-account lockout after 5 failed attempts (15 min) |
| 4 | No 2FA | High | TOTP (RFC 6238) two-factor auth, optional per admin, with QR setup in the Security dashboard |
| 5 | Contact form posted leads only to `localStorage` (per-browser, deletable, forgeable) | High | Now posted to rate-limited `/api/contact` (3/10 min per IP), validated (zod + email/phone regex), HTML-sanitized, stored server-side |
| 6 | No audit trail of admin actions | High | Every auth event and admin action is written to an audit log (Redis list, capped 2000) and viewable/exportable in `/admin/security` |
| 7 | No CSP / HSTS / COOP headers; default Vercel headers only | Medium | Full CSP (script-src 'self', object-src 'none', frame-ancestors 'none', …), HSTS (2 years), Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy added in `vercel.json` |
| 8 | Vulnerable dependencies: `react-router-dom` ≤7.17 (open redirect CVE-2025-68470), `vite` ≤6.4.2 / `esbuild` ≤0.24.2 (dev-server advisory), eslint 8 chain (brace-expansion DoS) | Medium | Upgraded to `react-router-dom` 7.18.2, `vite` 8.2.0 (rolldown, `minify: oxc`), eslint 10 + flat config. Remaining advisories: see §7 |
| 9 | Dead Next.js artifacts (`src/app/*`, `next.config.ts`, `.next/`, eslint-config-next config) left over from an earlier framework switch | Low | Removed |
| 10 | Runtime bugs: `/services/:slug` crashed (undefined `loadService`), all admin delete dialogs never opened (ConfirmDialog `open`/`onCancel` vs `isOpen`/`onClose` mismatch), AdminManager TDZ error | High | Fixed (see §6) |

---

## 2. Architecture (new)

```
Browser SPA (Vite, static)
   │  fetch('/api/...') — same origin, JSON
   ▼
Vercel Functions (Node)          api/   (4 functions — within Hobby's 12 limit)
   ├─ _lib/config.ts      env validation (zod); fail-fast in production
   ├─ _lib/redis.ts       Upstash Redis client; in-memory fallback for local dev
   ├─ _lib/crypto.ts      bcryptjs (cost 12), crypto random
   ├─ _lib/jwt.ts         jose HS256; access / refresh / pending-2FA tokens
   ├─ _lib/totp.ts        TOTP RFC 6238 (SHA-1, 30 s, 6 digits, ±1 window)
   ├─ _lib/ratelimit.ts   sliding-window Redis counters + account lockout
   ├─ _lib/audit.ts       append-only audit log (capped)
   ├─ _lib/auth.ts        Bearer auth guard + session revocation
   ├─ _lib/store.ts       users + enquiries persistence
   ├─ auth.ts             single handler: /api/auth/bootstrap, login, verify-2fa,
   │                      refresh, logout, me, change-password, totp (path-routed)
   ├─ admin.ts            single handler: /api/admin/users (CRUD, super_admin),
   │                      /api/admin/audit (super_admin),
   │                      /api/admin/enquiries (admin+) (path-routed)
   ├─ contact.ts          public, rate-limited, sanitized
   └─ health.ts
   (vercel.json rewrites /api/auth/* -> /api/auth and /api/admin/* -> /api/admin;
    endpoint URLs are unchanged for the frontend)
```

## 3. Auth model

- **Access token**: JWT HS256, 15 min TTL, contains `sub`, `role`, `jti` (session id).
- **Refresh token**: JWT, 30 d TTL, **rotated on every use**; each `jti` is single-use —
  reuse of an old refresh token revokes the whole session chain (replay detection).
- **Sessions**: refresh session ids stored in Redis with expiry; revocable (logout,
  password change revokes all sessions).
- **Tokens in the browser**: access token kept in memory; refresh token in
  `localStorage` (`ab_crm_refresh`). Trade-off documented: on XSS compromise an attacker
  could steal the refresh token; mitigated by CSP (no inline/unsafe-eval scripts), short
  access TTL, and idle logout.
- **Idle logout**: 15 minutes of inactivity ends the session.
- **2FA**: TOTP secrets generated per user (20 random bytes, base32), QR + `otpauth://`
  URI in Security dashboard, 6-digit codes, ±1 step window, verified at login before any
  token is issued.

## 4. API security controls

- All inputs validated with **zod** schemas; email/phone regex; HTML-encoded on output.
- **Rate limits** (per IP, Redis): login 10/min, contact 3/10 min, general API 120/min.
- **Lockout**: 5 failed logins → 15 min account lock (audit-logged, `423` with retry time).
- **RBAC**: `super_admin` only — user management, audit log; `admin` — content/enquiries.
  Guards enforced server-side on every request; last super admin cannot be demoted,
  deactivated, or deleted; admins cannot delete themselves.
- **No secrets in client code**; all secrets via env vars (`JWT_SECRET`, `KV_REST_API_URL`,
  `KV_REST_API_TOKEN`, `ALLOWED_ORIGINS`, `APP_URL`), validated at boot with zod; missing
  secrets fail fast in production.
- **CORS**: allowlist via `ALLOWED_ORIGINS`; same-origin by default; preflight handled.
- Response headers on every API response: `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cache-Control: no-store`.
- Serverless hardening: no filesystem state, no dynamic eval, immutable Redis state,
  audit events flushed on every write; failed-login/2FA events IP-tracked.

## 5. Bootstrap flow (first run)

1. Visit `/admin/login` → `GET /api/auth/bootstrap` → `{ needsBootstrap }`.
2. If no admin exists, the login page shows a **Create Admin Account** form
   (name/email/password ≥ 8 chars). The endpoint is only open when the user table is empty
   (409 otherwise), so the bootstrap door closes permanently after the first account.
3. After creation, standard login (with optional 2FA) applies.

## 6. Bugs fixed along the way

- `ServiceDetail.tsx`: `loadService()` never existed (crash on every `/services/:slug`
  page) — implemented CMS-first merge with hardcoded fallback; also fixed null-deref in the
  error branch and an undefined `data` variable.
- `ConfirmDialog` used `isOpen`/`onClose` while every caller passed `open`/`onCancel` —
  **all admin delete confirmations were silently broken**; component now accepts both.
- `AdminManager.tsx` TDZ (useEffect called `loadItems` before its declaration).
- `api/_lib/store.ts` public user serializer initially returned password hashes — now
  stripped (`passwordHash`, `totpSecret` never leave the server).
- `Dashboard.tsx` imported a non-existent `getSession` from `cms`.

## 7. Dependency posture (`npm audit`)

- **Clean after upgrade** for runtime packages: react-router-dom 7.18.2 (CVE-2025-68470
  open redirect fixed), vite 8.2.0 (esbuild dev-server advisory gone; rolldown based).
- **Accepted & documented**:
  - `react-router` GHSA-qwww-vcr4-c8h2 (RSC-mode CSRF): affects only RSC/server-action
    apps — this is a client-side SPA using `BrowserRouter`, no RSC. The only "fix" is a
    downgrade that reintroduces the open-redirect CVE; deliberately not applied.
  - eslint-toolchain advisories (brace-expansion DoS via minimatch): dev-time tooling only,
    never shipped; `eslint 10` + flat config already reduce the attack surface.
- Verify with `npm audit`; re-run after each dependency bump.

## 8. Remaining known limitations (documented, not exploitable-by-default)

1. **CMS content is still browser-localStorage** (`cms_db`): admin edits are per-browser
   and not shared between visitors. Kept by design (this project has no DB service yet).
   The new Redis layer is ready to back a server CMS when required.
2. **Refresh token in localStorage** — acceptable given CSP + short access TTL; moving to
   HttpOnly cookies would require a same-site cookie CORS setup.
3. **Audit log retention**: capped at 2000 entries in Redis; export CSV from the Security
   dashboard for archival.
4. **Admin-supplied HTML** (CMS content/Page Editor) is rendered as-is — trusted-admin
   input only; consider sanitizing with DOMPurify if untrusted editors are added.
5. **`X-XSS-Protection`** header removed (obsolete in modern browsers, and CSP supersedes it).
6. Enquiries are stored in Redis (no email notifications yet).

## 9. Production checklist

- [x] Set `JWT_SECRET` (≥32 random bytes: `openssl rand -hex 32`) in Vercel env
- [x] Create an Upstash Redis DB; set `KV_REST_API_URL` + `KV_REST_API_TOKEN` in Vercel env
- [x] Set `APP_URL` and `ALLOWED_ORIGINS` (comma-separated; `https://your-domain.vercel.app`)
- [x] After deploy: visit `/admin/login`, create the first admin, log in
- [x] Immediately enable 2FA in **Security → Two-Factor Auth** and change the default password
- [x] Confirm `/api/health` returns 200 and the site loads with headers: run
  `curl -sI https://<domain> | grep -iE "content-security|strict-transport|x-frame"`

## 10. How to verify locally

```bash
npm install
# copy .env.example to .env, fill values (in-memory store works without Redis for dev)
npm run dev        # http://localhost:3000
# API smoke test (in-memory): run the flow against http://localhost:3000/api/*
```

Production requires the Upstash env vars; without them, functions fail fast (`NODE_ENV=production`).
