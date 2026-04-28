# City Center Events

Event gateway for City Center supporters, sponsors, families, and the Development team.

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Key Routes

- `/` - event gateway
- `/supporters` - supporter event entry
- `/bowling-for-backpacks` - Christmas in July | Bowling for Backpacks
- `/gala` - Stories From the Center Gala
- `/development` - Development dashboard
- `/admin/bowling-for-backpacks` - Bowling admin/export console
- `/admin/gala` - Gala admin/export console

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npx playwright test tests/site-visual-audit.spec.ts --project=chromium --reporter=line
```

## Environment

Copy `.env.example` to `.env.local` for local secrets.

Production variables are listed in `DEPLOY_CHECKLIST.md`.
