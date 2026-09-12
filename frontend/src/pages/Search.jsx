import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { semanticSearch } from "../api/search";
import { searchFilters } from "../routes/routeMap";
import SearchBar from "../components/SearchBar";
import SearchResultCard from "../components/SearchResultCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [activeFilter, setActiveFilter] = useState("all");

  const { data, loading, error, reload } = useApiData(
    () => (query ? semanticSearch(query) : Promise.resolve({ results: [] })),
    [query]
  );

  const results = data?.results || [];

  // Filtering happens client-side: the API already returns result_type on
  // every row, so no extra backend endpoint is needed.
  const filteredResults =
    activeFilter === "all"
      ? results
      : results.filter((r) => r.result_type === activeFilter);

  return (
    <div className="page-container search-page">
      <h1>Search</h1>
      <SearchBar initialValue={query} autoFocus />

      {query && (
        <>
          <div className="filter-row">
            {searchFilters.map((f) => (
              <button
                key={f.key}
                className={activeFilter === f.key ? "chip chip-active" : "chip"}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && <LoadingState count={6} />}
          {error && <ErrorState onRetry={reload} />}
          {!loading && !error && filteredResults.length === 0 && (
            <EmptyState message={`No results found for "${query}".`} />
          )}
          {!loading && !error && filteredResults.length > 0 && (
            <div className="card-grid card-grid-3">
              {filteredResults.map((result) => (
                <SearchResultCard
                  key={`${result.result_type}-${result.result_id}`}
                  result={result}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
