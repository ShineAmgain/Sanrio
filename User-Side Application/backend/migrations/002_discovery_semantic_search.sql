-- Extends the discovery/search RPC to cover the 3 content types the brief
-- requires (section 7: "Research Areas • Researchers • Projects •
-- Publications • Events • Opportunities") that were missing from
-- semantic_search: research_areas, resources, and the separate
-- opportunities table (grants was already covered).
--
-- STEP 0 — run this first and confirm the number matches what comes back,
-- then fix the `vector(384)` below if it doesn't:
--
--   select a.attname, format_type(a.atttypid, a.atttypmod) as type
--   from pg_attribute a
--   where a.attrelid = 'public.researchers'::regclass
--     and a.attname = 'embedding';
--
-- (all-MiniLM-L6-v2, the model semantic-service/app.py uses, is 384-dim,
-- so vector(384) is very likely already correct.)

alter table public.research_areas add column if not exists embedding vector(384);
alter table public.resources      add column if not exists embedding vector(384);
alter table public.opportunities  add column if not exists embedding vector(384);

-- STEP 1 — after running generateEmbeddings.js's new
-- embedResearchAreas() / embedResources() / embedOpportunities() so those
-- columns aren't all null, replace the function. Adjust the parameter
-- names/types below if your actual signature differs from what
-- server.js / projects.js / publications.js call it with
-- (query_embedding, match_threshold, match_count).

create or replace function public.semantic_search(
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  result_type text,
  result_id uuid,
  title text,
  description text,
  similarity float
)
language sql
stable
as $$
    -- Researchers
    select
        'researcher'::text as result_type,
        r.id as result_id,
        r.name as title,
        coalesce(r.bio, '') as description,
        1 - (r.embedding <=> query_embedding) as similarity
    from public.researchers r
    where r.embedding is not null
      and 1 - (r.embedding <=> query_embedding) >= match_threshold

    union all

    -- Projects
    select
        'project'::text as result_type,
        p.id as result_id,
        p.title as title,
        coalesce(p.description, '') as description,
        1 - (p.embedding <=> query_embedding) as similarity
    from public.projects p
    where p.embedding is not null
      and 1 - (p.embedding <=> query_embedding) >= match_threshold

    union all

    -- Publications
    select
        'publication'::text as result_type,
        pub.id as result_id,
        pub.title as title,
        coalesce(pub.abstract, pub.summary, '') as description,
        1 - (pub.embedding <=> query_embedding) as similarity
    from public.publications pub
    where pub.embedding is not null
      and 1 - (pub.embedding <=> query_embedding) >= match_threshold

    union all

    -- Events
    select
        'event'::text as result_type,
        e.id as result_id,
        e.title as title,
        coalesce(e.description, '') as description,
        1 - (e.embedding <=> query_embedding) as similarity
    from public.events e
    where e.embedding is not null
      and 1 - (e.embedding <=> query_embedding) >= match_threshold

    union all

    -- Grants
    select
        'grant'::text as result_type,
        g.id as result_id,
        g.title as title,
        coalesce(g.description, '') as description,
        1 - (g.embedding <=> query_embedding) as similarity
    from public.grants g
    where g.embedding is not null
      and 1 - (g.embedding <=> query_embedding) >= match_threshold

    union all

    -- Opportunities (distinct table from Grants — brief section 4)
    select
        'opportunity'::text as result_type,
        o.id as result_id,
        o.title as title,
        coalesce(o.description, '') as description,
        1 - (o.embedding <=> query_embedding) as similarity
    from public.opportunities o
    where o.embedding is not null
      and 1 - (o.embedding <=> query_embedding) >= match_threshold

    union all

    -- Research Areas (taxonomy tags surfaced directly in discovery)
    select
        'research_area'::text as result_type,
        ra.id as result_id,
        ra.name as title,
        coalesce(ra.description, '') as description,
        1 - (ra.embedding <=> query_embedding) as similarity
    from public.research_areas ra
    where ra.embedding is not null
      and 1 - (ra.embedding <=> query_embedding) >= match_threshold

    union all

    -- Resources (Research Support & Resources — brief section 4)
    select
        'resource'::text as result_type,
        res.id as result_id,
        res.title as title,
        coalesce(res.description, '') as description,
        1 - (res.embedding <=> query_embedding) as similarity
    from public.resources res
    where res.embedding is not null
      and 1 - (res.embedding <=> query_embedding) >= match_threshold

    order by similarity desc
    limit match_count
$$;
