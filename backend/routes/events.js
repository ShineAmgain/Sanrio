const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAdmin = require('./requireadmin');

// GET all events (list view)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, event_type, start_at, end_at, location, status, is_demo');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET one event (detail view)
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CREATE (admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('events').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// UPDATE (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('events').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;