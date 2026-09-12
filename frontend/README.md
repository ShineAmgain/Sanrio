# R&D Digital Hub — Dynamic React Admin Frontend

This frontend is wired to the uploaded Express + Supabase backend.

## Current live API resources
- `/api/researchers`
- `/api/projects`
- `/api/publications`
- `/api/events`
- `/api/grants`

## Setup
1. Keep the backend running on port 5000.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_URL` to the backend API, e.g. `http://localhost:5000/api`.
4. Set `VITE_SUPABASE_URL` and the **Supabase anon/publishable key**.
5. Run `npm install` then `npm run dev`.
6. Sign in with a Supabase Auth account that has a row in `admin_profiles`.

## Security
Do NOT put `SUPABASE_SERVICE_ROLE_KEY` in the frontend. The service-role key must stay in the Express backend.

## Important backend limitation
The uploaded backend currently has CRUD routes for researchers, projects, publications, events and grants only. The database schema also contains opportunities, research areas, research groups, resources, announcements, partners, statistics, etc., but there are no Express routes for those resources in the uploaded backend. The corresponding frontend navigation is included as a placeholder so those pages can be wired after their API routes exist.
