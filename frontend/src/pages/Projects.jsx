import { useMemo, useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { getProjects } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Projects() {
  const { data, loading, error, reload } = useApiData(() => getProjects(), []);
  const projects = data?.data || [];
  const [filter, setFilter] = useState("all");

  const areas = useMemo(() => {
    const values = projects.flatMap((project) =>
      project.research_areas?.map((area) => area.name).filter(Boolean) ||
      (project.research_area ? [project.research_area] : [])
    );
    return [...new Set(values)].sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => {
      const names = project.research_areas?.map((area) => area.name) ||
        (project.research_area ? [project.research_area] : []);
      return names.includes(filter);
    });
  }, [projects, filter]);

  return (
    <div className="page-container projects-page">
<div className="projects-page-header">
  <div>
    <p className="page-eyebrow">RESEARCH &amp; DEVELOPMENT / PROJECTS</p>
    <h1>Research Projects</h1>
  </div>

        {!loading && !error && areas.length > 0 && (
          <label className="projects-filter">
            <span className="sr-only">Filter projects by research area</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All projects</option>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loading && <LoadingState count={6} />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && filteredProjects.length === 0 && (
        <EmptyState message="No projects match this filter." />
      )}
      {!loading && !error && filteredProjects.length > 0 && (
        <div className="card-grid card-grid-3 projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
