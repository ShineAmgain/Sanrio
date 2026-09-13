const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Shapes a raw event row into the flat fields the frontend expects:
// research_areas (tag pills) and speakers (researchers attached to the event).
function shapeEvent(row) {
  if (!row) return row;
  const { event_research_areas, researcher_events, publication_events, ...rest } = row;
  return {
    ...rest,
    research_areas: Array.isArray(event_research_areas)
      ? event_research_areas.map((l) => l.research_areas).filter(Boolean)
      : row.research_areas || [],
    speakers: Array.isArray(researcher_events)
      ? researcher_events.map((l) => l.researchers).filter(Boolean)
      : row.speakers || [],
    publications: Array.isArray(publication_events)
      ? publication_events.map((l) => l.publications).filter(Boolean)
      : row.publications || [],
  };
}

router.get('/', async (req, res) => {
  const enriched = await supabase
    .from('events')
    .select(`
      *,
      event_research_areas ( research_areas ( id, name ) )
    `);

  if (!enriched.error) {
    return res.json({ data: (enriched.data || []).map(shapeEvent) });
  }

  console.warn('events list: enriched query failed, falling back —', enriched.error.message);

  const { data, error } = await supabase.from('events').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: (data || []).map(shapeEvent) });
});

// One event plus its research areas, speakers/researchers, related
// publications and proceedings — required cross-linking per the brief:
// Event -> Researchers/Speakers, Research Areas, Publications, Proceedings.
router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('events')
    .select(`
      *,
      event_research_areas ( research_areas ( id, name ) ),
      researcher_events ( role, researchers ( id, name, position ) ),
      publication_events ( publications ( id, title, publication_year ) ),
      event_proceedings ( proceeding_publications ( publications ( id, title, publication_year ) ) )
    `)
    .eq('id', req.params.id)
    .single();

  if (!enriched.error) {
    return res.json({ data: shapeEvent(enriched.data) });
  }

  console.warn(
    `event ${req.params.id}: enriched query failed, falling back —`,
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: shapeEvent(data) });
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('events').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('events').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
