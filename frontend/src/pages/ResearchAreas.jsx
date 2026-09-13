import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { Link, useSearchParams } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getResearchAreas, getResearchArea } from "../api/researchAreas";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ResearchAreas() {
  const areasState = useApiData(() => getResearchAreas(), []);
  const [params, setParams] = useSearchParams();
  const areaIdParam = params.get("area");
  const [activeAreaId, setActiveAreaId] = useState(areaIdParam || null);

  // Deep-linking support: a research-area tag clicked from anywhere else in
  // the app (researcher cards, project cards, profile pages) lands here
  // with ?area=<id> and opens straight to that area's real, DB-backed detail.
  useEffect(() => {
    setActiveAreaId(areaIdParam || null);
  }, [areaIdParam]);

  const areas = areasState.data?.data || [];

  // Fetches the one area's linked projects & researchers directly from the
  // database via the junction tables — no client-side string matching.
  const detailState = useApiData(
    () => (activeAreaId ? getResearchArea(activeAreaId) : Promise.resolve(null)),
    [activeAreaId]
  );
  const activeArea = detailState.data?.data;

  function selectArea(id) {
    const next = activeAreaId === id ? null : id;
    setActiveAreaId(next);
    setParams(next ? { area: next } : {});
  }

  return (
    <div className="page-container">
      <BackButton />
      <h1>Research Areas &amp; Groups</h1>
      <p className="detail-lead">
        Browse the structured research taxonomy and see who's working in each
        area, and which projects fall under it.
      </p>

      {areasState.loading && <LoadingState count={6} />}
      {areasState.error && <ErrorState onRetry={areasState.reload} />}
      {!areasState.loading && !areasState.error && areas.length === 0 && (
        <EmptyState message="No research areas configured yet." />
      )}

      {!areasState.loading && !areasState.error && areas.length > 0 && (
        <div className="card-grid card-grid-4">
          {areas.map((area) => (
            <button
              key={area.id}
              className={
                activeAreaId === String(area.id)
                  ? "area-chip area-chip-active"
                  : "area-chip"
              }
              onClick={() => selectArea(String(area.id))}
            >
              {area.name}
            </button>
          ))}
        </div>
      )}

      {activeAreaId && (
        <div className="section" style={{ padding: "2rem 0" }}>
          {detailState.loading && <LoadingState count={2} />}
          {detailState.error && <ErrorState onRetry={detailState.reload} />}

          {!detailState.loading && !detailState.error && activeArea && (
            <>
              <h2>{activeArea.name}</h2>
              {activeArea.description && (
                <p className="detail-lead">{activeArea.description}</p>
              )}

              <h3>Projects</h3>
              {!activeArea.projects || activeArea.projects.length === 0 ? (
                <EmptyState message="No projects tagged with this area yet." />
              ) : (
                <div className="related-list">
                  {activeArea.projects.map((p) => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="related-item">
                      <h4>{p.title}</h4>
                      {p.status && <p className="muted">Status: {p.status}</p>}
                    </Link>
                  ))}
                </div>
              )}

              <h3>Researchers</h3>
              {!activeArea.researchers || activeArea.researchers.length === 0 ? (
                <EmptyState message="No researchers tagged with this area yet." />
              ) : (
                <div className="card-grid card-grid-4">
                  {activeArea.researchers.map((r) => (
                    <Link
                      key={r.id}
                      to={`/researchers/${r.id}`}
                      className="related-item"
                    >
                      <h4>{r.name}</h4>
                      {r.position && <p className="muted">{r.position}</p>}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
