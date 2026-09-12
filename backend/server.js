const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const researchersRoutes = require("./routes/researchers");
const projectsRoutes = require("./routes/projects");
const publicationsRoutes = require("./routes/publications");
const eventsRoutes = require("./routes/events");
const grantsRoutes = require("./routes/grants");
const resourcesRoutes = require("./routes/resources");
const ijmrRoutes = require("./routes/ijmr");
const partnersRoutes = require("./routes/partners");
const ethicsRoutes = require("./routes/ethics");
const researchAreasRoutes = require("./routes/researchAreas");
const researchGroupsRoutes = require("./routes/researchGroups");
const announcementsRoutes = require("./routes/announcements");
const statisticsRoutes = require("./routes/statistics");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase test
app.get("/api/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, title")
      .limit(5);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ connected: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Supabase connection failed" });
  }
});

// API routes
app.use("/api/researchers", researchersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/publications", publicationsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/grants", grantsRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/ijmr", ijmrRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/ethics", ethicsRoutes);
app.use("/api/research-areas", researchAreasRoutes);
app.use("/api/research-groups", researchGroupsRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/statistics", statisticsRoutes);

const PYTHON_SERVICE_URL = "http://127.0.0.1:5000";

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "node-backend" });
});

// Semantic search
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // 1. Convert the user's query into an embedding using Python
    const response = await fetch(`${PYTHON_SERVICE_URL}/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error(`Python service returned ${response.status}`);
    }

    const embeddingData = await response.json();

    // 2. Search all R&D content in Supabase
    const { data, error } = await supabase.rpc("semantic_search", {
      query_embedding: embeddingData.embedding,
      match_threshold: 0.30,
      match_count: 20,
    });

    if (error) {
      console.error("Supabase search error:", error);
      return res.status(500).json({
        error: "Database semantic search failed",
        details: error.message,
      });
    }

    // 3. Return the actual search results
    res.json({ query: query, results: data || [] });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Semantic search failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Node backend running on http://localhost:${PORT}`);
});