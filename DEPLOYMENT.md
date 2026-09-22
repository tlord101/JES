# Production Deployment Checklist — Jasmine Exclusive School

Status: **build passes** (`next build` EXIT 0, tsc clean). The items below gate a real production launch.

## 1. Environment variables (hosting provider)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — production project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — production anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — production service key (server only, never in client bundles)
- [ ] `NEXT_PUBLIC_SITE_URL` — **real domain** (defaults to localhost; auth email links break otherwise)
- [ ] Optional: `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` if enabling online payments
- Verify email templates in Supabase Auth use the production domain for verification/reset links.

## 2. Supabase / database
- [ ] Run all migrations in `supabase/migrations/` against the production project (in filename order)
- [ ] Run `npm run seed:admin`, then **immediately change the seeded admin password** from /profile
- [ ] Confirm RLS is enabled on every table (`select tablename, rowsecurity from pg_tables where schemaname='public';`)
- [ ] Run `npm run check:rls` with two low-privilege test accounts — must report 0 leaks
- [ ] Confirm automatic backups (PITR) are enabled on the Supabase plan
- [ ] Set password policy + email rate limits in Supabase Auth settings

## 3. Application hardening
- [ ] Rate limiting: confirm the limiter is backed by a shared store (Postgres/Upstash), not in-memory, if deploying serverless/multi-instance
- [ ] Review audit logging coverage for grade changes, payments, and user administration
- [ ] Confirm fees/payments are admin-entered records only, or wire a payment provider + webhook reconciliation before going live with real money

## 4. Testing
- [ ] No automated test suite yet — before launch at minimum smoke-test manually:
  - sign in on each portal (`/login/admin`, `/login/staff`, `/login/parent`, `/login/student`)
  - parent sees only their linked children (results, fees, attendance, messages)
  - student sees only their own results/timetable/attendance
  - staff attendance + results entry round-trip into parent/student views
- [ ] Add browser-console probe: as a parent, try direct client queries against other students' IDs (the script in `scripts/rls-check.mjs` automates the common cases)

## 5. Operations
- [ ] Error monitoring (e.g. Sentry) wired to the Next.js app
- [ ] Uptime monitoring on `/login`
- [ ] `npm audit` clean / Dependabot enabled
- [ ] Custom domain + HTTPS enforced; `NEXT_PUBLIC_SITE_URL` matches it
- [ ] Document the on-call runbook: restore-from-backup drill, Supabase support plan

## Re-verify after every deploy
```bash
node node_modules/typescript/bin/tsc --noEmit   # types
node node_modules/next/dist/bin/next build      # build
npm run check:rls                               # RLS probe (needs test accounts)
```
