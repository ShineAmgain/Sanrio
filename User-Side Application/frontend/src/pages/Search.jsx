import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { semanticSearch } from "../api/search";
import { searchFilters, matchesFilter } from "../routes/routeMap";
import SearchBar from "../components/SearchBar";
import SearchResultCard from "../components/SearchResultCard";
import PageHero from "../components/PageHero";
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
  // every row, so no extra backend endpoint is needed. "grant" and
  // "opportunity" share one chip since they're one UI concept.
  const filteredResults = results.filter((r) => matchesFilter(r, activeFilter));

  return (
    <div className="page-container search-page">
      <PageHero
        accent="pink"
        kicker="Research & Development / Search"
        title="Find what you're"
        accentWord="looking for."
        description="Search across researchers, projects, publications, events and grants in one place."
        stat={
          query && !loading && !error
            ? {
                number: String(filteredResults.length).padStart(2, "0"),
                label: filteredResults.length === 1 ? "Result" : "Results",
              }
            : undefined
        }
      >
        <SearchBar initialValue={query} autoFocus />
      </PageHero>

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
