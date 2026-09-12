import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import { getPublication, getRelatedPublications } from "../api/publications";
import RelatedResearch from "../components/RelatedResearch";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function PublicationDetail() {
  const { id } = useParams();

  const {
    data,
    loading,
    error,
    reload,
  } = useApiData(() => getPublication(id), [id]);

  const publication = data?.data;

  const relatedState = useApiData(
    () => getRelatedPublications(id),
    [id]
  );

  const related = relatedState.data?.data;

  if (loading) {
    return (
      <div className="publication-detail-page">
        <div className="publication-detail-container publication-detail-state">
          <LoadingState count={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="publication-detail-page">
        <div className="publication-detail-container publication-detail-state">
          <ErrorState onRetry={reload} />
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="publication-detail-page">
        <div className="publication-detail-container publication-detail-state">
          <EmptyState message="Publication not found." />
        </div>
      </div>
    );
  }

  return (
    <div className="publication-detail-page">
      <div className="publication-detail-container">

        <div className="publication-detail-back">
          <BackButton />
        </div>

        <header className="publication-detail-header">

          <div className="publication-detail-kicker">
            <span className="publication-detail-kicker-line"></span>
            RESEARCH PUBLICATION
          </div>

          {publication.publication_type && (
            <div className="publication-detail-type">
              {publication.publication_type}
            </div>
          )}

          <h1>{publication.title}</h1>

          <div className="publication-detail-meta">

            {publication.authors && (
              <div className="publication-detail-meta-item">
                <span className="publication-detail-meta-label">
                  AUTHORS
                </span>
                <span className="publication-detail-meta-value">
                  {publication.authors}
                </span>
              </div>
            )}

            {publication.year && (
              <div className="publication-detail-meta-item">
                <span className="publication-detail-meta-label">
                  YEAR
                </span>
                <span className="publication-detail-meta-value">
                  {publication.year}
                </span>
              </div>
            )}

            {publication.journal && (
              <div className="publication-detail-meta-item">
                <span className="publication-detail-meta-label">
                  VENUE
                </span>
                <span className="publication-detail-meta-value">
                  {publication.journal}
                </span>
              </div>
            )}

          </div>

        </header>

        <div className="publication-detail-layout">

          <main className="publication-detail-main">

            {publication.research_areas?.length > 0 && (
              <section className="publication-detail-section publication-detail-topics">
                <div className="publication-detail-section-heading">
                  <span className="publication-detail-section-marker"></span>
                  Research areas
                </div>

                <div className="publication-detail-tags">
                  {publication.research_areas.map((area) => (
                    <Link
                      key={area.id}
                      to={`/research-areas?area=${area.id}`}
                      className="publication-detail-tag"
                    >
                      {area.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(publication.abstract || publication.summary) && (
              <section className="publication-detail-section publication-detail-abstract">
                <div className="publication-detail-section-heading">
                  <span className="publication-detail-section-marker"></span>
                  Abstract
                </div>

                <p>
                  {publication.abstract || publication.summary}
                </p>
              </section>
            )}

            {publication.events?.length > 0 && (
              <section className="publication-detail-section publication-detail-presented">
                <div className="publication-detail-section-heading">
                  <span className="publication-detail-section-marker"></span>
                  Presented at
                </div>

                <div className="publication-detail-event-list">
                  {publication.events.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="publication-detail-event"
                    >
                      <div>
                        <span className="publication-detail-event-label">
                          EVENT
                        </span>
                        <h3>{event.title}</h3>
                      </div>

                      <span className="publication-detail-event-arrow">
                        ↗
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </main>

          <aside className="publication-detail-sidebar">

            <div className="publication-detail-sidebar-card">

              <div className="publication-detail-sidebar-heading">
                Publication details
              </div>

              {publication.journal && (
                <div className="publication-detail-sidebar-item">
                  <span>Journal / Venue</span>
                  <strong>{publication.journal}</strong>
                </div>
              )}

              {publication.year && (
                <div className="publication-detail-sidebar-item">
                  <span>Published</span>
                  <strong>{publication.year}</strong>
                </div>
              )}

              {publication.doi && (
                <div className="publication-detail-sidebar-item">
                  <span>DOI</span>
                  <strong className="publication-detail-doi">
                    {publication.doi}
                  </strong>
                </div>
              )}

              {publication.external_url && (
                <a
                  href={publication.external_url}
                  target="_blank"
                  rel="noreferrer"
                  className="publication-detail-button"
                >
                  <span>View publication</span>
                  <span className="publication-detail-button-arrow">
                    ↗
                  </span>
                </a>
              )}

            </div>

          </aside>

        </div>

        {!relatedState.loading && related && (
          <section className="publication-detail-related">
            <div className="publication-detail-related-heading">
              <span className="publication-detail-related-kicker">
                CONTINUE EXPLORING
              </span>

              <h2>Related research</h2>

              <div className="publication-detail-related-line"></div>
            </div>

            <RelatedResearch
              similar={related.similar}
              more={related.moreByAuthors}
              moreLabel="More by these authors"
              moreType="publication"
            />
          </section>
        )}

      </div>
    </div>
  );
}