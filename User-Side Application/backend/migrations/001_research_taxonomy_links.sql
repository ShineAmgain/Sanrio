-- Run this in the Supabase SQL editor if these tables/columns don't exist
-- yet. The backend routes were rewritten to *try* these joins and fall back
-- gracefully if they're missing (you'll see a console.warn, and cards will
-- just be missing the department/area tag) — so nothing breaks either way,
-- but this is what turns those fields on for real.

-- Departments as a proper lookup table (Researchers "Filter" dropdown reads
-- department NAME; researchers.department_id should point here).
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- Many-to-many: a researcher can belong to more than one research area.
create table if not exists researcher_research_areas (
  researcher_id uuid references researchers(id) on delete cascade,
  research_area_id uuid references research_areas(id) on delete cascade,
  primary key (researcher_id, research_area_id)
);

-- Many-to-many: a project can be tagged with more than one research area.
create table if not exists project_research_areas (
  project_id uuid references projects(id) on delete cascade,
  research_area_id uuid references research_areas(id) on delete cascade,
  primary key (project_id, research_area_id)
);

-- Optional profile fields used on the researcher detail page's header.
alter table researchers add column if not exists address text;
alter table researchers add column if not exists linkedin_url text;

-- researcher_projects.role is expected to hold values like 'Lead' / 'Mentor'
-- / 'Researcher' — the projects list/detail routes look for role ILIKE
-- '%mentor%' to populate the "Mentor:" line on project cards.
