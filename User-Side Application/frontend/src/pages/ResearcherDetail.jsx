import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import { getResearcher } from "../api/researchers";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ResearcherDetail() {
  const { id } = useParams();
  const [showAllProjects, setShowAllProjects] = useState(false);

  const { data, loading, error, reload } = useApiData(
    () => getResearcher(id),
    [id]
  );

  const researcher = data?.data;

  if (loading) return <LoadingState count={1} />;

  if (error) {
    return <ErrorState onRetry={reload} />;
  }

  if (!researcher) {
    return <EmptyState message="Researcher not found." />;
  }

  const projects = researcher.researcher_projects || [];
  const publications = researcher.researcher_publications || [];
  const researchAreas = researcher.research_areas || [];

  const initials = researcher.name
    ? researcher.name
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
    : "?";

  return (
    <div className="page-container researcher-reference-page">
      <div className="researcher-reference-inner">

        <div className="researcher-back-row">
          <BackButton />
        </div>

        {/* PROFILE HEADER */}
        <section className="researcher-profile-hero">

          <div className="researcher-profile-avatar" aria-hidden="true">
            {researcher.avatar_url ? (
              <img
                src={researcher.avatar_url}
                alt=""
                className="researcher-profile-avatar-img"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="researcher-profile-info">

            <span className="researcher-profile-label">
              RESEARCHER PROFILE
            </span>

            <h1>{researcher.name}</h1>

            <p className="researcher-position">
              {researcher.position || "Researcher"}
            </p>

            <div className="researcher-contact-row">

              {researcher.address && (
                <span className="researcher-contact-link">
                  <span className="researcher-contact-icon">⌖</span>
                  {researcher.address}
                </span>
              )}

              {researcher.email && (
                <a
                  href={`mailto:${researcher.email}`}
                  className="researcher-contact-link"
                >
                  <span className="researcher-contact-icon">✉</span>
                  Email
                </a>
              )}

              {researcher.linkedin_url && (
                <a
                  href={researcher.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="researcher-contact-link"
                >
                  <span className="researcher-contact-icon">in</span>
                  LinkedIn
                </a>
              )}

            </div>

            {researcher.bio && (
              <p className="researcher-short-bio">
                {researcher.bio}
              </p>
            )}

          </div>

        </section>

        {/* MAIN CONTENT */}
        <div className="researcher-main-grid">

          <main className="researcher-left-column">

            {/* RESEARCH OVERVIEW */}
            {(researchAreas.length > 0 || researcher.bio) && (
              <section className="researcher-overview-card">

                {researchAreas.length > 0 && (
                  <div className="researcher-overview-block">

                    <div className="researcher-section-heading">
                      <span className="researcher-heading-icon">
                        +
                      </span>

                      <div>
                        <span className="researcher-heading-label">
                          EXPERTISE
                        </span>

                        <h2>Research Interests</h2>
                      </div>
                    </div>

                    <div className="researcher-interest-row">
                      {researchAreas.map((area) =>
                        area?.id ? (
                          <Link
                            key={area.id}
                            to={`/research-areas?area=${area.id}`}
                            className="researcher-interest-tag"
                          >
                            {area.name}
                          </Link>
                        ) : (
                          <span
                            className="researcher-interest-tag"
                            key={area?.name || area}
                          >
                            {area?.name || area}
                          </span>
                        )
                      )}
                    </div>

                  </div>
                )}

                {researcher.bio && (
                  <div
                    className={`researcher-overview-block ${
                      researchAreas.length > 0
                        ? "researcher-about-block"
                        : ""
                    }`}
                  >

                    <div className="researcher-section-heading">
                      <span className="researcher-heading-icon">
                        i
                      </span>

                      <div>
                        <span className="researcher-heading-label">
                          PROFILE
                        </span>

                        <h2>About</h2>
                      </div>
                    </div>

                    <p className="researcher-about-text">
                      {researcher.bio}
                    </p>

                  </div>
                )}

              </section>
            )}

            {/* PROJECTS */}
            <section className="researcher-project-section">

              <div className="researcher-section-header">

                <div>
                  <span className="researcher-section-kicker">
                    RESEARCH ACTIVITY
                  </span>

                  <h2 className="researcher-section-title">
                    Projects
                  </h2>
                </div>

                <span className="researcher-section-count">
                  {projects.length}
                  {projects.length === 1 ? " project" : " projects"}
                </span>

              </div>

              <div className="researcher-project-layout">

                <div className="researcher-project-list">

                  {projects.length === 0 ? (
                    <div className="researcher-empty">
                      No projects listed for this researcher yet.
                    </div>
                  ) : (
                    (showAllProjects ? projects : projects.slice(0, 3)).map((item) => {
                      const project = item.projects;

                      if (!project) return null;

                      return (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className="researcher-project-card"
                        >

                          <div className="researcher-project-number">
                            →
                          </div>

                          <div className="researcher-project-content">

                            <div className="researcher-project-top">
                              <span className="researcher-project-label">
                                PROJECT
                              </span>

                              <span
                                className={`researcher-project-status ${
                                  project.status ? "" : "inactive"
                                }`}
                              >
                                {project.status || "Completed"}
                              </span>
                            </div>

                            <h4>{project.title}</h4>

                            <span className="researcher-project-role">
                              {item.role || "Researcher"}
                            </span>

                            {project.status && (
                              <p className="researcher-project-meta">
                                <strong>Status</strong>
                                {project.status}
                              </p>
                            )}

                          </div>

                        </Link>
                      );
                    })
                  )}

                  {projects.length > 3 && (
                    <button
                      type="button"
                      className="researcher-explore-button researcher-projects-toggle"
                      onClick={() => setShowAllProjects((prev) => !prev)}
                    >
                      {showAllProjects
                        ? "Show fewer projects"
                        : `View all ${projects.length} projects`}
                      <span>{showAllProjects ? "↑" : "→"}</span>
                    </button>
                  )}

                </div>

                {/* STATS */}
                <aside className="researcher-stats-card">

                  <span className="researcher-stats-kicker">
                    OVERVIEW
                  </span>

                  <h3>Researcher Stats</h3>

                  <div className="researcher-stats-list">

                    <div className="researcher-stat">
                      <span className="researcher-stat-number">
                        {projects.length}
                      </span>

                      <span className="researcher-stat-label">
                        {projects.length === 1
                          ? "Project"
                          : "Projects"}
                      </span>
                    </div>

                    <div className="researcher-stat">
                      <span className="researcher-stat-number">
                        {publications.length}
                      </span>

                      <span className="researcher-stat-label">
                        {publications.length === 1
                          ? "Publication"
                          : "Publications"}
                      </span>
                    </div>

                  </div>

                </aside>

              </div>

            </section>

            {/* RESEARCH */}
            {publications.length > 0 && (
              <section className="researcher-research-section">

                <div className="researcher-section-header">

                  <div>
                    <span className="researcher-section-kicker">
                      SCHOLARLY WORK
                    </span>

                    <h2 className="researcher-section-title">
                      Research
                    </h2>
                  </div>

                  {publications.length > 2 && (
                    <Link
                      to="/publications"
                      className="researcher-explore-button"
                    >
                      Explore all
                      <span>→</span>
                    </Link>
                  )}

                </div>

                <div className="researcher-research-list">

                  {publications.slice(0, 2).map((item) => {
                    const publication = item.publications;

                    if (!publication) return null;

                    return (
                      <article
                        key={publication.id}
                        className="researcher-research-card"
                      >

                        <span className="researcher-research-type">
                          PUBLICATION
                        </span>

                        <h4>{publication.title}</h4>

                        <p>
                          {publication.abstract ||
                            publication.description ||
                            "Research publication and scholarly work by this researcher."}
                        </p>

                        <Link
                          to={`/publications/${publication.id}`}
                          className="researcher-view-button"
                        >
                          View publication
                          <span>→</span>
                        </Link>

                      </article>
                    );
                  })}

                </div>

              </section>
            )}

            {/* PUBLICATIONS */}
            {publications.length > 0 && (
              <section className="researcher-publications-section">

                <div className="researcher-section-header">

                  <div>
                    <span className="researcher-section-kicker">
                      BIBLIOGRAPHY
                    </span>

                    <h2 className="researcher-section-title">
                      Publications
                    </h2>
                  </div>

                  <span className="researcher-section-count">
                    {publications.length}
                    {publications.length === 1
                      ? " publication"
                      : " publications"}
                  </span>

                </div>

                <div className="researcher-publication-list">

                  {publications.map((item) => {
                    const publication = item.publications;

                    if (!publication) return null;

                    return (
                      <Link
                        key={publication.id}
                        to={`/publications/${publication.id}`}
                        className="researcher-publication-card"
                      >

                        <div className="researcher-publication-main">

                          <span className="researcher-publication-label">
                            PUBLICATION
                          </span>

                          <h4>{publication.title}</h4>

                        </div>

                        {publication.publication_year && (
                          <span className="researcher-publication-year">
                            {publication.publication_year}
                          </span>
                        )}

                        <span className="researcher-publication-arrow">
                          →
                        </span>

                      </Link>
                    );
                  })}

                </div>

              </section>
            )}

          </main>

          {/* SIDEBAR */}
          <aside className="researcher-sidebar">

            <div className="researcher-links-card">

              <div className="researcher-sidebar-heading">
                <span className="researcher-sidebar-kicker">
                  ONLINE PRESENCE
                </span>

                <h3>Research Profiles</h3>
              </div>

              <div className="researcher-external-links">

                {researcher.orcid_url && (
                  <a
                    className="researcher-external-link"
                    href={researcher.orcid_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="researcher-external-icon orcid-icon">
                      iD
                    </span>

                    <span className="researcher-external-text">
                      <strong>ORCID</strong>
                      <span>View ORCID profile</span>
                    </span>

                    <span className="researcher-external-arrow">
                      ↗
                    </span>
                  </a>
                )}

                {researcher.google_scholar_url && (
                  <a
                    className="researcher-external-link"
                    href={researcher.google_scholar_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="researcher-external-icon scholar-icon">
                      ◆
                    </span>

                    <span className="researcher-external-text">
                      <strong>Google Scholar</strong>
                      <span>View scholarly profile</span>
                    </span>

                    <span className="researcher-external-arrow">
                      ↗
                    </span>
                  </a>
                )}

                {researcher.profile_url && (
                  <a
                    className="researcher-external-link"
                    href={researcher.profile_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="researcher-external-icon website-icon">
                      ◉
                    </span>

                    <span className="researcher-external-text">
                      <strong>Website / Profile</strong>
                      <span>Visit external profile</span>
                    </span>

                    <span className="researcher-external-arrow">
                      ↗
                    </span>
                  </a>
                )}

              </div>

              {!researcher.orcid_url &&
                !researcher.google_scholar_url &&
                !researcher.profile_url && (
                  <div className="researcher-no-links">
                    No external research profiles available.
                  </div>
                )}

            </div>

            {researcher.status && (
              <div className="researcher-status-card">

                <div className="researcher-status-top">
                  <span className="researcher-status-dot"></span>
                  <span>Current Status</span>
                </div>

                <p>{researcher.status}</p>

              </div>
            )}

          </aside>

        </div>

      </div>
    </div>
  );
}