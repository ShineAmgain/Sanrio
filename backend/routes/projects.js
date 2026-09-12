const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('project_id, title, status, start_date, end_date, lead_researcher_id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      researcher_projects ( role, researchers (*) ),
      project_publications ( relationship, publications (*) )
    `)
    .eq('project_id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('projects').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .update(req.body)
    .eq('project_id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('projects').delete().eq('project_id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;