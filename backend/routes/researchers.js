const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Shapes a raw researcher row (with optional joined tables) into the flat
// fields the frontend expects: department (name, not id) and research_areas
// (array of {id, name}).
function shapeResearcher(row) {
  if (!row) return row;
  const { departments, researcher_research_areas, ...rest } = row;
  return {
    ...rest,
    department: departments?.name || row.department || null,
    research_areas: Array.isArray(researcher_research_areas)
      ? researcher_research_areas
          .map((link) => link.research_areas)
          .filter(Boolean)
      : row.research_areas || [],
  };
}

// GET all researchers (list view)
router.get('/', async (req, res) => {
  // Try the enriched query first (department name + research area tags).
  // Falls back to the bare table if those relationships/tables don't exist
  // yet, so the endpoint never hard-fails because of missing taxonomy tables.
  const enriched = await supabase
    .from('researchers')
    .select(`
      id, name, position, department_id, status,
      departments ( name ),
      researcher_research_areas ( research_areas ( id, name ) )
    `);

  if (!enriched.error) {
    return res.json({ data: (enriched.data || []).map(shapeResearcher) });
  }

  console.warn(
    'researchers list: enriched query failed, falling back to bare select —',
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('researchers')
    .select('id, name, position, department_id, status');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: (data || []).map(shapeResearcher) });
});

// GET one researcher with connected projects + publications (detail view)
router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('researchers')
    .select(`
      *,
      departments ( name ),
      researcher_research_areas ( research_areas ( id, name ) ),
      researcher_projects ( role, projects (*) ),
      researcher_publications ( author_order, publications (*) )
    `)
    .eq('id', req.params.id)
    .single();

  if (!enriched.error) {
    return res.json({ data: shapeResearcher(enriched.data) });
  }

  console.warn(
    `researcher ${req.params.id}: enriched query failed, falling back —`,
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('researchers')
    .select(`
      *,
      researcher_projects ( role, projects (*) ),
      researcher_publications ( author_order, publications (*) )
    `)
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: shapeResearcher(data) });
});

// CREATE
router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('researchers')
    .insert(req.body)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('researchers')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('researchers')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
