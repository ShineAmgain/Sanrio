const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAdmin = require('./requireadmin');

// GET all announcements (list view)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET one announcement (detail view)
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CREATE (admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('announcements').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// UPDATE (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('announcements')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('announcements').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
