import { useApiData } from "../hooks/useApiData";
import { getProjects } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Projects() {
  const { data, loading, error, reload } = useApiData(() => getProjects(), []);
  const projects = data?.data || [];

  return (
    <div className="page-container">
      <h1>Projects</h1>

      {loading && <LoadingState count={6} />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && projects.length === 0 && (
        <EmptyState message="No projects available yet." />
      )}
      {!loading && !error && projects.length > 0 && (
        <div className="card-grid card-grid-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
