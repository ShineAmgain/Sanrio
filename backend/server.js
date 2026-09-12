const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const app = express();
const PORT = 3000;
app.get("/api/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, title")
      .limit(5);

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      connected: true,
      data: data
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Supabase connection failed"
    });
  }
});
app.use(cors());
app.use(express.json());

const PYTHON_SERVICE_URL = "http://127.0.0.1:5000";

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "node-backend"
  });
});

// Semantic search - currently only testing Node → Python
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        error: "Search query is required"
      });
    }

    const response = await fetch(`${PYTHON_SERVICE_URL}/embed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query
      })
    });

    if (!response.ok) {
      throw new Error(`Python service returned ${response.status}`);
    }

    const data = await response.json();

    res.json({
      query: query,
      embedding: data.embedding,
      dimensions: data.dimensions
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Semantic search service failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Node backend running on http://localhost:${PORT}`);
});
