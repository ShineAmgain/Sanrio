const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAdmin = require('./requireadmin');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('publications')
    .select('id, title, publication_year, summary');

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('publications')
    .select(`
      *,
      researcher_publications (
        author_order,
        researchers (*)
      ),
      project_publications (
        relationship,
        projects (*)
      )
    `)
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

router.post('/', requireAdmin, async (req, res) => {
  // These fields are required only when publishing.
  // Drafts and previews can still be saved without them.
  if (req.body?.content_status === 'published') {
    const missing = [
      'title',
      'publication_year',
      'external_url'
    ].filter((key) => {
      const value = req.body?.[key];

      return (
        value === undefined ||
        value === null ||
        String(value).trim() === ''
      );
    });

    if (missing.length) {
      return res.status(400).json({
        error:
          `Before publishing, the following publication fields are required: ${missing.join(', ')}`
      });
    }
  }

  const { data, error } = await supabase
    .from('publications')
    .insert(req.body)
    .select();

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.status(201).json(data[0]);
});

router.put('/:id', requireAdmin, async (req, res) => {
  // These fields are required only when publishing.
  // Drafts and previews can still be saved without them.
  if (req.body?.content_status === 'published') {
    const missing = [
      'title',
      'publication_year',
      'external_url'
    ].filter((key) => {
      const value = req.body?.[key];

      return (
        value === undefined ||
        value === null ||
        String(value).trim() === ''
      );
    });

    if (missing.length) {
      return res.status(400).json({
        error:
          `Before publishing, the following publication fields are required: ${missing.join(', ')}`
      });
    }
  }

  const { data, error } = await supabase
    .from('publications')
    .update(req.body)
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data[0]);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.status(204).send();
});

module.exports = router;