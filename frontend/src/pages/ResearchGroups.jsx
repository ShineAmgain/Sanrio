import { useState } from "react";
import { Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getResearchGroups, getResearchGroup } from "../api/researchGroups";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// Research Groups are distinct from Research Areas: an area is a taxonomy
// tag (e.g. "AI"), a group is a standing team people belong to (via the
// researcher_research_groups / project_research_groups join tables).
export default function ResearchGroups() {
  const groupsState = useApiData(() => getResearchGroups(), []);
  const [activeGroupId, setActiveGroupId] = useState(null);

  const groups = groupsState.data?.data || [];

  // Membership comes through the junction tables, fetched live for the
  // selected group only — same pattern as the Research Areas page.
  const detailState = useApiData(
    () => (activeGroupId ? getResearchGroup(activeGroupId) : Promise.resolve(null)),
    [activeGroupId]
  );
  const activeGroup = detailState.data?.data;
  const relatedResearchers = activeGroup?.researchers || [];
  const relatedProjects = activeGroup?.projects || [];

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

      {activeGroupId && (
        <div className="section" style={{ padding: "2rem 0" }}>
          {detailState.loading && <LoadingState count={2} />}
          {detailState.error && <ErrorState onRetry={detailState.reload} />}

          {!detailState.loading && !detailState.error && activeGroup && (
        <>
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
        </>
          )}
        </div>
      )}
    </div>
  );
}
