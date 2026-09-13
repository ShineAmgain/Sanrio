const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// --------------------------------------------------
// SHAPE PROJECT
// --------------------------------------------------
function shapeProject(row) {
  if (!row) return row;

  const {
    researchers,
    project_research_areas,
    researcher_projects,
    ...rest
  } = row;

  const researcherLinks = Array.isArray(researcher_projects)
    ? researcher_projects
    : [];

  const mentorNames = researcherLinks
    .filter((rp) =>
      (rp.role || "").toLowerCase().includes("mentor")
    )
    .map((rp) => rp.researchers?.name)
    .filter(Boolean);

  const leadFromTeam = researcherLinks.find(
    (rp) =>
      (rp.role || "").toLowerCase() === "lead"
  );

  return {
    ...rest,

    lead_researcher_name:
      researchers?.name ||
      leadFromTeam?.researchers?.name ||
      row.lead_researcher_name ||
      null,

    research_area:
      project_research_areas?.[0]?.research_areas?.name ||
      row.research_area ||
      null,

    research_areas: Array.isArray(project_research_areas)
      ? project_research_areas
          .map((l) => l.research_areas)
          .filter(Boolean)
      : row.research_areas || [],

    mentors:
      mentorNames.length
        ? mentorNames.join(", ")
        : row.mentors || null,
  };
}


