const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('publications')
    .select('publication_id, title, publication_year, publication_type');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('publications')
    .select(`
      *,
      researcher_publications ( author_order, researchers (*) ),
      project_publications ( relationship, projects (*) )
    `)
    .eq('publication_id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('publications').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('publications')
    .update(req.body)
    .eq('publication_id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('publications').delete().eq('publication_id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;