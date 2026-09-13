import { useApiData } from "../hooks/useApiData";
import { getPublications } from "../api/publications";
import PublicationCard from "../components/PublicationCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Publications() {
  const { data, loading, error, reload } = useApiData(
    () => getPublications(),
    []
  );

  const publications = data?.data || [];

  return (
    <div className="publications-page">
      <div className="publications-container">

        <header className="publications-header">
          <div className="publications-header-main">
            <div className="publications-kicker">
              <span className="publications-kicker-line"></span>
              RESEARCH PUBLICATIONS
            </div>

            <h1>
              Knowledge in <span>print.</span>
            </h1>

            <p>
              Explore research, findings, and academic work from our
              researchers and collaborators.
            </p>
          </div>

          {!loading && !error && publications.length > 0 && (
            <div className="publications-stat">
              <span className="publications-stat-number">
                {String(publications.length).padStart(2, "0")}
              </span>

              <span className="publications-stat-label">
                {publications.length === 1
                  ? "Publication"
                  : "Publications"}
              </span>
            </div>
          )}
        </header>

        <div className="publications-section-bar">
          <div className="publications-section-title">
            <span className="publications-section-icon">↗</span>
            Latest research
          </div>

          <div className="publications-section-rule"></div>
        </div>

        {loading && (
          <div className="publications-loading">
            <LoadingState count={6} />
          </div>
        )}

        {error && (
          <div className="publications-state">
            <ErrorState onRetry={reload} />
          </div>
        )}

        {!loading && !error && publications.length === 0 && (
          <div className="publications-state">
            <EmptyState message="No publications available yet." />
          </div>
        )}

        {!loading && !error && publications.length > 0 && (
          <main className="publications-content">
            <div className="publications-grid">
              {publications.map((publication, index) => (
                <div
                  className="publications-card-wrap"
                  key={publication.id}
                  style={{
                    "--publication-index": `"${String(index + 1).padStart(
                      2,
                      "0"
                    )}"`,
                  }}
                >
                  <PublicationCard publication={publication} />
                </div>
              ))}
            </div>
          </main>
        )}

      </div>
    </div>
  );
}