// ==================================================
// GET ALL PROJECTS
// ==================================================
router.get("/", async (req, res) => {
  const enriched = await supabase
    .from("projects")
    .select(`
      id,
      title,
      status,
      start_date,
      end_date,
      lead_researcher_id,
      description,

      researchers!projects_lead_researcher_id_fkey (
        id,
        name
      ),

      project_research_areas (
        research_areas (
          id,
          name
        )
      ),

      researcher_projects (
        role,
        researchers (
          id,
          name
        )
      )
    `);

  if (!enriched.error) {
    return res.json({
      data: (enriched.data || []).map(shapeProject),
    });
  }

  console.warn(
    "projects list: enriched query failed, falling back to bare select —",
    enriched.error.message
  );

  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      status,
      start_date,
      end_date,
      lead_researcher_id,
      description
    `);

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json({
    data: (data || []).map(shapeProject),
  });
});


// ==================================================
// GET SINGLE PROJECT
// ==================================================
router.get("/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    // ------------------------------------------------
    // 1. GET CORE PROJECT
    // ------------------------------------------------
    const {
      data: project,
      error: projectError,
    } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError) {
      return res.status(500).json({
        error: projectError.message,
      });
    }

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    // ------------------------------------------------
    // 2. GET RESEARCH TEAM
    // ------------------------------------------------
    const {
      data: researcherProjects,
      error: researcherError,
    } = await supabase
      .from("researcher_projects")
      .select(`
        researcher_id,
        role,
        researchers (
          id,
          name
        )
      `)
      .eq("project_id", projectId);

    if (researcherError) {
      console.warn(
        `project ${projectId}: researcher lookup failed —`,
        researcherError.message
      );
    }

    const researcherLinks = researcherProjects || [];

    // ------------------------------------------------
    // 3. GET RESEARCH AREAS
    // ------------------------------------------------
    const {
      data: researchAreaLinks,
      error: researchAreaError,
    } = await supabase
      .from("project_research_areas")
      .select(`
        research_areas (
          id,
          name
        )
      `)
      .eq("project_id", projectId);

    if (researchAreaError) {
      console.warn(
        `project ${projectId}: research area lookup failed —`,
        researchAreaError.message
      );
    }

    // ------------------------------------------------
    // 4. GET PUBLICATIONS
    // ------------------------------------------------
    const {
      data: publicationLinks,
      error: publicationError,
    } = await supabase
      .from("project_publications")
      .select(`
        relationship,
        publications (*)
      `)
      .eq("project_id", projectId);

    if (publicationError) {
      console.warn(
        `project ${projectId}: publication lookup failed —`,
        publicationError.message
      );
    }

    // ------------------------------------------------
    // 5. GET PARTNERS
    // ------------------------------------------------
    let partnerLinks = [];

    const {
      data: partners,
      error: partnerError,
    } = await supabase
      .from("project_partners")
      .select(`
        partners (
          id,
          name,
          category
        )
      `)
      .eq("project_id", projectId);

    if (partnerError) {
      console.warn(
        `project ${projectId}: partner lookup failed —`,
        partnerError.message
      );
    } else {
      partnerLinks = partners || [];
    }

    // ------------------------------------------------
    // 6. GET EVENTS
    // ------------------------------------------------
    let eventLinks = [];

    const {
      data: events,
      error: eventError,
    } = await supabase
      .from("project_events")
      .select(`
        events (
          id,
          title,
          start_at
        )
      `)
      .eq("project_id", projectId);

    if (eventError) {
      console.warn(
        `project ${projectId}: event lookup failed —`,
        eventError.message
      );
    } else {
      eventLinks = events || [];
    }

    // ------------------------------------------------
    // 7. GET RESEARCH GROUPS
    // ------------------------------------------------
    let researchGroupLinks = [];

    const {
      data: researchGroups,
      error: researchGroupError,
    } = await supabase
      .from("project_research_groups")
      .select(`
        research_groups (
          id,
          name
        )
      `)
      .eq("project_id", projectId);

    if (researchGroupError) {
      console.warn(
        `project ${projectId}: research group lookup failed —`,
        researchGroupError.message
      );
    } else {
      researchGroupLinks = researchGroups || [];
    }

    // ------------------------------------------------
    // 8. GET GRANTS
    // ------------------------------------------------
    let grantLinks = [];

    const {
      data: grants,
      error: grantError,
    } = await supabase
      .from("grant_projects")
      .select(`
        grants (
          id,
          title,
          description,
          status
        )
      `)
      .eq("project_id", projectId);

    if (grantError) {
      console.warn(
        `project ${projectId}: grant lookup failed —`,
        grantError.message
      );
    } else {
      grantLinks = grants || [];
    }

    // ------------------------------------------------
    // 9. DETERMINE LEAD + MENTORS
    // ------------------------------------------------
    const leadLink = researcherLinks.find(
      (rp) =>
        (rp.role || "").toLowerCase() === "lead"
    );

    const mentorLinks = researcherLinks.filter(
      (rp) =>
        (rp.role || "").toLowerCase().includes("mentor")
    );

    const leadResearcher =
      leadLink?.researchers || null;

    const mentorNames = mentorLinks
      .map((rp) => rp.researchers?.name)
      .filter(Boolean);

    // ------------------------------------------------
    // 10. NORMALIZE RESEARCH AREAS
    // ------------------------------------------------
    const researchAreas = (researchAreaLinks || [])
      .map((link) => link.research_areas)
      .filter(Boolean);

    // ------------------------------------------------
    // 11. NORMALIZE PUBLICATIONS
    // ------------------------------------------------
    const publications = (publicationLinks || [])
      .map((link) => link.publications)
      .filter(Boolean);

    // ------------------------------------------------
    // 12. NORMALIZE PARTNERS
    // ------------------------------------------------
    const normalizedPartners = partnerLinks
      .map((link) => link.partners)
      .filter(Boolean);

    // ------------------------------------------------
    // 13. NORMALIZE EVENTS
    // ------------------------------------------------
    const normalizedEvents = eventLinks
      .map((link) => link.events)
      .filter(Boolean);

    // ------------------------------------------------
    // 14. NORMALIZE RESEARCH GROUPS
    // ------------------------------------------------
    const normalizedResearchGroups = researchGroupLinks
      .map((link) => link.research_groups)
      .filter(Boolean);

    // ------------------------------------------------
    // 15. NORMALIZE GRANTS
    // ------------------------------------------------
    const normalizedGrants = grantLinks
      .map((link) => link.grants)
      .filter(Boolean);

    // ------------------------------------------------
    // 16. FINAL RESPONSE
    // ------------------------------------------------
    return res.json({
      data: {
        ...project,

        // PEOPLE
        lead_researcher_name:
          leadResearcher?.name || null,

        lead_researcher:
          leadResearcher,

        researcher_projects:
          researcherLinks,

        mentors:
          mentorNames.length
            ? mentorNames.join(", ")
            : null,

        mentor_researchers:
          mentorLinks
            .map((rp) => ({
              ...rp.researchers,
              role: rp.role,
            }))
            .filter((researcher) => researcher.id),

        // RESEARCH AREAS
        research_area:
          researchAreas[0]?.name || null,

        research_areas:
          researchAreas,

        // PUBLICATIONS
        publications,

        project_publications:
          publicationLinks || [],

        // EVENTS
        events:
          normalizedEvents,

        // PARTNERS
        partners:
          normalizedPartners,

        // RESEARCH GROUPS
        research_groups:
          normalizedResearchGroups,

        // GRANTS
        grants:
          normalizedGrants,
      },
    });

  } catch (error) {
    console.error(
      `project ${req.params.id}: unexpected error —`,
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to load project",
    });
  }
});


// ==================================================
// RELATED / DISCOVERY
// ==================================================
router.get("/:id/related", async (req, res) => {
  try {

    // ------------------------------------------------
    // GET PROJECT
    // ------------------------------------------------
    const { data: project, error: projErr } =
      await supabase
        .from("projects")
        .select(`
          id,
          embedding,
          lead_researcher_id,

          researcher_projects (
            researcher_id,
            role
          )
        `)
        .eq("id", req.params.id)
        .single();

    if (projErr) {
      throw projErr;
    }

    // ------------------------------------------------
    // SEMANTICALLY SIMILAR PROJECTS
    // ------------------------------------------------
    let similar = [];

    if (project.embedding) {

      const {
        data: matches,
        error: matchErr,
      } = await supabase.rpc("semantic_search", {
        query_embedding: project.embedding,
        match_threshold: 0.15,
        match_count: 8,
      });

      if (matchErr) {

        console.warn(
          "related projects: semantic_search failed —",
          matchErr.message
        );

      } else {

        similar = (matches || []).filter(
          (match) =>
            !(
              match.result_type === "project" &&
              String(match.result_id) ===
                String(project.id)
            )
        );
      }
    }

    // ------------------------------------------------
    // FIND LEAD RESEARCHER
    // ------------------------------------------------
    let leadResearcherId =
      project.lead_researcher_id || null;

    if (!leadResearcherId) {

      const leadLink = (
        project.researcher_projects || []
      ).find(
        (rp) =>
          (rp.role || "").toLowerCase() === "lead"
      );

      if (leadLink) {
        leadResearcherId =
          leadLink.researcher_id;
      }
    }

    // ------------------------------------------------
    // MORE PROJECTS BY LEAD RESEARCHER
    // ------------------------------------------------
    let moreByResearcher = [];

    if (leadResearcherId) {

      const { data: rp, error: rpErr } =
        await supabase
          .from("researcher_projects")
          .select(`
            project_id,

            projects (
              id,
              title,
              status,
              description
            )
          `)
          .eq(
            "researcher_id",
            leadResearcherId
          )
          .neq(
            "project_id",
            project.id
          );

      if (rpErr) {

        console.warn(
          "related projects: more-by-researcher lookup failed —",
          rpErr.message
        );

      } else {

        moreByResearcher = (rp || [])
          .map((row) => row.projects)
          .filter(Boolean);
      }
    }

    // ------------------------------------------------
    // RESPONSE
    // ------------------------------------------------
    res.json({
      data: {
        similar,
        moreByResearcher,
        leadResearcherId,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
        error.message ||
        "Failed to load related research",
    });
  }
});


// ==================================================
// CREATE PROJECT
// ==================================================
router.post("/", async (req, res) => {

  const { data, error } = await supabase
    .from("projects")
    .insert(req.body)
    .select();

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.status(201).json({
    data: data[0],
  });
});


// ==================================================
// UPDATE PROJECT
// ==================================================
router.put("/:id", async (req, res) => {

  const { data, error } = await supabase
    .from("projects")
    .update(req.body)
    .eq("id", req.params.id)
    .select();

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json({
    data: data[0],
  });
});


// ==================================================
// DELETE PROJECT
// ==================================================
router.delete("/:id", async (req, res) => {

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.status(204).send();
});


module.exports = router;