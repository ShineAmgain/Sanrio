import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import { getProject, getRelatedProjects } from "../api/projects";
import RelatedResearch from "../components/RelatedResearch";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function RelatedItem({ to, label, title, meta, description }) {
  return (
    <Link to={to} className="project-detail-related-item">
      {label && <span className="project-detail-related-label">{label}</span>}
      <h4>{title}</h4>
      {meta && <p>{meta}</p>}
      {description && <p>{description}</p>}
      <span className="project-detail-related-link">View details →</span>
    </Link>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const projectState = useApiData(() => getProject(id), [id]);
  const relatedState = useApiData(() => getRelatedProjects(id), [id]);
  const project = projectState.data?.data;
  const related = relatedState.data?.data;

  if (projectState.loading) return <LoadingState count={1} />;
  if (projectState.error) return <ErrorState onRetry={projectState.reload} />;
  if (!project) return <EmptyState message="Project not found." />;

  const researcherLinks = project.researcher_projects || [];
  const researchers = researcherLinks
    .map((item) => ({ ...item.researchers, role: item.role }))
    .filter((item) => item?.id);

  const leadResearchers = researchers.filter(
    (person) => (person.role || "").toLowerCase() === "lead"
  );
  const mentors = researchers.filter((person) =>
    (person.role || "").toLowerCase().includes("mentor")
  );
  const teamMembers = researchers.filter((person) => {
    const role = (person.role || "").toLowerCase();
    return role !== "lead" && !role.includes("mentor");
  });

  const publications =
    project.publications ||
    project.project_publications?.map((item) => item.publications).filter(Boolean) ||
    [];

  const researchAreas = project.research_areas?.length
    ? project.research_areas
    : project.research_area
      ? [{ name: project.research_area }]
      : [];

  const researchGroups = project.research_groups || [];
  const events = project.events || [];
  const grants = project.grants || [];
  const partners = project.partners || [];

  return (
    <div className="page-container project-detail-page">
      <BackButton />

      <header className="project-detail-header">
        <div className="project-detail-header-main">
          <p className="page-eyebrow">RESEARCH PROJECT</p>
          <h1>{project.title}</h1>
          {project.description && <p className="project-detail-summary">{project.description}</p>}
        </div>

        <div className="project-detail-status-column">
          {project.status && (
            <span className={`status-badge status-${project.status.toLowerCase()}`}>
              {project.status}
            </span>
          )}
          {(project.start_date || project.end_date) && (
            <div className="project-detail-date">
              <span>Timeline</span>
              <strong>{project.start_date || "—"} – {project.end_date || "Ongoing"}</strong>
            </div>
          )}
        </div>
      </header>

      <div className="project-detail-layout">
        <main className="project-detail-main">
          {(project.objectives || project.outputs_summary) && (
            <section className="project-detail-section project-detail-overview">
              <p className="project-detail-section-label">OVERVIEW</p>
              <h2>Project overview</h2>
              {project.objectives && (
                <div className="project-detail-copy-block">
                  <h3>Objectives</h3>
                  <p>{project.objectives}</p>
                </div>
              )}
              {project.outputs_summary && (
                <div className="project-detail-copy-block">
                  <h3>Outputs</h3>
                  <p>{project.outputs_summary}</p>
                </div>
              )}
            </section>
          )}

          {leadResearchers.length > 0 && (
            <section className="project-detail-section">
              <p className="project-detail-section-label">PEOPLE</p>
              <h2>Lead researcher</h2>
              <div className="project-detail-people-grid">
                {leadResearchers.map((person) => (
                  <Link key={person.id} to={`/researchers/${person.id}`} className="project-detail-person">
                    <span className="project-detail-person-role">Lead researcher</span>
                    <strong>{person.name}</strong>
                    <span>View profile →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {mentors.length > 0 && (
            <section className="project-detail-section">
              <p className="project-detail-section-label">PEOPLE</p>
              <h2>Mentors</h2>
              <div className="project-detail-related-grid">
                {mentors.map((person) => (
                  <RelatedItem key={person.id} to={`/researchers/${person.id}`} label="Mentor" title={person.name} />
                ))}
              </div>
            </section>
          )}

          {teamMembers.length > 0 && (
            <section className="project-detail-section">
              <p className="project-detail-section-label">PEOPLE</p>
              <h2>Research team</h2>
              <div className="project-detail-related-grid">
                {teamMembers.map((person) => (
                  <RelatedItem key={person.id} to={`/researchers/${person.id}`} title={person.name} meta={person.role} />
                ))}
              </div>
            </section>
          )}

          {publications.length > 0 && (
            <section className="project-detail-section">
              <p className="project-detail-section-label">RESEARCH OUTPUT</p>
              <h2>Related publications</h2>
              <div className="project-detail-related-grid">
                {publications.map((publication) => (
                  <RelatedItem
                    key={publication.id}
                    to={`/publications/${publication.id}`}
                    label="Publication"
                    title={publication.title}
                    meta={[publication.year, publication.publication_type].filter(Boolean).join(" · ")}
                  />
                ))}
              </div>
            </section>
          )}

          {events.length > 0 && (
            <section className="project-detail-section">
              <p className="project-detail-section-label">RESEARCH COMMUNITY</p>
              <h2>Related events</h2>
              <div className="project-detail-related-grid">
                {events.map((event) => (
                  <RelatedItem key={event.id} to={`/events/${event.id}`} label="Event" title={event.title} meta={event.start_at} />
                ))}
              </div>
            </section>
          )}

          {grants.length > 0 && (
            <section className="project-detail-section">
              <p className="project-detail-section-label">RESEARCH SUPPORT</p>
              <h2>Related grants</h2>
              <div className="project-detail-related-grid">
                {grants.map((grant) => (
                  <RelatedItem key={grant.id} to={`/opportunities/${grant.id}`} label="Grant" title={grant.title} meta={grant.status} description={grant.description} />
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="project-detail-sidebar">
          <section className="project-detail-info-card">
            <div className="project-detail-card-heading">
              <span>PROJECT INFORMATION</span>
            </div>

            {researchAreas.length > 0 && (
              <div className="project-detail-info-row">
                <span>Research area</span>
                <div className="project-detail-tags">
                  {researchAreas.map((area) => area?.id ? (
                    <Link key={area.id} to={`/research-areas?area=${area.id}`} className="project-detail-tag">{area.name}</Link>
                  ) : <span key={area?.name} className="project-detail-tag">{area?.name}</span>)}
                </div>
              </div>
            )}

            {researchGroups.length > 0 && (
              <div className="project-detail-info-row">
                <span>Research group</span>
                <div className="project-detail-tags">
                  {researchGroups.map((group) => <span key={group.id} className="project-detail-tag">{group.name}</span>)}
                </div>
              </div>
            )}

            {partners.length > 0 && (
              <div className="project-detail-info-row">
                <span>Partners</span>
                <div className="project-detail-tags">
                  {partners.map((partner) => <span key={partner.id} className="project-detail-tag">{partner.name}</span>)}
                </div>
              </div>
            )}
          </section>

          {project.external_url && (
            <a href={project.external_url} target="_blank" rel="noreferrer" className="project-detail-external-link">
              <span>External resource</span>
              <strong>Open resource →</strong>
            </a>
          )}
        </aside>
      </div>

      {!relatedState.loading && related && (
        <RelatedResearch
          similar={related.similar}
          more={related.moreByResearcher}
          moreLabel={leadResearchers.length > 0 ? `More by ${leadResearchers[0].name}` : "More by this researcher"}
          moreType="project"
        />
      )}
    </div>
  );
}
