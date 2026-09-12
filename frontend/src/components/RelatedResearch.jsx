import { Link } from "react-router-dom";
import { resultToPath } from "../routes/routeMap";

const TYPE_LABELS = {
  researcher: "Person",
  project: "Project",
  publication: "Publication",
  event: "Event",
  grant: "Grant",
};

export default function RelatedResearch({
  similar = [],
  more = [],
  moreLabel = "More by this researcher",
  moreType = "project",
}) {
  if (similar.length === 0 && more.length === 0) {
    return null;
  }

  return (
    <section className="related-research">

      {/* DISCOVERY HEADER */}
      {similar.length > 0 && (
        <>
          <div className="section-heading">
            <p className="section-eyebrow">DISCOVER MORE</p>
            <h2>Explore Similar Research</h2>
            <p className="section-description">
              Explore projects related to this research based on their
              subject, context and research meaning.
            </p>
          </div>

          <div className="card-grid card-grid-3">
            {similar.map((result) => (
              <Link
                key={`${result.result_type}-${result.result_id}`}
                to={resultToPath(result)}
                className="research-discovery-card"
              >
                <div className="research-discovery-top">
                  <span className="badge badge-type">
                    {TYPE_LABELS[result.result_type] ||
                      result.result_type}
                  </span>

                  {result.similarity != null && (
                    <span className="similarity-score">
                      {Math.round(result.similarity * 100)}% match
                    </span>
                  )}
                </div>

                <h3>{result.title}</h3>

                {result.description && (
                  <p>{result.description}</p>
                )}

                <span className="discovery-link">
                  View research →
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* MORE FROM SAME RESEARCHER */}
      {more.length > 0 && (
        <div className="related-more-section">
          <div className="section-heading">
            <p className="section-eyebrow">RESEARCHER</p>
            <h2>{moreLabel}</h2>
          </div>

          <div className="related-list">
            {more.map((item) => (
              <Link
                key={item.id}
                to={
                  moreType === "publication"
                    ? `/publications/${item.id}`
                    : `/projects/${item.id}`
                }
                className="related-item"
              >
                <span className="badge badge-type">
                  {moreType === "publication"
                    ? "Publication"
                    : "Project"}
                </span>

                <h4>{item.title}</h4>

                {item.description && (
                  <p className="muted">
                    {item.description}
                  </p>
                )}

                <span className="discovery-link">
                  View details →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}