const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAdmin = require('./requireadmin');

// GET /api/activity-log — most recent activity first.
// Optional query params: ?limit=20  ?entity_type=project
router.get('/', async (req, res) => {
  const { limit = 50, entity_type } = req.query;

  let query = supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(Number(limit));

  if (entity_type) query = query.eq('entity_type', entity_type);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// POST /api/activity-log — record a new entry.
// In practice this is usually called from inside your other routes
// (e.g. right after a successful insert in projects.js) rather than
// directly from the frontend, but it's exposed here too in case you
// want to log something ad hoc from an admin action.
router.post('/', requireAdmin, async (req, res) => {
  const { action, entity_type, entity_id, description, metadata } = req.body || {};

  if (!action || !entity_type) {
    return res.status(400).json({ error: 'action and entity_type are required' });
  }

  const { data, error } = await supabase
    .from('activity_log')
    .insert({
      user_id: req.user?.id ?? null, // set by requireAdmin after verifying the session
      action,
      entity_type,
      entity_id: entity_id ?? null,
      description: description ?? null,
      metadata: metadata ?? null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data });
});

module.exports = router;