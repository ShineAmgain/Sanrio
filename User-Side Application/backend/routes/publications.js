const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

function shapePublication(row) {
  if (!row) return row;
  const { publication_research_areas, publication_events, ...rest } = row;
  return {
    ...rest,
    research_areas: Array.isArray(publication_research_areas)
      ? publication_research_areas.map((l) => l.research_areas).filter(Boolean)
      : row.research_areas || [],
    events: Array.isArray(publication_events)
      ? publication_events.map((l) => l.events).filter(Boolean)
      : row.events || [],
  };
}

router.get('/', async (req, res) => {
  const enriched = await supabase
    .from('publications')
    .select(`
      id,
      title,
      publication_year,
      summary,
      publication_research_areas (
        research_areas (
          id,
          name
        )
      )
    `)
    .eq('status', 'published');

  if (!enriched.error) {
    return res.json({
      data: (enriched.data || []).map(shapePublication),
    });
  }

  console.warn(
    'publications list: enriched query failed, falling back —',
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('publications')
    .select('id, title, publication_year, summary')
    .eq('status', 'published');

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json({
    data: (data || []).map(shapePublication),
  });
});

// Required cross-linking per the brief: Publication -> Authors, Research
// Area, Project, Conference/Journal (Event).
router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('publications')
    .select(`
      *,
      researcher_publications ( author_order, researchers (*) ),
      project_publications ( relationship, projects (*) ),
      publication_research_areas ( research_areas ( id, name ) ),
      publication_events ( events ( id, title, start_at ) )
    `)
    .eq('id', req.params.id)
    .single();
  if (!enriched.error) {
    return res.json({ data: shapePublication(enriched.data) });
  }

  console.warn(
    `publication ${req.params.id}: enriched query failed, falling back —`,
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('publications')
    .select(`
      *,
      researcher_publications ( author_order, researchers (*) ),
      project_publications ( relationship, projects (*) )
    `)
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: shapePublication(data) });
});

// Similar/related research for a publication detail page: semantically
// similar items via the publication's own embedding, plus other publications
// by the same author(s) — all pulled live from the database.
router.get('/:id/related', async (req, res) => {
  try {
    const { data: publication, error: pubErr } = await supabase
      .from('publications')
      .select('id, embedding, researcher_publications ( researcher_id )')
      .eq('id', req.params.id)
      .single();
    if (pubErr) throw pubErr;

    let similar = [];
    if (publication.embedding) {
      const { data: matches, error: matchErr } = await supabase.rpc(
        'semantic_search',
        {
          query_embedding: publication.embedding,
          match_threshold: 0.15,
          match_count: 8,
        }
      );
      if (matchErr) {
        console.warn('related publications: semantic_search failed —', matchErr.message);
      } else {
        similar = (matches || []).filter(
          (m) =>
            !(m.result_type === 'publication' && String(m.result_id) === String(publication.id))
        );
      }
    }

    let moreByAuthors = [];
    const authorIds = (publication.researcher_publications || [])
      .map((r) => r.researcher_id)
      .filter(Boolean);
    if (authorIds.length) {
      const { data: rp, error: rpErr } = await supabase
        .from('researcher_publications')
        .select('publications (id, title, publication_year, summary)')
        .in('researcher_id', authorIds)
        .neq('publication_id', publication.id);
      if (rpErr) {
        console.warn('related publications: more-by-author lookup failed —', rpErr.message);
      } else {
        // De-dupe in case of multiple shared authors.
        const seen = new Set();
        moreByAuthors = (rp || [])
          .map((r) => r.publications)
          .filter((p) => p && !seen.has(p.id) && seen.add(p.id));
      }
    }

    res.json({ data: { similar, moreByAuthors } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to load related research' });
  }
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('publications').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('publications')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('publications').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
