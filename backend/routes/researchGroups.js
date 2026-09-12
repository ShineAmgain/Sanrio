const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('research_groups')
    .select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

// One group plus its real members and projects, via the junction tables
// (researcher_research_groups / project_research_groups) — this is what
// makes the Research Groups page actually connect instead of only ever
// showing "No members/projects linked yet".
router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('research_groups')
    .select(`
      *,
      researcher_research_groups ( researchers ( id, name, position ) ),
      project_research_groups ( projects ( id, title, status, description ) )
    `)
    .eq('id', req.params.id)
    .single();

  if (!enriched.error) {
    const { researcher_research_groups, project_research_groups, ...rest } = enriched.data;
    return res.json({
      data: {
        ...rest,
        researchers: (researcher_research_groups || []).map((l) => l.researchers).filter(Boolean),
        projects: (project_research_groups || []).map((l) => l.projects).filter(Boolean),
      },
    });
  }

  console.warn(
    `research group ${req.params.id}: enriched query failed, falling back —`,
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('research_groups')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: { ...data, researchers: [], projects: [] } });
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('research_groups').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('research_groups')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('research_groups').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
