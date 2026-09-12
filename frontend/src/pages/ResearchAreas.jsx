import { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";

import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import {
  getResearchAreas,
  getResearchArea,
} from "../api/researchAreas";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ResearchAreas() {
  const detailRef = useRef(null);
  const [params, setParams] = useSearchParams();

  // The URL is now the single source of truth.
  const selectedAreaId = params.get("area");

  // Load all areas
  const areasState = useApiData(
    () => getResearchAreas(),
    []
  );

  // Load selected area's connected data
  const detailState = useApiData(
    () =>
      selectedAreaId
        ? getResearchArea(selectedAreaId)
        : Promise.resolve(null),
    [selectedAreaId]
  );

  const areas = areasState.data?.data || [];
  const activeArea = detailState.data?.data || null;
  useEffect(() => {
  if (!selectedAreaId || !activeArea || detailState.loading) {
    return;
  }

  const timer = setTimeout(() => {
    detailRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);

  return () => clearTimeout(timer);
}, [selectedAreaId, activeArea, detailState.loading]);

  function selectArea(id) {
    const idString = String(id);

    if (selectedAreaId === idString) {
      setParams({});
    } else {
      setParams({ area: idString });
    }
  }

  return (
    <div className="research-areas-page">
      <BackButton />

      {/* HEADER */}
      <header className="research-areas-header">
        <div>
          <p className="section-eyebrow">RESEARCH DIRECTORY</p>

          <h1>Research Areas</h1>

          <p className="research-areas-intro">
            Explore the research themes within the R&amp;D ecosystem
            and discover the people, projects, publications and
            activities connected to each area.
          </p>
        </div>

        {!areasState.loading && areas.length > 0 && (
          <span className="research-area-count">
            {areas.length} areas
          </span>
        )}
      </header>

      {/* AREA INDEX */}
      <section className="research-area-index">
        <div className="research-area-index-header">
          <div>
            <p className="section-eyebrow">BROWSE</p>
            <h2>Research Areas</h2>
          </div>

          <span>
            Select an area to explore its connections
          </span>
        </div>

        {areasState.loading && (
          <LoadingState count={6} />
        )}

        {areasState.error && (
          <ErrorState onRetry={areasState.reload} />
        )}

        {!areasState.loading &&
          !areasState.error &&
          areas.length === 0 && (
            <EmptyState message="No research areas configured yet." />
          )}

        {!areasState.loading &&
          !areasState.error &&
          areas.length > 0 && (
            <div className="research-area-list">
              {areas.map((area, index) => {
                const isActive =
                  selectedAreaId === String(area.id);

                return (
                  <button
                    key={area.id}
                    type="button"
                    className={
                      isActive
                        ? "research-area-row active"
                        : "research-area-row"
                    }
                    onClick={() => selectArea(area.id)}
                  >
                    <span className="research-area-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="research-area-name">
                      {area.name}
                    </span>

                    <span className="research-area-description">
                      {area.description ||
                        "Explore research connected to this area."}
                    </span>

                    <span className="research-area-arrow">
                      {isActive ? "−" : "→"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
      </section>

      {/* SELECTED AREA */}
      {selectedAreaId && (
        <section
  ref={detailRef}
  className="research-area-detail"
>
          {detailState.loading && (
            <LoadingState count={3} />
          )}

          {detailState.error && (
            <ErrorState onRetry={detailState.reload} />
          )}

          {!detailState.loading &&
            !detailState.error &&
            activeArea && (
              <>
                {/* AREA HEADER */}
                <header className="research-area-detail-header">
                  <div>
                    <p className="section-eyebrow">
                      RESEARCH AREA
                    </p>

                    <h2>{activeArea.name}</h2>

                    {activeArea.description && (
                      <p>{activeArea.description}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="research-area-close"
                    onClick={() => setParams({})}
                  >
                    Close
                  </button>
                </header>

                <div className="research-area-connections">

                  {/* PROJECTS */}
                  <div className="research-connection-block">
                    <div className="research-connection-heading">
                      <div>
                        <p className="section-eyebrow">
                          CONNECTED WORK
                        </p>
                        <h3>Projects</h3>
                      </div>

                      <span>
                        {activeArea.projects?.length || 0}
                      </span>
                    </div>

                    {!activeArea.projects?.length ? (
                      <EmptyState message="No projects tagged with this area yet." />
                    ) : (
                      <div className="research-connection-list">
                        {activeArea.projects.map((project) => (
                          <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="research-connection-item"
                          >
                            <div>
                              <span className="connection-type">
                                PROJECT
                              </span>

                              <h4>{project.title}</h4>

                              {project.description && (
                                <p>{project.description}</p>
                              )}
                            </div>

                            <span className="connection-arrow">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RESEARCHERS */}
                  <div className="research-connection-block">
                    <div className="research-connection-heading">
                      <div>
                        <p className="section-eyebrow">
                          PEOPLE
                        </p>
                        <h3>Researchers</h3>
                      </div>

                      <span>
                        {activeArea.researchers?.length || 0}
                      </span>
                    </div>

                    {!activeArea.researchers?.length ? (
                      <EmptyState message="No researchers tagged with this area yet." />
                    ) : (
                      <div className="research-people-list">
                        {activeArea.researchers.map((researcher) => (
                          <Link
                            key={researcher.id}
                            to={`/researchers/${researcher.id}`}
                            className="research-person-item"
                          >
                            <div>
                              <span className="connection-type">
                                RESEARCHER
                              </span>

                              <h4>{researcher.name}</h4>

                              {researcher.position && (
                                <p>{researcher.position}</p>
                              )}
                            </div>

                            <span className="connection-arrow">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PUBLICATIONS */}
                  <div className="research-connection-block">
                    <div className="research-connection-heading">
                      <div>
                        <p className="section-eyebrow">
                          RESEARCH OUTPUT
                        </p>
                        <h3>Publications</h3>
                      </div>

                      <span>
                        {activeArea.publications?.length || 0}
                      </span>
                    </div>

                    {!activeArea.publications?.length ? (
                      <EmptyState message="No publications connected to this area yet." />
                    ) : (
                      <div className="research-connection-list">
                        {activeArea.publications.map((publication) => (
                          <Link
                            key={publication.id}
                            to={`/publications/${publication.id}`}
                            className="research-connection-item"
                          >
                            <div>
                              <span className="connection-type">
                                PUBLICATION
                              </span>

                              <h4>{publication.title}</h4>

                              {publication.description && (
                                <p>{publication.description}</p>
                              )}
                            </div>

                            <span className="connection-arrow">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* EVENTS */}
                  <div className="research-connection-block">
                    <div className="research-connection-heading">
                      <div>
                        <p className="section-eyebrow">
                          ACTIVITY
                        </p>
                        <h3>Events</h3>
                      </div>

                      <span>
                        {activeArea.events?.length || 0}
                      </span>
                    </div>

                    {!activeArea.events?.length ? (
                      <EmptyState message="No events connected to this area yet." />
                    ) : (
                      <div className="research-connection-list">
                        {activeArea.events.map((event) => (
                          <Link
                            key={event.id}
                            to={`/events/${event.id}`}
                            className="research-connection-item"
                          >
                            <div>
                              <span className="connection-type">
                                EVENT
                              </span>

                              <h4>{event.title}</h4>

                              {event.start_at && (
                                <p>
                                  {new Date(
                                    event.start_at
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>

                            <span className="connection-arrow">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* GRANTS */}
                  <div className="research-connection-block">
                    <div className="research-connection-heading">
                      <div>
                        <p className="section-eyebrow">
                          FUNDING
                        </p>
                        <h3>Grants</h3>
                      </div>

                      <span>
                        {activeArea.grants?.length || 0}
                      </span>
                    </div>

                    {!activeArea.grants?.length ? (
                      <EmptyState message="No grants connected to this area yet." />
                    ) : (
                      <div className="research-connection-list">
                        {activeArea.grants.map((grant) => (
                          <Link
                            key={grant.id}
                            to={`/opportunities/${grant.id}`}
                            className="research-connection-item"
                          >
                            <div>
                              <span className="connection-type">
                                GRANT
                              </span>

                              <h4>{grant.title}</h4>

                              {grant.description && (
                                <p>{grant.description}</p>
                              )}
                            </div>

                            <span className="connection-arrow">
                              →
                            </span>
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