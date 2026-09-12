const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Research Areas is a read-only taxonomy list — no create/update/delete
// endpoint is called by the frontend for this resource.
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('research_areas')
    .select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('research_areas')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

module.exports = router;
