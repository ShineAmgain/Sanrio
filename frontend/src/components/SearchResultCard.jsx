import { Link } from "react-router-dom";
import { resultToPath } from "../routes/routeMap";

const TYPE_LABELS = {
  researcher: "Person",
  project: "Project",
  publication: "Publication",
  event: "Event",
  grant: "Opportunity",
  opportunity: "Opportunity",
  research_area: "Research Area",
  resource: "Resource",
};

export default function SearchResultCard({ result }) {
  const path = resultToPath(result);
  const typeLabel = TYPE_LABELS[result.result_type] || result.result_type;

  return (
    <Link to={path} className="result-card">
      <span className="badge badge-type">{typeLabel}</span>
      <h3>{result.title}</h3>
      {result.description && <p>{result.description}</p>}
    </Link>
  );
}
