const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('ethics_entries')
    .select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('ethics_entries')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('ethics_entries').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data: data[0] });
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('ethics_entries')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data: data[0] });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('ethics_entries').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
