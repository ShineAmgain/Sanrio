const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

function shapePartner(row) {
  if (!row) return row;
  const { partner_researchers, project_partners, ...rest } = row;
  return {
    ...rest,
    researchers: Array.isArray(partner_researchers)
      ? partner_researchers.map((l) => l.researchers).filter(Boolean)
      : row.researchers || [],
    projects: Array.isArray(project_partners)
      ? project_partners.map((l) => l.projects).filter(Boolean)
      : row.projects || [],
  };
}

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('partners')
    .select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

// Required cross-linking per the brief: Partner -> linked researchers and
// projects (via partner_researchers / project_partners).
router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('partners')
    .select(`
      *,
      partner_researchers ( researchers ( id, name, position ) ),
      project_partners ( projects ( id, title, status ) )
    `)
    .eq('id', req.params.id)
    .single();

  if (!enriched.error) {
    return res.json({ data: shapePartner(enriched.data) });
  }

  console.warn(
    `partner ${req.params.id}: enriched query failed, falling back —`,
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: shapePartner(data) });
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('partners').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('partners')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('partners').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
