import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import {
  getProject,
  getRelatedProjects,
} from "../api/projects";
import RelatedResearch from "../components/RelatedResearch";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ProjectDetail() {
  const { id } = useParams();
  

  // ------------------------------------------------
  // PROJECT
  // ------------------------------------------------
  const projectState = useApiData(
    () => getProject(id),
    [id]
  );

  const project = projectState.data?.data;

  // ------------------------------------------------
  // DISCOVERY
  // ------------------------------------------------
  const relatedState = useApiData(
    () => getRelatedProjects(id),
    [id]
  );

  const related = relatedState.data?.data;

  // ------------------------------------------------
  // LOADING / ERROR
  // ------------------------------------------------
  if (projectState.loading) {
    return <LoadingState count={1} />;
  }

  if (projectState.error) {
    return (
      <ErrorState
        onRetry={projectState.reload}
      />
    );
  }

  if (!project) {
    return (
      <EmptyState message="Project not found." />
    );
  }

  // ------------------------------------------------
  // PEOPLE
  // ------------------------------------------------
  const researcherLinks =
    project.researcher_projects || [];

  const researchers = researcherLinks
    .map((item) => ({
      ...item.researchers,
      role: item.role,
    }))
    .filter((item) => item?.id);

  const leadResearchers = researchers.filter(
    (person) =>
      (person.role || "").toLowerCase() === "lead"
  );

  const mentors = researchers.filter((person) =>
    (person.role || "")
      .toLowerCase()
      .includes("mentor")
  );

  const teamMembers = researchers.filter(
    (person) =>
      (person.role || "").toLowerCase() !==
        "lead" &&
      !(person.role || "")
        .toLowerCase()
        .includes("mentor")
  );

  // ------------------------------------------------
  // PUBLICATIONS
  // ------------------------------------------------
  const publications =
    project.publications ||
    project.project_publications
      ?.map((item) => item.publications)
      .filter(Boolean) ||
    [];

  // ------------------------------------------------
  // RESEARCH AREAS
  // ------------------------------------------------
  const researchAreas =
    project.research_areas?.length
      ? project.research_areas
      : project.research_area
      ? [{ name: project.research_area }]
      : [];

  // ------------------------------------------------
  // GROUPS
  // ------------------------------------------------
  const researchGroups =
    project.research_groups || [];

  // ------------------------------------------------
  // EVENTS
  // ------------------------------------------------
  const events = project.events || [];

  // ------------------------------------------------
  // GRANTS
  // ------------------------------------------------
  const grants = project.grants || [];

  // ------------------------------------------------
  // PARTNERS
  // ------------------------------------------------
  const partners = project.partners || [];

  return (
    <div className="page-container detail-page">

      {/* ============================================
          BACK
          ============================================ */}
          <BackButton />


      {/* ============================================
          HEADER
          ============================================ */}
      <div className="detail-header">

        {project.status && (
          <span className="status-badge">
            {project.status}
          </span>
        )}

        <h1>{project.title}</h1>

        {project.description && (
          <p className="detail-lead">
            {project.description}
          </p>
        )}

        {(project.start_date ||
          project.end_date) && (
          <p className="meta-line">
            <strong>Timeline:</strong>{" "}
            {project.start_date || "—"} –{" "}
            {project.end_date || "Ongoing"}
          </p>
        )}
      </div>


      {/* ============================================
          RESEARCH AREAS
          ============================================ */}
      {researchAreas.length > 0 && (
        <section className="detail-section">
          <h3>Research Areas</h3>

          <div className="tag-row">
            {researchAreas.map((area) =>
              area?.id ? (
                <Link
                  key={area.id}
                  to={`/research-areas?area=${area.id}`}
                  className="tag"
                >
                  {area.name}
                </Link>
              ) : (
                <span
                  key={area?.name}
                  className="tag"
                >
                  {area?.name}
                </span>
              )
            )}
          </div>
        </section>
      )}


      {/* ============================================
          LEAD RESEARCHERS
          ============================================ */}
      {leadResearchers.length > 0 && (
        <section className="detail-section">
          <div className="section-heading">
            <p className="section-eyebrow">
              PEOPLE
            </p>
            <h2>Lead Researcher</h2>
          </div>

          <div className="related-list">
            {leadResearchers.map((researcher) => (
              <Link
                key={researcher.id}
                to={`/researchers/${researcher.id}`}
                className="related-item"
              >
                <span className="badge badge-type">
                  Lead Researcher
                </span>

                <h4>{researcher.name}</h4>

                <span className="discovery-link">
                  View profile →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          MENTORS
          ============================================ */}
      {mentors.length > 0 && (
        <section className="detail-section">

          <div className="section-heading">
            <p className="section-eyebrow">
              PEOPLE
            </p>

            <h2>Mentors</h2>

            <p className="section-description">
              Researchers supporting and mentoring
              this project.
            </p>
          </div>

          <div className="related-list">
            {mentors.map((mentor) => (
              <Link
                key={mentor.id}
                to={`/researchers/${mentor.id}`}
                className="related-item"
              >
                <span className="badge badge-type">
                  Mentor
                </span>

                <h4>{mentor.name}</h4>

                <span className="discovery-link">
                  View profile →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          RESEARCH TEAM
          ============================================ */}
      {teamMembers.length > 0 && (
        <section className="detail-section">

          <div className="section-heading">
            <p className="section-eyebrow">
              PEOPLE
            </p>

            <h2>Research Team</h2>
          </div>

          <div className="related-list">
            {teamMembers.map((researcher) => (
              <Link
                key={researcher.id}
                to={`/researchers/${researcher.id}`}
                className="related-item"
              >
                <h4>{researcher.name}</h4>

                {researcher.role && (
                  <p className="meta-line">
                    {researcher.role}
                  </p>
                )}

                <span className="discovery-link">
                  View profile →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          OBJECTIVES
          ============================================ */}
      {project.objectives && (
        <section className="detail-section">
          <h3>Objectives</h3>
          <p>{project.objectives}</p>
        </section>
      )}


      {/* ============================================
          OUTPUTS
          ============================================ */}
      {project.outputs_summary && (
        <section className="detail-section">
          <h3>Outputs</h3>
          <p>{project.outputs_summary}</p>
        </section>
      )}


      {/* ============================================
          RESEARCH GROUPS
          ============================================ */}
      {researchGroups.length > 0 && (
        <section className="detail-section">

          <div className="section-heading">
            <p className="section-eyebrow">
              RESEARCH COMMUNITY
            </p>

            <h2>Research Groups</h2>

            <p className="section-description">
              Groups connected to this research.
            </p>
          </div>

          <div className="tag-row">
            {researchGroups.map((group) => (
              <span
                key={group.id}
                className="tag"
              >
                {group.name}
              </span>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          PUBLICATIONS
          ============================================ */}
      {publications.length > 0 && (
        <section className="detail-section">

          <div className="section-heading">
            <p className="section-eyebrow">
              RESEARCH OUTPUT
            </p>

            <h2>Related Publications</h2>

            <p className="section-description">
              Publications directly connected to
              this project.
            </p>
          </div>

          <div className="related-list">
            {publications.map((publication) => (
              <Link
                key={publication.id}
                to={`/publications/${publication.id}`}
                className="related-item"
              >
                <span className="badge badge-type">
                  Publication
                </span>

                <h4>{publication.title}</h4>

                {publication.year && (
                  <p className="meta-line">
                    {publication.year}
                  </p>
                )}

                {publication.publication_type && (
                  <p className="meta-line">
                    {publication.publication_type}
                  </p>
                )}

                <span className="discovery-link">
                  View publication →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          EVENTS
          ============================================ */}
      {events.length > 0 && (
        <section className="detail-section">

          <div className="section-heading">
            <p className="section-eyebrow">
              RESEARCH COMMUNITY
            </p>

            <h2>Related Events</h2>

            <p className="section-description">
              Events connected to this project.
            </p>
          </div>

          <div className="related-list">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="related-item"
              >
                <span className="badge badge-type">
                  Event
                </span>

                <h4>{event.title}</h4>

                {event.start_at && (
                  <p className="meta-line">
                    {event.start_at}
                  </p>
                )}

                <span className="discovery-link">
                  View event →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          GRANTS
          ============================================ */}
      {grants.length > 0 && (
        <section className="detail-section">

          <div className="section-heading">
            <p className="section-eyebrow">
              RESEARCH SUPPORT
            </p>

            <h2>Related Grants</h2>

            <p className="section-description">
              Funding opportunities connected to
              this project.
            </p>
          </div>

          <div className="related-list">
            {grants.map((grant) => (
              <Link
                key={grant.id}
                to={`/opportunities/${grant.id}`}
                className="related-item"
              >
                <span className="badge badge-type">
                  Grant
                </span>

                <h4>{grant.title}</h4>

                {grant.description && (
                  <p className="muted">
                    {grant.description}
                  </p>
                )}

                {grant.status && (
                  <p className="meta-line">
                    {grant.status}
                  </p>
                )}

                <span className="discovery-link">
                  View grant →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          PARTNERS
          ============================================ */}
      {partners.length > 0 && (
        <section className="detail-section">

          <div className="section-heading">
            <p className="section-eyebrow">
              COLLABORATION
            </p>

            <h2>Partners</h2>
          </div>

          <div className="tag-row">
            {partners.map((partner) => (
              <span
                key={partner.id}
                className="tag"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </section>
      )}


      {/* ============================================
          EXTERNAL RESOURCE
          ============================================ */}
      {project.external_url && (
        <div className="detail-section">
          <a
            href={project.external_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            View external resource
          </a>
        </div>
      )}


      {/* ============================================
          SEMANTIC DISCOVERY
          ============================================ */}
      {!relatedState.loading && related && (
        <RelatedResearch
          similar={related.similar}
          more={related.moreByResearcher}
          moreLabel={
            leadResearchers.length > 0
              ? `More by ${leadResearchers[0].name}`
              : "More by this researcher"
          }
          moreType="project"
        />
      )}

    </div>
  );
}