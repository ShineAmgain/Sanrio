const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAdmin = require('./requireadmin');

async function getResearchers() {
  const { data, error } = await supabase.from('researchers').select('id, name').order('name');
  if (error) throw error;
  return data || [];
}

// Action items must be registered before /:id so Express does not treat
// "action-items" as a meeting id.
router.get('/action-items', async (req, res) => {
  const { data, error } = await supabase
    .from('project_action_items')
    .select('*')
    .order('due_date', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  const rows = data || [];
  const researcherIds = [...new Set(rows.map((r) => r.assigned_researcher_id).filter(Boolean))];
  let researchers = [];
  if (researcherIds.length) {
    const result = await supabase.from('researchers').select('id, name').in('id', researcherIds);
    if (!result.error) researchers = result.data || [];
  }
  const researcherMap = Object.fromEntries(researchers.map((r) => [r.id, r.name]));
  res.json(rows.map((r) => ({ ...r, assigned_researcher_name: researcherMap[r.assigned_researcher_id] || '—' })));
});

router.post('/action-items', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('project_action_items').insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ data });
});

router.put('/action-items/:id', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('project_action_items')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

router.delete('/action-items/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('project_action_items').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

router.get('/meta', async (req, res) => {
  try {
    const { project_id } = req.query;
    const projectsPromise = supabase.from('projects').select('id, title').order('title');

    const projectsResultPromise = projectsPromise;
    let researchers = [];

    if (project_id) {
      // First get the researcher IDs assigned to this project. We deliberately
      // do this as two queries instead of relying on Supabase's nested relation
      // expansion, because the latter depends on the exact FK relationship
      // being exposed in the PostgREST schema cache.
      const assignments = await supabase
        .from('researcher_projects')
        .select('researcher_id')
        .eq('project_id', project_id);

      if (assignments.error) throw assignments.error;

      const researcherIds = [...new Set((assignments.data || [])
        .map(row => row.researcher_id)
        .filter(Boolean))];

      if (researcherIds.length) {
        const researcherResult = await supabase
          .from('researchers')
          .select('id, name')
          .in('id', researcherIds)
          .order('name');
        if (researcherResult.error) throw researcherResult.error;
        researchers = researcherResult.data || [];
      }
    } else {
      researchers = await getResearchers();
    }

    const projectsResult = await projectsResultPromise;
    if (projectsResult.error) throw projectsResult.error;

    res.json({ researchers, projects: projectsResult.data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('project_meetings')
    .select('*')
    .order('meeting_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const meetings = data || [];
  const ids = meetings.map((m) => m.id).filter(Boolean);
  let participants = [];
  if (ids.length) {
    const result = await supabase
      .from('project_meeting_participants')
      .select('meeting_id, researcher_id, researchers(id, name)')
      .in('meeting_id', ids);
    if (!result.error) participants = result.data || [];
  }

  const projectIds = [...new Set(meetings.map((m) => m.project_id).filter(Boolean))];
  let projects = [];
  if (projectIds.length) {
    const result = await supabase.from('projects').select('id, title').in('id', projectIds);
    if (!result.error) projects = result.data || [];
  }

  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.title]));
  const participantMap = {};
  participants.forEach((p) => {
    if (!participantMap[p.meeting_id]) participantMap[p.meeting_id] = [];
    if (p.researchers) participantMap[p.meeting_id].push(p.researchers);
  });

  res.json(meetings.map((m) => ({
    ...m,
    project_title: projectMap[m.project_id] || '—',
    participants: participantMap[m.id] || [],
  })));
});

router.post('/', requireAdmin, async (req, res) => {
  const { participants = [], ...meeting } = req.body || {};
  const { data, error } = await supabase.from('project_meetings').insert(meeting).select().single();
  if (error) return res.status(500).json({ error: error.message });

  if (Array.isArray(participants) && participants.length) {
    const rows = participants.map((researcher_id) => ({ meeting_id: data.id, researcher_id }));
    const participantResult = await supabase.from('project_meeting_participants').insert(rows);
    if (participantResult.error) return res.status(500).json({ error: participantResult.error.message });
  }

  res.status(201).json({ data });
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { participants, ...meeting } = req.body || {};
  const { data, error } = await supabase
    .from('project_meetings')
    .update(meeting)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (Array.isArray(participants)) {
    await supabase.from('project_meeting_participants').delete().eq('meeting_id', req.params.id);
    if (participants.length) {
      const result = await supabase.from('project_meeting_participants').insert(
        participants.map((researcher_id) => ({ meeting_id: req.params.id, researcher_id }))
      );
      if (result.error) return res.status(500).json({ error: result.error.message });
    }
  }

  res.json({ data });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await supabase.from('project_meeting_participants').delete().eq('meeting_id', req.params.id);
  const { error } = await supabase.from('project_meetings').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
