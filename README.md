# Zone Data Admin Dashboard

A Vercel-ready Next.js/React admin dashboard for the existing Zone Data Supabase database.

## Important security notes

- The Supabase **service-role key is server-only**. Never prefix it with `NEXT_PUBLIC_`.
- Never commit `.env` or `.env.local`.
- The browser talks to Next.js API routes; the API routes talk to Supabase.
- The existing agent RLS policies are not disabled or modified by this project.
- Admin sessions are stored in the existing `public.admin_sessions` table.
- Admin credentials are supplied through Vercel environment variables; they are not hard-coded into the app.

## Existing database expected

This dashboard expects the existing tables:

- `admin_sessions`
- `agents`
- `packages`
- `transactions`
- `vouchers`

It also expects the existing `admin_sessions` columns:

- `id`
- `session_token_hash`
- `created_at`
- `expires_at`
- `revoked_at`

No database migration is required for the initial dashboard.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the Supabase URL and service-role key.
3. Set a strong `ADMIN_PASSWORD`.
4. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## GitHub + Vercel

Push the project to GitHub, import the repository into Vercel, and add the same environment variables in:

Vercel → Project → Settings → Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Optional:
- `ADMIN_SESSION_HOURS`

Then deploy.

## Current scope

The initial version provides:

- Admin login/logout
- Dashboard metrics
- Agent list/search
- Transaction list/search/status filter
- Package list
- Voucher list/search/status filter
- Secure server-side Supabase access

It deliberately does not add write/delete operations yet. Those should be added only after confirming the exact admin workflows and approval rules.
