import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  const primaryArea = project.research_areas?.[0];

  return (
    <article className="project-card project-card-clean">
      <div className="project-card-main">
        <div className="project-card-topline">
          <span className="project-label">PROJECT</span>
          {project.status && (
            <span className={`status-badge status-${project.status.toLowerCase()}`}>
              {project.status}
            </span>
          )}
        </div>

        <h3>{project.title}</h3>

        {project.description && (
          <p className="card-snippet">{project.description}</p>
        )}

        {primaryArea?.id ? (
          <Link to={`/research-areas?area=${primaryArea.id}`} className="project-area-link">
            {primaryArea.name}
          </Link>
        ) : project.research_area ? (
          <span className="project-area-link">{project.research_area}</span>
        ) : null}
      </div>

      <div className="project-card-bottom">
        <div className="project-people">
          {project.lead_researcher_name && (
            <p className="meta-line"><strong>Lead:</strong> {project.lead_researcher_name}</p>
          )}
          {project.mentors && (
            <p className="meta-line"><strong>Mentor:</strong> {project.mentors}</p>
          )}
        </div>

        <Link to={`/projects/${project.id}`} className="project-view-link">
          View project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
