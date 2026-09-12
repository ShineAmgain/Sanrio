const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all researchers (list view)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('researchers')
    .select('id, name, position, department_id, status');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET one researcher with connected projects + publications (detail view)
router.get('/:id', async (req, res) => {
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
  res.json(data);
});

// CREATE
router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('researchers')
    .insert(req.body)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('researchers')
    .update(req.body)
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
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