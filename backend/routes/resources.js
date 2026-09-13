const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

function shapeResource(row) {
  if (!row) return row;

  const { resource_research_areas, ...rest } = row;

  const resourceUrl =
    row.url ||
    row.file_url ||
    row.resource_url ||
    row.external_url ||
    row.link ||
    row.website_url ||
    null;

  return {
    ...rest,
    url: resourceUrl,
    research_areas: Array.isArray(resource_research_areas)
      ? resource_research_areas
          .map((l) => l.research_areas)
          .filter(Boolean)
      : row.research_areas || [],
  };
}

router.get('/', async (req, res) => {
  const enriched = await supabase
    .from('resources')
    .select(`
      *,
      resource_research_areas ( research_areas ( id, name ) )
    `);

  if (!enriched.error) {
    return res.json({ data: (enriched.data || []).map(shapeResource) });
  }

  console.warn('resources list: enriched query failed, falling back —', enriched.error.message);

  const { data, error } = await supabase.from('resources').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: (data || []).map(shapeResource) });
});

router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('resources')
    .select(`
      *,
      resource_research_areas ( research_areas ( id, name ) )
    `)
    .eq('id', req.params.id)
    .single();

  if (!enriched.error) {
    return res.json({ data: shapeResource(enriched.data) });
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: shapeResource(data) });
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('resources').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('resources')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('resources').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
