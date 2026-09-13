import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getResearchers } from "../api/researchers";
import ResearcherCard from "../components/ResearcherCard";
import PageHero from "../components/PageHero";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Researchers() {
  const { data, loading, error, reload } = useApiData(() => getResearchers(), []);
  const [department, setDepartment] = useState("all");
  const [params, setParams] = useSearchParams();
  const [area, setArea] = useState(params.get("area") || "all");

  const researchers = data?.data || [];

  const departments = useMemo(() => {
    const set = new Set(researchers.map((r) => r.department).filter(Boolean));
    return ["all", ...set];
  }, [researchers]);

  // Research areas live on a many-to-many link (a researcher can belong to
  // several), so — unlike department — they need to be flattened out of
  // every researcher's research_areas array before we get the full,
  // de-duplicated list to filter on.
  const areas = useMemo(() => {
    const map = new Map();
    researchers.forEach((r) => {
      (r.research_areas || []).forEach((a) => {
        if (a?.id != null) map.set(String(a.id), a.name || a.id);
      });
    });
    return [{ id: "all", name: "All areas" }, ...Array.from(map, ([id, name]) => ({ id, name }))];
  }, [researchers]);

  function handleAreaChange(next) {
    setArea(next);
    setParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (next === "all") nextParams.delete("area");
      else nextParams.set("area", next);
      return nextParams;
    });
  }

  const filtered = researchers.filter((r) => {
    const matchesDepartment = department === "all" || r.department === department;
    const matchesArea =
      area === "all" ||
      (r.research_areas || []).some((a) => String(a?.id) === area);
    return matchesDepartment && matchesArea;
  });

  return (
    <div className="page-container">
      <PageHero
        accent="blue"
        kicker="Research & Development / People"
        title="Meet the"
        accentWord="minds."
        description="Browse the researchers, academics and collaborators driving projects and publications across the college."
        stat={{
          number: String(researchers.length).padStart(2, "0"),
          label: researchers.length === 1 ? "Researcher" : "Researchers",
        }}
      >
        <div className="filter-group">
          <select
            className="filter-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            aria-label="Filter by department"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All departments" : d}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={area}
            onChange={(e) => handleAreaChange(e.target.value)}
            aria-label="Filter by research area"
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </PageHero>

      {loading && <LoadingState count={6} />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState message="No researchers found for this filter." />
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="card-grid card-grid-4">
          {filtered.map((researcher) => (
            <ResearcherCard key={researcher.id} researcher={researcher} />
          ))}
        </div>
      )}
    </div>
  );
}