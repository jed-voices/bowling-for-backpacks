# Bowling for Backpacks — Deployment Checklist

## 1. Environment Variables (Vercel)

Set these before deploying:

- ADMIN_SECRET=legacy (or replace with secure value)
- NEXT_PUBLIC_SITE_URL=https://yourdomain.com
- SUPABASE_URL=...
- SUPABASE_SERVICE_ROLE_KEY=...
- STRIPE_SECRET_KEY=...

## 2. Verify Core Routes

- / → Splash page loads
- /bowling-for-backpacks → Full event page
- /bowling-for-backpacks/admin/login → Admin login
- /bowling-for-backpacks/admin → Dashboard (after login)

## 3. Test Critical Flows

- Register a team
- Test card checkout (Stripe)
- Test invoice + check flows
- Confirm confirmation page loads

## 4. Admin Dashboard

- Login works
- Mark Paid updates correctly
- Mark Exported updates correctly
- Email + Team link buttons function

## 5. Visual QA

- Splash page mobile view
- Photo rotation working
- Sponsor strip rendering clean

## 6. Pre-Launch Content

- Replace placeholder sponsor names with real logos
- Add at least 1 real sponsor if available

## 7. Launch

- Deploy on Vercel
- Connect domain
- Share link with team

## 8. Post-Launch (Day 1)

- Send to 5–10 trusted people
- Watch behavior (not opinions)
- Fix friction immediately

---

## Guiding Principle

This site is complete.
Focus now on usage, follow-up, and momentum.
