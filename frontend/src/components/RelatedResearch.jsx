import logoIcon from "../assets/logo-icon.png";
import { Link } from "react-router-dom";
import { resultToPath } from "../routes/routeMap";

const TYPE_LABELS = {
  researcher: "Person",
  project: "Project",
  publication: "Publication",
  event: "Event",
  grant: "Grant",
  opportunity: "Grant",
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
    <section className="research-discovery">

      {/* DISCOVER MORE */}
      {similar.length > 0 && (
        <div className="research-discovery-section">

          <div className="research-discovery-intro">
  <img
    src={logoIcon}
    alt=""
    className="research-discovery-logo"
    aria-hidden="true"
  />

  <div className="research-discovery-heading-content">
    <p className="research-discovery-kicker">
      EXPLORE RELATED RESEARCH
    </p>

    <h2>Discover More</h2>

    <p className="research-discovery-description">
      Research connected by subject, context and meaning.
    </p>
  </div>

  <div className="research-discovery-total">
    {similar.length} results
  </div>
</div>

          <div className="research-discovery-items">
            {similar.map((result, index) => {
              const type =
                TYPE_LABELS[result.result_type] ||
                result.result_type ||
                "Research";

              const percentage =
                result.similarity != null
                  ? Math.round(result.similarity * 100)
                  : null;

              return (
                <Link
                  key={`${result.result_type}-${result.result_id}`}
                  to={resultToPath(result)}
                  className="research-discovery-item"
                >
                  <div className="research-discovery-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="research-discovery-main">

                    <div className="research-discovery-type">
                      {type}
                    </div>

                    <h3>{result.title}</h3>

                    {result.description && (
                      <p className="research-discovery-excerpt">
                        {result.description}
                      </p>
                    )}

                    <div className="research-discovery-footer">
                      <span className="research-discovery-link">
                        View {type.toLowerCase()}
                        <span> →</span>
                      </span>

                      {percentage != null && (
                        <span className="research-discovery-relevance">
                          {percentage}% semantic relevance
                        </span>
                      )}
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* RESEARCHER CONNECTIONS */}
      {more.length > 0 && (
        <div className="research-connections">

          <div className="research-discovery-intro">
            <div>
              <p className="research-discovery-kicker">
                RESEARCHER CONNECTIONS
              </p>

              <h2>{moreLabel}</h2>

              <p className="research-discovery-description">
                Other work connected to this researcher.
              </p>
            </div>
          </div>

          <div className="research-connection-items">
            {more.map((item, index) => (
              <Link
                key={item.id}
                to={
                  moreType === "publication"
                    ? `/publications/${item.id}`
                    : `/projects/${item.id}`
                }
                className="research-connection-item"
              >
                <span className="research-connection-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <span className="research-connection-type">
                    {moreType === "publication"
                      ? "Publication"
                      : "Project"}
                  </span>

                  <h3>{item.title}</h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  <span className="research-connection-link">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      )}

    </section>
  );
}