# Tend

A caregiver certification platform: clinical training programs, scenario-based
assessment, and credentials an employer can verify from a public page.

Built with Laravel 12, Inertia v3, React 19, and Tailwind v4.

## What's in it

The app is three surfaces sharing one design system.

| Surface | Who it's for | What it does |
| --- | --- | --- |
| Public site | Caregivers and employers | Program catalogue, how certification works, public certificate verification |
| Learner portal | Enrolled caregivers | Enrol, work through lessons, take assessments, download certificates, view a transcript |
| Admin console | Program administrators | Course/module/lesson CMS, assessment authoring, caregiver roster, issued certificates, audit log |

## Requirements

- PHP 8.5
- Composer
- Node 20+
- SQLite (default; the app runs on MySQL or Postgres too)

## Setup

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate --seed

composer run dev
```

`composer run dev` runs the PHP server, queue worker, and Vite together.
If you use [Laravel Herd](https://herd.laravel.com), the site is served at
`https://caregiver.test` and you only need `npm run dev`.

## Demo accounts

Seeded by `php artisan migrate --seed`. Both use the password `password`.

| Role | Email |
| --- | --- |
| Caregiver | `caregiver@caregiver.test` |
| Administrator | `admin@caregiver.test` |

The sign-in page has one-click buttons that fill these in.

## Design system

Visual rules live in `resources/css/app.css` as semantic CSS custom properties,
exposed to Tailwind through `@theme inline`. Pages use tokens
(`bg-surface`, `text-ink-muted`, `border-line`, `rounded-card`) rather than
picking palette shades directly, so light and dark mode both work without a
`dark:` variant on every utility.

The rules the system enforces:

- **One accent.** A single teal, defined once. No second accent, no gradients.
- **One radius scale.** Controls 8px, cards 12px, panels 16px. Pills are for badges only.
- **A 15px body floor.** The audience skews older and reads on phones between visits.
- **Visible focus everywhere**, from one `:focus-visible` rule.
- **Motion is restrained** and collapses under `prefers-reduced-motion`.

Shared primitives are in `resources/js/components/ui.tsx` (`Button`, `Card`,
`Field`, `Badge`, `Stat`, `Progress`, `EmptyState`, `Pagination`, and friends).
Form-field groups shared between create and edit screens live in
`resources/js/components/admin/`.

## Project layout

```
app/Http/Controllers/     Guest, Auth, Caregiver, and Admin controllers
resources/css/app.css     Design tokens and component classes
resources/js/components/  Shared UI primitives
resources/js/layouts/     Guest, Auth, Caregiver, and Admin shells
resources/js/pages/       Inertia pages, mirroring the route tree
routes/web.php            All routes
tests/Feature/            Pest feature tests
```

## Checks

```bash
php artisan test --compact   # Pest
npm run types:check          # tsc --noEmit
npm run lint:check           # eslint
vendor/bin/pint              # PHP formatting
```

## Notes

Course thumbnails and advisory-board portraits fall back to placeholder image
services when a record has no image set. Swap those for real assets before
using this anywhere real.
