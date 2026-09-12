// Maps a search result's `result_type` to the React route prefix it lives
// under. Always build detail links from this map + result_id — never
// hardcode a database id anywhere in the UI.
export const routeMap = {
  researcher: "/researchers",
  project: "/projects",
  publication: "/publications",
  event: "/events",
  grant: "/opportunities",
};

export function resultToPath(result) {
  const base = routeMap[result.result_type];
  return base ? `${base}/${result.result_id}` : "/search";
}

export const searchFilters = [
  { key: "all", label: "All" },
  { key: "researcher", label: "People" },
  { key: "project", label: "Projects" },
  { key: "publication", label: "Publications" },
  { key: "event", label: "Events" },
  { key: "grant", label: "Opportunities" },
];
