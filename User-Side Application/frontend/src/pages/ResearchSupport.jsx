import { useMemo, useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { getResources } from "../api/resources";
import PageHero from "../components/PageHero";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function ResearchSupport() {
  const { data, loading, error, reload } = useApiData(
    () => getResources(),
    []
  );

  const resources = data?.data || [];

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => [
      "all",
      ...new Set(
        resources
          .map((resource) => resource.category)
          .filter(Boolean)
      ),
    ],
    [resources]
  );

  const filtered = resources.filter((resource) => {
    const title = resource.title || "";
    const description = resource.description || "";

    const searchable = `${title} ${description}`.toLowerCase();

    const matchesQuery = searchable.includes(
      query.toLowerCase()
    );

    const matchesCategory =
      category === "all" ||
      resource.category === category;

    return matchesQuery && matchesCategory;
  });

  function getResourceUrl(resource) {
    return resource.external_url || resource.source_url || null;
  }

  function getResourceAction(resource) {
    if (resource.external_url) {
      return resource.resource_type === "folder"
        ? "Open materials"
        : "Open resource";
    }

    if (resource.source_url) {
      return "View source";
    }

    return null;
  }

  return (
    <div className="research-support-page">

      <PageHero
        accent="blue"
        kicker="Research Support"
        title="Tools, guidance"
        accentWord="& resources."
        description="Practical resources, workshops and materials supporting research at Islington College."
        stat={{
          number: String(resources.length).padStart(2, "0"),
          label: resources.length === 1 ? "Resource" : "Resources",
        }}
      />

      {/* SEARCH / FILTER */}
      {!loading && !error && resources.length > 0 && (
        <div className="research-support-controls">

          <div className="research-support-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search resources"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="research-support-filters">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "research-support-filter active"
                    : "research-support-filter"
                }
                onClick={() => setCategory(item)}
              >
                {item === "all" ? "All" : item}
              </button>
            ))}
          </div>

        </div>
      )}

      {/* STATES */}
      {loading && (
        <div className="research-support-content">
          <LoadingState count={6} />
        </div>
      )}

      {error && (
        <div className="research-support-content">
          <ErrorState onRetry={reload} />
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="research-support-content">
          <EmptyState message="No resources match your search." />
        </div>
      )}

      {/* RESOURCES */}
      {!loading && !error && filtered.length > 0 && (
        <section className="research-resource-list">

          <div className="research-resource-list-header">
            <span>RESOURCE</span>
            <span>TYPE</span>
            <span />
          </div>

          {filtered.map((resource, index) => {
            const url = getResourceUrl(resource);
            const action = getResourceAction(resource);

            return (
              <article
                key={resource.id}
                className="research-resource-row"
              >

                <div className="research-resource-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="research-resource-main">

                  <span className="research-resource-category">
                    {resource.category || "Research"}
                  </span>

                  <h2>
                    {resource.title}
                  </h2>

                  {resource.description && (
                    <p>
                      {resource.description}
                    </p>
                  )}

                </div>

                <div className="research-resource-type">
                  {resource.resource_type || "Resource"}
                </div>

                <div className="research-resource-action">

                  {url && action ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {action}
                      <span>↗</span>
                    </a>
                  ) : (
                    <span className="resource-unavailable">
                      No link available
                    </span>
                  )}

                </div>

              </article>
            );
          })}

        </section>
      )}

    </div>
  );
}