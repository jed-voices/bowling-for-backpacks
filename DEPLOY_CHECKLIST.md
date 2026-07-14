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

Confirmation email delivery (Resend):

- `RESEND_API_KEY` — an API key from https://resend.com
- Optional: `EMAIL_FROM` (default `City Center Events <receipts@okcitycenterevents.org>`), `EMAIL_REPLY_TO` (default `kimberly@okcitycenter.org`)
- The sending domain in `EMAIL_FROM` (okcitycenterevents.org) must be verified in Resend via its DNS records before mail will deliver.

Optional preview keys:

- `BOWLING_ADMIN_PREVIEW_KEY`
- `GALA_ADMIN_PREVIEW_KEY`

Do not use the local fallback development password in production. Use a unique production password.

Current production state:

- `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, Development login, `ADMIN_SECRET`, admin preview keys, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` are all configured. Bowling accepts live registrations and card payments.
- `RESEND_API_KEY` is NOT yet configured. Until it is (and the sending domain is verified in Resend), confirmation emails and PDF receipts are not sent (registration and payments still work; the confirmation page simply does not promise an email).
- The Development dashboard includes a Launch Readiness panel that shows the same status without exposing secret values.

## Confirmation Emails + PDF Receipts

Bowling registrations send a branded confirmation email with a PDF receipt attached:

- Invoice and check registrations: email is sent immediately when the registration is created.
- Card registrations: email is sent from the Stripe webhook once payment succeeds (so the receipt reads "Paid").
- Delivery is best-effort — a mail failure never blocks a registration or payment. Failures are logged.
- The confirmation page also offers an on-demand "Download PDF receipt" link (token-gated via `/api/bowling/receipt/[registrationId]`).
- To enable: verify okcitycenterevents.org in Resend (add its DNS records), create an API key, and set `RESEND_API_KEY` in Vercel.

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

## 6. Registration + Checkout Test Matrix

Run these in preview after Supabase and Stripe environment variables are set:

| Path | Expected result |
| --- | --- |
| Team registration + card | Creates a team registration, opens Stripe Checkout, returns to confirmation, and marks paid after webhook. |
| Team registration + invoice | Creates a registration, skips Stripe, shows invoice follow-up language, and appears in admin follow-up. |
| Team registration + check | Creates a registration, skips Stripe, shows check pledge language, and appears in admin follow-up. |
| Lane sponsor + card | Creates a lane sponsor record, includes recognition name, and can be exported. |
| Event sponsorship + card | Creates the selected sponsorship, includes organization/recognition details, and can be exported. |
| Gift-only + card | Creates an additional gift transaction without requiring team or bowler details. |
| Full-session attempt | Shows waitlist/full-session language instead of overselling lanes. |

Confirmation pages should clearly show:

- The short registration code.
- The payment preference and status.
- The next step for invoice or check follow-up.
- The team management link when a team registration was created.
- Kimberly Winston as the point of contact: `kimberly@okcitycenter.org`.

## 7. Admin + Export Workflow

Before launch, confirm staff can:

- Search registrations by name, organization, email, registration code, or payment status.
- See team count, session capacity, lanes remaining, invoice requests, check pledges, and sponsor logo status.
- Mark invoice/check records paid when payment arrives.
- Mark records exported after Bloomerang or operations download.
- Download Bloomerang Transactions CSV and operations CSV.
- Identify records needing follow-up without opening the database.

## 8. Visual QA

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

## 9. Launch

- Commit the current branch.
- Push to GitHub.
- Deploy a Vercel preview from the branch.
- Set production environment variables in Vercel.
- Promote the validated preview to production.
- Connect `okcitycenterevents.org`.

## 10. First-Day Watch

- Send the link to a small trusted group.
- Test one full registration path.
- Confirm exports download.
- Watch for friction and fix it quickly.
