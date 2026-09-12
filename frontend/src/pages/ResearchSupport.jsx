import { useMemo, useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { getResources } from "../api/resources";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// Pulled from GET /api/resources (Supabase table: resources). Assumed
// columns: title, category, description, url — adjust the field names
// below if your actual schema differs.
export default function ResearchSupport() {
  const { data, loading, error, reload } = useApiData(() => getResources(), []);
  const resources = data?.data || [];

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...new Set(resources.map((r) => r.category).filter(Boolean))],
    [resources]
  );

  const filtered = resources.filter((r) => {
    const title = r.title || r.name || "";
    const matchesQuery = title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || r.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="page-container">
      <h1>Research Support &amp; Resources</h1>

      {loading && <LoadingState count={6} />}
      {error && <ErrorState onRetry={reload} />}

      {!loading && !error && (
        <>
          <div className="filter-row">
            <input
              type="text"
              placeholder="Search resources..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-bar-inline"
            />
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "chip chip-active" : "chip"}
                onClick={() => setCategory(c)}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState message="No resources published yet." />
          ) : (
            <div className="card-grid card-grid-3">
              {filtered.map((r) => (
                <a
                  href={r.url || r.file_url || undefined}
                  target={r.url || r.file_url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="project-card"
                  key={r.id}
                >
                  {r.category && <span className="pill">{r.category}</span>}
                  <h3>{r.title || r.name}</h3>
                  {r.description && <p className="card-snippet">{r.description}</p>}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
