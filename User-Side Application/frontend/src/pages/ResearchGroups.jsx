import { useState } from "react";
import { Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import {
  getResearchGroups,
  getResearchGroup,
} from "../api/researchGroups";
import PageHero from "../components/PageHero";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ResearchGroups() {
  const groupsState = useApiData(
    () => getResearchGroups(),
    []
  );

  const [activeGroupId, setActiveGroupId] = useState(null);

  const groups = groupsState.data?.data || [];

  const detailState = useApiData(
    () =>
      activeGroupId
        ? getResearchGroup(activeGroupId)
        : Promise.resolve(null),
    [activeGroupId]
  );

  const activeGroup = detailState.data?.data;

  const researchers = activeGroup?.researchers || [];
  const projects = activeGroup?.projects || [];

  function selectGroup(id) {
    setActiveGroupId(
      activeGroupId === id ? null : id
    );
  }

  return (
    <div className="research-groups-page">

      <PageHero
        accent="purple"
        kicker="Research Network"
        title="Stronger"
        accentWord="together."
        description="Standing research communities connecting people, projects and shared areas of inquiry."
        stat={{
          number: String(groups.length).padStart(2, "0"),
          label: groups.length === 1 ? "Group" : "Groups",
        }}
      />

      {groupsState.loading && (
        <LoadingState count={4} />
      )}

      {groupsState.error && (
        <ErrorState onRetry={groupsState.reload} />
      )}

      {!groupsState.loading &&
        !groupsState.error &&
        groups.length === 0 && (
          <EmptyState message="No research groups configured yet." />
        )}

      {/* GROUP INDEX */}
      {!groupsState.loading &&
        !groupsState.error &&
        groups.length > 0 && (

        <section className="research-group-index">

          {groups.map((group, index) => (
            <button
              key={group.id}
              type="button"
              className={
                activeGroupId === group.id
                  ? "research-group-entry active"
                  : "research-group-entry"
              }
              onClick={() => selectGroup(group.id)}
            >

              <span className="research-group-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="research-group-name">
                {group.name}
              </span>

              <span className="research-group-description">
                {group.description}
              </span>

              <span className="research-group-arrow">
                {activeGroupId === group.id ? "−" : "→"}
              </span>

            </button>
          ))}

        </section>
      )}

      {/* CONNECTION DETAIL */}
      {activeGroupId && (
        <section className="research-group-detail">

          {detailState.loading && (
            <LoadingState count={2} />
          )}

          {detailState.error && (
            <ErrorState onRetry={detailState.reload} />
          )}

          {!detailState.loading &&
            !detailState.error &&
            activeGroup && (

            <>

              <div className="research-group-detail-header">

                <div>
                  <p className="research-page-eyebrow">
                    RESEARCH GROUP
                  </p>

                  <h2>
                    {activeGroup.name}
                  </h2>

                  <p>
                    {activeGroup.description}
                  </p>
                </div>

                <div className="research-group-stats">
                  <div>
                    <strong>{researchers.length}</strong>
                    <span>Researchers</span>
                  </div>

                  <div>
                    <strong>{projects.length}</strong>
                    <span>Projects</span>
                  </div>
                </div>

              </div>

              <div className="research-group-columns">

                {/* PEOPLE */}
                <div className="research-group-column">

                  <div className="research-group-column-title">
                    <span>01</span>
                    <h3>Researchers</h3>
                  </div>

                  {researchers.length === 0 ? (
                    <EmptyState message="No members linked to this group yet." />
                  ) : (
                    <div className="research-group-links">

                      {researchers.map((researcher) => (
                        <Link
                          key={researcher.id}
                          to={`/researchers/${researcher.id}`}
                          className="research-group-link"
                        >
                          <span>
                            {researcher.name}
                          </span>

                          <span>→</span>
                        </Link>
                      ))}

                    </div>
                  )}

                </div>

                {/* PROJECTS */}
                <div className="research-group-column">

                  <div className="research-group-column-title">
                    <span>02</span>
                    <h3>Projects</h3>
                  </div>

                  {projects.length === 0 ? (
                    <EmptyState message="No projects linked to this group yet." />
                  ) : (
                    <div className="research-group-links">

                      {projects.map((project) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className="research-group-link"
                        >
                          <span>
                            {project.title}
                          </span>

                          <span>→</span>
                        </Link>
                      ))}

                    </div>
                  )}

                </div>

              </div>

            </>
          )}

        </section>
      )}

    </div>
  );
}