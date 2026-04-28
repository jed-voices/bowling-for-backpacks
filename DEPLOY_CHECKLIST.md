# City Center Events Deployment Checklist

This build is the City Center Events gateway with supporter-facing event pages and a separate Development dashboard.

## 1. Required Production Environment Variables

Set these in Vercel before production launch:

- `NEXT_PUBLIC_SITE_URL=https://okcitycenterevents.org`
- `SITE_URL=https://okcitycenterevents.org`
- `DEVELOPMENT_ADMIN_USERNAME`
- `DEVELOPMENT_ADMIN_PASSWORD`
- `ADMIN_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Optional preview keys:

- `BOWLING_ADMIN_PREVIEW_KEY`
- `GALA_ADMIN_PREVIEW_KEY`

Do not use the local fallback development password in production. Use a unique production password.

Current production state after the first launch:

- `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, Development login, `ADMIN_SECRET`, and admin preview keys are configured.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` still need to be added before Bowling can accept dependable live registrations and payments.
- The Development dashboard includes a Launch Readiness panel that shows the same status without exposing secret values.

## 2. Database Setup

Run the Supabase migration before opening live Bowling registration:

- `supabase/migrations/202604250001_bowling_for_backpacks.sql`

Bowling registrations persist to Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present.

Gala registration is still a prototype response unless a database layer is added for Gala.

## 3. Stripe Setup

Bowling card checkout uses Stripe when `STRIPE_SECRET_KEY` is present.

Set the Bowling webhook endpoint in Stripe:

- `https://okcitycenterevents.org/api/bowling/stripe-webhook`

Then set:

- `STRIPE_WEBHOOK_SECRET`

The Gala checkout route is intentionally deferred for the prototype phase.

Recommended order:

1. Add `STRIPE_SECRET_KEY`.
2. Redeploy production so Checkout can create live sessions.
3. Create the Bowling webhook endpoint in Stripe.
4. Add `STRIPE_WEBHOOK_SECRET`.
5. Redeploy production again so payment status updates are active.

## 4. Routes To Verify

- `/`
- `/supporters`
- `/bowling-for-backpacks`
- `/gala`
- `/development`
- `/admin/bowling-for-backpacks`
- `/admin/gala`

## 5. Critical Flows

- Development login works.
- Bowling team registration creates a record.
- Bowling invoice and check paths show confirmation.
- Bowling card path redirects to Stripe when Stripe is configured.
- Bowling confirmation page loads.
- Bowling team-link page loads.
- Bowling admin exports download.
- Mark Paid and Mark Exported update records.

## 6. Visual QA

Run:

```bash
npm run typecheck
npm run lint
npx playwright test tests/site-visual-audit.spec.ts --project=chromium --reporter=line
```

Confirm:

- No horizontal overflow on mobile, tablet, or desktop.
- Public event pages use the previous City Center event palette.
- Development and admin/export screens use the new operational palette.
- Sponsor and registration CTAs are easy to find.

## 7. Launch

- Commit the current branch.
- Push to GitHub.
- Deploy a Vercel preview from the branch.
- Set production environment variables in Vercel.
- Promote the validated preview to production.
- Connect `okcitycenterevents.org`.

## 8. First-Day Watch

- Send the link to a small trusted group.
- Test one full registration path.
- Confirm exports download.
- Watch for friction and fix it quickly.
