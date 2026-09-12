import { useParams, Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getResearcher } from "../api/researchers";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ResearcherDetail() {
  const { id } = useParams();

  const {
    data,
    loading,
    error,
    reload,
  } = useApiData(() => getResearcher(id), [id]);

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

  return (
    <div className="page-container researcher-profile">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-circle avatar-large" aria-hidden="true">
          {researcher.name?.charAt(0)}
        </div>

        <div>
          <h1>{researcher.name}</h1>

          <p className="muted">
            {researcher.position || "Researcher"}
          </p>

          {researcher.bio && (
            <p className="profile-bio">
              {researcher.bio}
            </p>
          )}

          <div className="profile-links">
            {researcher.email && (
              <a href={`mailto:${researcher.email}`}>
                Email
              </a>
            )}

            {researcher.profile_url && (
              <a
                href={researcher.profile_url}
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>
            )}

            {researcher.orcid_url && (
              <a
                href={researcher.orcid_url}
                target="_blank"
                rel="noreferrer"
              >
                ORCID
              </a>
            )}

            {researcher.google_scholar_url && (
              <a
                href={researcher.google_scholar_url}
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-grid">

        <main className="profile-main">

          {/* Research Areas */}
          {researcher.research_areas?.length > 0 && (
            <div className="info-card">
              <h3>Research Areas</h3>

              <div className="tag-row">
                {researcher.research_areas.map((area) => (
                  <span className="tag" key={area}>
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {researcher.bio && (
            <div className="info-card">
              <h3>About</h3>
              <p>{researcher.bio}</p>
            </div>
          )}

          {/* Projects */}
          <div className="info-card">
            <h3>Projects</h3>

            {projects.length === 0 ? (
              <EmptyState message="No projects listed for this researcher yet." />
            ) : (
              <div className="related-list">
                {projects.map((item) => {
                  const project = item.projects;

                  if (!project) return null;

                  return (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="related-item"
                    >
                      <div>
                        <span className="badge badge-type">
                          {item.role || "Researcher"}
                        </span>

                        <h4>{project.title}</h4>

                        {project.status && (
                          <p className="muted">
                            Status: {project.status}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Publications */}
          <div className="info-card">
            <h3>Publications</h3>

            {publications.length === 0 ? (
              <EmptyState message="No publications listed for this researcher yet." />
            ) : (
              <div className="related-list">
                {publications.map((item) => {
                  const publication = item.publications;

                  if (!publication) return null;

                  return (
                    <Link
                      key={publication.id}
                      to={`/publications/${publication.id}`}
                      className="related-item"
                    >
                      <div>
                        <span className="badge badge-type">
                          Publication
                        </span>

                        <h4>{publication.title}</h4>

                        {publication.publication_year && (
                          <p className="muted">
                            {publication.publication_year}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </main>

        {/* Sidebar */}
        <aside className="profile-sidebar">

          <div className="info-card">
            <h3>Researcher Stats</h3>

            <p className="muted">
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </p>

            <p className="muted">
              {publications.length}{" "}
              {publications.length === 1
                ? "publication"
                : "publications"}
            </p>
          </div>

          {researcher.status && (
            <div className="info-card">
              <h3>Status</h3>
              <p>{researcher.status}</p>
            </div>
          )}

        </aside>

      </div>
    </div>
  );
}