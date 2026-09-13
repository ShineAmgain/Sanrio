import { useMemo, useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { getResearchers } from "../api/researchers";
import ResearcherCard from "../components/ResearcherCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Researchers() {
  const { data, loading, error, reload } = useApiData(() => getResearchers(), []);
  const [department, setDepartment] = useState("all");

  const researchers = data?.data || [];

  const departments = useMemo(() => {
    const set = new Set(researchers.map((r) => r.department).filter(Boolean));
    return ["all", ...set];
  }, [researchers]);

  const filtered =
    department === "all"
      ? researchers
      : researchers.filter((r) => r.department === department);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Meet the Minds</h1>
        <select
          className="filter-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          aria-label="Filter by department"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === "all" ? "Filter" : d}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingState count={6} />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState message="No researchers found." />
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
