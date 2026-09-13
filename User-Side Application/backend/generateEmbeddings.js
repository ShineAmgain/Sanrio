const supabase = require("./config/supabase");

const PYTHON_SERVICE_URL = "http://127.0.0.1:5000";

async function createEmbedding(text) {
  const response = await fetch(`${PYTHON_SERVICE_URL}/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Python embedding service returned ${response.status}`
    );
  }

  const data = await response.json();

  return data.embedding;
}


/*
========================================
RESEARCHERS
========================================
*/

async function embedResearchers() {
  console.log("\n--- Researchers ---");

  const { data, error } = await supabase
    .from("researchers")
    .select(`
      id,
      name,
      position,
      bio
    `);

  if (error) {
    throw new Error(`Researchers: ${error.message}`);
  }

  console.log(`Found ${data.length} researchers.`);

  for (const researcher of data) {

    const text = [
      researcher.name,
      researcher.position,
      researcher.bio,
    ]
      .filter(Boolean)
      .join(". ");

    if (!text.trim()) {
      console.log(`Skipping researcher ${researcher.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("researchers")
      .update({
        embedding: embedding,
      })
      .eq("id", researcher.id);

    if (updateError) {
      console.error(
        `❌ Researcher ${researcher.id}: ${updateError.message}`
      );
      continue;
    }

    console.log(`✓ ${researcher.name}`);
  }
}


/*
========================================
PROJECTS
========================================
*/

async function embedProjects() {
  console.log("\n--- Projects ---");

  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      objectives,
      outputs_summary,
      status
    `);

  if (error) {
    throw new Error(`Projects: ${error.message}`);
  }

  console.log(`Found ${data.length} projects.`);

  for (const project of data) {

    const text = [
      project.title,
      project.description,
      project.objectives,
      project.outputs_summary,
      project.status,
    ]
      .filter(Boolean)
      .join(". ");

    if (!text.trim()) {
      console.log(`Skipping project ${project.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        embedding: embedding,
      })
      .eq("id", project.id);

    if (updateError) {
      console.error(
        `❌ Project ${project.id}: ${updateError.message}`
      );
      continue;
    }

    console.log(`✓ ${project.title}`);
  }
}


/*
========================================
PUBLICATIONS
========================================
*/

async function embedPublications() {
  console.log("\n--- Publications ---");

  const { data, error } = await supabase
    .from("publications")
    .select(`
      id,
      title,
      abstract,
      summary
    `);

  if (error) {
    throw new Error(`Publications: ${error.message}`);
  }

  console.log(`Found ${data.length} publications.`);

  for (const publication of data) {

    const text = [
      publication.title,
      publication.abstract,
      publication.summary,
    ]
      .filter(Boolean)
      .join(". ");

    if (!text.trim()) {
      console.log(`Skipping publication ${publication.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("publications")
      .update({
        embedding: embedding,
      })
      .eq("id", publication.id);

    if (updateError) {
      console.error(
        `❌ Publication ${publication.id}: ${updateError.message}`
      );
      continue;
    }

    console.log(`✓ ${publication.title}`);
  }
}


/*
========================================
EVENTS
========================================
*/

async function embedEvents() {
  console.log("\n--- Events ---");

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      event_type,
      location,
      status
    `);

  if (error) {
    throw new Error(`Events: ${error.message}`);
  }

  console.log(`Found ${data.length} events.`);

  for (const event of data) {

    const text = [
      event.title,
      event.description,
      event.event_type,
      event.location,
      event.status,
    ]
      .filter(Boolean)
      .join(". ");

    if (!text.trim()) {
      console.log(`Skipping event ${event.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("events")
      .update({
        embedding: embedding,
      })
      .eq("id", event.id);

    if (updateError) {
      console.error(
        `❌ Event ${event.id}: ${updateError.message}`
      );
      continue;
    }

    console.log(`✓ ${event.title}`);
  }
}


/*
========================================
GRANTS
========================================
*/

async function embedGrants() {
  console.log("\n--- Grants ---");

  const { data, error } = await supabase
    .from("grants")
    .select(`
      id,
      title,
      provider,
      funding_type,
      description,
      eligibility,
      amount,
      requirements,
      application_process,
      status
    `);

  if (error) {
    throw new Error(`Grants: ${error.message}`);
  }

  console.log(`Found ${data.length} grants.`);

  for (const grant of data) {

    const text = [
      grant.title,
      grant.provider,
      grant.funding_type,
      grant.description,
      grant.eligibility,
      grant.amount,
      grant.requirements,
      grant.application_process,
      grant.status,
    ]
      .filter(Boolean)
      .join(". ");

    if (!text.trim()) {
      console.log(`Skipping grant ${grant.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("grants")
      .update({
        embedding: embedding,
      })
      .eq("id", grant.id);

    if (updateError) {
      console.error(
        `❌ Grant ${grant.id}: ${updateError.message}`
      );
      continue;
    }

    console.log(`✓ ${grant.title}`);
  }
}


/*
========================================
RESEARCH AREAS
========================================
*/

async function embedResearchAreas() {
  console.log("\n--- Research Areas ---");

  const { data, error } = await supabase
    .from("research_areas")
    .select(`id, name, description`);

  if (error) {
    console.error(`⚠️  Research Areas: ${error.message} — skipping (table/columns may differ).`);
    return;
  }

  console.log(`Found ${data.length} research areas.`);

  for (const area of data) {
    const text = [area.name, area.description].filter(Boolean).join(". ");
    if (!text.trim()) {
      console.log(`Skipping research area ${area.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("research_areas")
      .update({ embedding })
      .eq("id", area.id);

    if (updateError) {
      console.error(`❌ Research area ${area.id}: ${updateError.message}`);
      continue;
    }

    console.log(`✓ ${area.name}`);
  }
}

/*
========================================
RESOURCES
========================================
*/

async function embedResources() {
  console.log("\n--- Resources ---");

  const { data, error } = await supabase
    .from("resources")
    .select(`id, title, description, category`);

  if (error) {
    console.error(`⚠️  Resources: ${error.message} — skipping (table/columns may differ).`);
    return;
  }

  console.log(`Found ${data.length} resources.`);

  for (const resource of data) {
    const text = [resource.title, resource.description, resource.category]
      .filter(Boolean)
      .join(". ");
    if (!text.trim()) {
      console.log(`Skipping resource ${resource.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("resources")
      .update({ embedding })
      .eq("id", resource.id);

    if (updateError) {
      console.error(`❌ Resource ${resource.id}: ${updateError.message}`);
      continue;
    }

    console.log(`✓ ${resource.title}`);
  }
}

/*
========================================
OPPORTUNITIES (distinct from Grants — see brief section 4)
========================================
*/

async function embedOpportunities() {
  console.log("\n--- Opportunities ---");

  const { data, error } = await supabase
    .from("opportunities")
    .select(`id, title, description, eligibility, opportunity_type`);

  if (error) {
    console.error(`⚠️  Opportunities: ${error.message} — skipping (table/columns may differ).`);
    return;
  }

  console.log(`Found ${data.length} opportunities.`);

  for (const opportunity of data) {
    const text = [
      opportunity.title,
      opportunity.description,
      opportunity.eligibility,
      opportunity.opportunity_type,
    ]
      .filter(Boolean)
      .join(". ");
    if (!text.trim()) {
      console.log(`Skipping opportunity ${opportunity.id}`);
      continue;
    }

    const embedding = await createEmbedding(text);

    const { error: updateError } = await supabase
      .from("opportunities")
      .update({ embedding })
      .eq("id", opportunity.id);

    if (updateError) {
      console.error(`❌ Opportunity ${opportunity.id}: ${updateError.message}`);
      continue;
    }

    console.log(`✓ ${opportunity.title}`);
  }
}

/*
========================================
RUN EVERYTHING
========================================
*/

async function main() {

  console.log("======================================");
  console.log("R&D DIGITAL HUB");
  console.log("Embedding Generator");
  console.log("======================================");

  await embedResearchers();

  await embedProjects();

  await embedPublications();

  await embedEvents();

  await embedGrants();

  await embedResearchAreas();

  await embedResources();

  await embedOpportunities();

  console.log("\n======================================");
  console.log("✅ ALL EMBEDDINGS GENERATED");
  console.log("======================================");
}


main().catch((error) => {

  console.error("\n❌ Embedding generation failed:");
  console.error(error);

  process.exit(1);
});