const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Shapes a raw grant row into the flat fields the frontend expects:
// research_areas (tag pills) and projects (funded/related projects).
function shapeGrant(row) {
  if (!row) return row;
  const { grant_research_areas, grant_projects, ...rest } = row;
  return {
    ...rest,
    research_areas: Array.isArray(grant_research_areas)
      ? grant_research_areas.map((l) => l.research_areas).filter(Boolean)
      : row.research_areas || [],
    projects: Array.isArray(grant_projects)
      ? grant_projects.map((l) => l.projects).filter(Boolean)
      : row.projects || [],
  };
}

router.get('/', async (req, res) => {
  const enriched = await supabase
    .from('grants')
    .select(`
      *,
      grant_research_areas ( research_areas ( id, name ) )
    `);

  if (!enriched.error) {
    return res.json({ data: (enriched.data || []).map(shapeGrant) });
  }

  console.warn('grants list: enriched query failed, falling back —', enriched.error.message);

  const { data, error } = await supabase.from('grants').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: (data || []).map(shapeGrant) });
});

// Required cross-linking per the brief: Grant -> Research Areas,
// Eligibility, Projects, Opportunities.
router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('grants')
    .select(`
      *,
      grant_research_areas ( research_areas ( id, name ) ),
      grant_projects ( projects ( id, title, status, description ) )
    `)
    .eq('id', req.params.id)
    .single();

  if (!enriched.error) {
    return res.json({ data: shapeGrant(enriched.data) });
  }

  console.warn(
    `grant ${req.params.id}: enriched query failed, falling back —`,
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('grants')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: shapeGrant(data) });
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('grants').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('grants')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('grants').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
