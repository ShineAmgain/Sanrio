import { useParams, Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getProject } from "../api/projects";
import { getResearcher } from "../api/researchers";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ProjectDetail() {
  const { id } = useParams();
  const projectState = useApiData(() => getProject(id), [id]);
  const project = projectState.data?.data;

  // Relationship: projects.lead_researcher_id -> researchers.id
  const leadState = useApiData(
    () =>
      project?.lead_researcher_id
        ? getResearcher(project.lead_researcher_id)
        : Promise.resolve(null),
    [project?.lead_researcher_id]
  );

  if (projectState.loading) return <LoadingState count={1} />;
  if (projectState.error) return <ErrorState onRetry={projectState.reload} />;
  if (!project) return <EmptyState message="Project not found." />;

  const lead = leadState.data?.data;

  return (
    <div className="page-container detail-page">
      {project.status && <span className="status-badge">{project.status}</span>}
      <h1>{project.title}</h1>
      {project.description && <p className="detail-lead">{project.description}</p>}

      {lead && (
        <p className="meta-line">
          <strong>Lead Researcher: </strong>
          <Link to={`/researchers/${lead.id}`}>{lead.name}</Link>
        </p>
      )}

      {project.objectives && (
        <section>
          <h3>Objectives</h3>
          <p>{project.objectives}</p>
        </section>
      )}

      {project.outputs_summary && (
        <section>
          <h3>Outputs</h3>
          <p>{project.outputs_summary}</p>
        </section>
      )}

      {(project.start_date || project.end_date) && (
        <p className="meta-line">
          {project.start_date} – {project.end_date || "Ongoing"}
        </p>
      )}

      {project.external_url && (
        <a
          href={project.external_url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          View external resource
        </a>
      )}
    </div>
  );
}
