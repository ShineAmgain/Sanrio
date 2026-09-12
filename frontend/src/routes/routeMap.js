// Maps a search result's `result_type` to the React route prefix it lives
// under. Always build detail links from this map + result_id — never
// hardcode a database id anywhere in the UI.
export const routeMap = {
  researcher: "/researchers",
  project: "/projects",
  publication: "/publications",
  event: "/events",
  grant: "/opportunities",
  opportunity: "/opportunities",
  research_area: "/research-areas",
  resource: "/research-support",
};

export function resultToPath(result) {
  if (result.result_type === "research_area") {
    return `/research-areas?area=${result.result_id}`;
  }
  const base = routeMap[result.result_type];
  return base ? `${base}/${result.result_id}` : "/search";
}

// "grant" and "opportunity" are two distinct DB tables (see brief section 4)
// but share one "Opportunities" filter chip in the UI, same as they share
// one nav item — matchesFilter is how Search.jsx groups them.
export function matchesFilter(result, filterKey) {
  if (filterKey === "all") return true;
  if (filterKey === "grant") {
    return result.result_type === "grant" || result.result_type === "opportunity";
  }
  return result.result_type === filterKey;
}

export const searchFilters = [
  { key: "all", label: "All" },
  { key: "researcher", label: "People" },
  { key: "project", label: "Projects" },
  { key: "publication", label: "Publications" },
  { key: "event", label: "Events" },
  { key: "grant", label: "Opportunities" },
  { key: "research_area", label: "Research Areas" },
  { key: "resource", label: "Resources" },
];
