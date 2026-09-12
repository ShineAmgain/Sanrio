# R&D Digital Hub — Admin Dashboard (Prototype)

Admin dashboard prototype for the Islington College R&D Digital Hub challenge brief.
Built with React + TypeScript + Vite + Tailwind CSS v4 + React Router, matching the
provided admin design (navy sidebar, card-based dashboard, Manage Records tables).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's included

- **Dashboard** — live stat counts, a real "Needs attention" panel (detects
  duplicate project IDs, invalid date ranges, incomplete event info, opportunities
  closing soon, missing DOIs, stale ongoing projects), recent activity feed, and a
  Manage Records table for researchers.
- **Researchers / Projects / Publications / Events / Opportunities** — each a full
  admin page: search, dropdown filters, add/edit modal forms, delete confirmation,
  empty states, and status badges.
- All data lives in `src/context/DataContext.tsx` (in-memory, resets on reload) —
  swap this out for real API calls when you're ready to connect a backend.
- All records in `src/data/mockData.ts` are clearly-labelled demo data, per the
  brief's Content Fidelity section — not genuine Islington College records.

## Project structure

```
src/
  components/       shared UI (Sidebar, Table, Modal, FilterBar, Badge, forms/...)
  context/           DataContext — in-memory CRUD state for every entity
  data/              mock/demo dataset
  lib/               attention-panel detection logic + date formatting
  pages/             one page per admin section
  types/             shared TypeScript interfaces
```
