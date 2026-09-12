import { useState } from "react";
import { Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getResearchGroups } from "../api/researchGroups";
import { getResearchers } from "../api/researchers";
import { getProjects } from "../api/projects";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// Research Groups are distinct from Research Areas: an area is a taxonomy
// tag (e.g. "AI"), a group is a standing team people belong to (via the
// researcher_research_groups / project_research_groups join tables).
export default function ResearchGroups() {
  const groupsState = useApiData(() => getResearchGroups(), []);
  const researchersState = useApiData(() => getResearchers(), []);
  const projectsState = useApiData(() => getProjects(), []);
  const [activeGroupId, setActiveGroupId] = useState(null);

  const groups = groupsState.data?.data || [];
  const researchers = researchersState.data?.data || [];
  const projects = projectsState.data?.data || [];

  // Membership comes through join tables we don't have a dedicated
  // endpoint for yet, so we only show a direct match if a researcher or
  // project record happens to carry a group_id/research_group_id field.
  // Everything else degrades gracefully to "not available" rather than
  // guessing at a relationship that isn't in hand.
  const relatedResearchers = activeGroupId
    ? researchers.filter(
        (r) =>
          r.research_group_id === activeGroupId || r.group_id === activeGroupId
      )
    : [];
  const relatedProjects = activeGroupId
    ? projects.filter(
        (p) =>
          p.research_group_id === activeGroupId || p.group_id === activeGroupId
      )
    : [];

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  return (
    <div className="page-container">
      <h1>Research Groups</h1>
      <p className="detail-lead">
        Standing research teams within the R&amp;D ecosystem — browse each
        group to see its members and active projects.
      </p>

      {groupsState.loading && <LoadingState count={6} />}
      {groupsState.error && <ErrorState onRetry={groupsState.reload} />}
      {!groupsState.loading && !groupsState.error && groups.length === 0 && (
        <EmptyState message="No research groups configured yet." />
      )}

      {!groupsState.loading && !groupsState.error && groups.length > 0 && (
        <div className="card-grid card-grid-3">
          {groups.map((group) => (
            <button
              key={group.id}
              className={
                activeGroupId === group.id
                  ? "area-chip area-chip-active"
                  : "area-chip"
              }
              onClick={() =>
                setActiveGroupId(activeGroupId === group.id ? null : group.id)
              }
            >
              <strong>{group.name || "Untitled group"}</strong>
              {group.description && (
                <p style={{ margin: "0.5rem 0 0", fontWeight: 400 }}>
                  {group.description}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {activeGroup && (
        <div className="section" style={{ padding: "2rem 0" }}>
          <h2>{activeGroup.name || "Untitled group"}</h2>
          <p>{activeGroup.description || "Not available"}</p>

          <h3>Members</h3>
          {relatedResearchers.length === 0 ? (
            <EmptyState message="No members linked to this group yet." />
          ) : (
            <ul>
              {relatedResearchers.map((r) => (
                <li key={r.id}>
                  <Link to={`/researchers/${r.id}`}>{r.name}</Link>
                </li>
              ))}
            </ul>
          )}

          <h3>Projects</h3>
          {relatedProjects.length === 0 ? (
            <EmptyState message="No projects linked to this group yet." />
          ) : (
            <ul>
              {relatedProjects.map((p) => (
                <li key={p.id}>
                  <Link to={`/projects/${p.id}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
