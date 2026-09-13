import { useMemo, useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { getProjects } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import PageHero from "../components/PageHero";
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
      <PageHero
        accent="green"
        kicker="Research & Development / Projects"
        title="Ideas in"
        accentWord="motion."
        description="Follow the active and completed research projects taking shape across departments, labs and research groups."
        stat={{
          number: String(projects.length).padStart(2, "0"),
          label: projects.length === 1 ? "Project" : "Projects",
        }}
      >
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
      </PageHero>

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
