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

## Google Calendar in Meetings
The Meetings page can show an embedded Google Calendar and link each meeting to its Google Calendar event.

1. Run the migration in `backend/migrations/2026-09-13_add_calendar_link_to_meetings.sql` against your Supabase database (SQL editor or CLI). It adds a nullable `calendar_link` column to `project_meetings`.
2. In Google Calendar, open the calendar you want to embed → Settings → "Access permissions" → make it public (or at least "See all event details"), then copy its **Calendar ID** from "Integrate calendar".
3. Set `VITE_GOOGLE_CALENDAR_ID` in `frontendd/.env` to that Calendar ID.
4. Open the Meetings page and click "📅 Show Google Calendar" to view it, or open a meeting and paste that meeting's Google Calendar event link into the new "Google Calendar link" field — this shows an "Open event ↗" shortcut and jumps the embedded calendar to that meeting's week.

Note: Google does not allow embedding an individual private event directly (it blocks framing on the event page), so the embed shows the shared calendar itself rather than a single event. The saved "Google Calendar link" is used for the quick "Open event" shortcut, which opens the real event in a new tab.

## Important backend limitation
The uploaded backend currently has CRUD routes for researchers, projects, publications, events and grants only. The database schema also contains opportunities, research areas, research groups, resources, announcements, partners, statistics, etc., but there are no Express routes for those resources in the uploaded backend. The corresponding frontend navigation is included as a placeholder so those pages can be wired after their API routes exist.
