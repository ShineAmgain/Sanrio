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

// One area plus everything actually tagged with it, via the junction
// tables — this is what makes the "Research Areas" page and the tag pills
// on researcher/project cards link to something real instead of dead-ending.
router.get('/:id', async (req, res) => {
  const enriched = await supabase
    .from('research_areas')
    .select(`
      *,
      project_research_areas ( projects ( id, title, status, description ) ),
      researcher_research_areas ( researchers ( id, name, position ) ),
      publication_research_areas ( publications ( id, title, publication_year ) ),
      event_research_areas ( events ( id, title, start_at ) ),
      grant_research_areas ( grants ( id, title, deadline ) ),
      opportunity_research_areas ( opportunities ( id, title, deadline ) )
    `)
    .eq('id', req.params.id)
    .single();

  if (!enriched.error) {
    const {
      project_research_areas,
      researcher_research_areas,
      publication_research_areas,
      event_research_areas,
      grant_research_areas,
      opportunity_research_areas,
      ...rest
    } = enriched.data;
    return res.json({
      data: {
        ...rest,
        projects: (project_research_areas || []).map((l) => l.projects).filter(Boolean),
        researchers: (researcher_research_areas || []).map((l) => l.researchers).filter(Boolean),
        publications: (publication_research_areas || []).map((l) => l.publications).filter(Boolean),
        events: (event_research_areas || []).map((l) => l.events).filter(Boolean),
        grants: (grant_research_areas || []).map((l) => l.grants).filter(Boolean),
        opportunities: (opportunity_research_areas || []).map((l) => l.opportunities).filter(Boolean),
      },
    });
  }

  console.warn(
    `research area ${req.params.id}: enriched query failed, falling back —`,
    enriched.error.message
  );

  const { data, error } = await supabase
    .from('research_areas')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({
    data: {
      ...data,
      projects: [],
      researchers: [],
      publications: [],
      events: [],
      grants: [],
      opportunities: [],
    },
  });
});

module.exports = router;
