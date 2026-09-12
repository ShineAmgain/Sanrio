import { useState } from "react";
import { Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getResearchAreas } from "../api/researchAreas";
import { getProjects } from "../api/projects";
import { getResearchers } from "../api/researchers";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ResearchAreas() {
  const areasState = useApiData(() => getResearchAreas(), []);
  const projectsState = useApiData(() => getProjects(), []);
  const researchersState = useApiData(() => getResearchers(), []);
  const [activeArea, setActiveArea] = useState(null);

  const areas = areasState.data?.data || [];
  const projects = projectsState.data?.data || [];
  const researchers = researchersState.data?.data || [];

  const relatedProjects = activeArea
    ? projects.filter((p) => p.research_area === activeArea)
    : [];
  const relatedResearchers = activeArea
    ? researchers.filter((r) => r.department === activeArea)
    : [];

  return (
    <div className="page-container">
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
                activeArea === area.name ? "area-chip area-chip-active" : "area-chip"
              }
              onClick={() =>
                setActiveArea(activeArea === area.name ? null : area.name)
              }
            >
              {area.name}
            </button>
          ))}
        </div>
      )}

      {activeArea && (
        <div className="section" style={{ padding: "2rem 0" }}>
          <h2>{activeArea}</h2>

          <h3>Projects</h3>
          {relatedProjects.length === 0 ? (
            <EmptyState message="No projects tagged with this area yet." />
          ) : (
            <ul>
              {relatedProjects.map((p) => (
                <li key={p.id}>
                  <Link to={`/projects/${p.id}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          )}

          <h3>Researchers</h3>
          {relatedResearchers.length === 0 ? (
            <EmptyState message="No researchers tagged with this area yet." />
          ) : (
            <ul>
              {relatedResearchers.map((r) => (
                <li key={r.id}>
                  <Link to={`/researchers/${r.id}`}>{r.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
