import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      {project.description && <p className="card-snippet">{project.description}</p>}

      {project.research_area && <span className="pill">{project.research_area}</span>}

      {project.lead_researcher_name && (
        <p className="meta-line">
          <strong>Lead:</strong> {project.lead_researcher_name}
        </p>
      )}
      {project.mentors && (
        <p className="meta-line">
          <strong>Mentor:</strong> {project.mentors}
        </p>
      )}

      <div className="card-footer-row">
        <Link to={`/projects/${project.id}`} className="link-arrow">
          View more
        </Link>
        {project.status && (
          <span className={`status-badge status-${project.status.toLowerCase()}`}>
            {project.status}
          </span>
        )}
      </div>
    </div>
  );
}
