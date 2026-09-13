import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import { getEvent } from "../api/events";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function EventDetail() {
  const { id } = useParams();

  const {
    data,
    loading,
    error,
    reload,
  } = useApiData(() => getEvent(id), [id]);

  const event = data?.data;

  if (loading) {
    return (
      <main className="event-detail-page">
        <div className="event-detail-container">
          <LoadingState count={1} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="event-detail-page">
        <div className="event-detail-container">
          <ErrorState onRetry={reload} />
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-detail-page">
        <div className="event-detail-container">
          <EmptyState message="Event not found." />
        </div>
      </main>
    );
  }

  return (
    <main className="event-detail-page">
      <div className="event-detail-container">

        <div className="event-detail-back">
          <BackButton />
        </div>

        <header className="event-detail-header">

          <div className="event-detail-header-top">
            <span className="event-detail-kicker">
              RESEARCH & ACADEMIC EVENT
            </span>

            {event.event_type && (
              <span className="event-detail-type">
                {event.event_type}
              </span>
            )}
          </div>

          <h1>{event.title}</h1>

          <div className="event-detail-accent" />
        </header>

        <div className="event-detail-layout">

          <aside className="event-detail-sidebar">

            {event.start_at && (
              <div className="event-info-card">
                <span className="event-info-label">
                  DATE & TIME
                </span>

                <div className="event-info-value">
                  <span className="event-info-icon">◷</span>

                  <div>
                    <strong>
                      {new Date(event.start_at).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </strong>

                    <span>
                      {new Date(event.start_at).toLocaleTimeString(
                        undefined,
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}

                      {event.end_at &&
                        ` – ${new Date(event.end_at).toLocaleTimeString(
                          undefined,
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {event.location && (
              <div className="event-info-card">
                <span className="event-info-label">
                  LOCATION
                </span>

                <div className="event-info-value">
                  <span className="event-info-icon">●</span>

                  <div>
                    <strong>{event.location}</strong>
                  </div>
                </div>
              </div>
            )}

            {event.registration_url && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noreferrer"
                className="event-register-button"
              >
                <span>Register for event</span>
                <span className="event-button-arrow">↗</span>
              </a>
            )}

            {(event.action_url || event.external_url) && (
              <a
                href={event.action_url || event.external_url}
                target="_blank"
                rel="noreferrer"
                className="event-more-button"
              >
                More information
                <span>↗</span>
              </a>
            )}

          </aside>

          <div className="event-detail-main">

            {event.description && (
              <section className="event-description-section">
                <span className="event-section-kicker">
                  ABOUT THIS EVENT
                </span>

                <h2>Event overview</h2>

                <p className="event-description">
                  {event.description}
                </p>
              </section>
            )}

            {event.research_areas?.length > 0 && (
              <section className="event-related-section">
                <div className="event-section-heading">
                  <div>
                    <span className="event-section-kicker">
                      RESEARCH AREAS
                    </span>

                    <h2>Areas of research</h2>
                  </div>
                </div>

                <div className="event-tags">
                  {event.research_areas.map((area) => (
                    <Link
                      key={area.id}
                      to={`/research-areas?area=${area.id}`}
                      className="event-tag"
                    >
                      {area.name}
                      <span>↗</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {event.speakers?.length > 0 && (
              <section className="event-related-section">
                <div className="event-section-heading">
                  <div>
                    <span className="event-section-kicker">
                      CONTRIBUTORS
                    </span>

                    <h2>Speakers</h2>
                  </div>

                  <span className="event-section-count">
                    {event.speakers.length}
                  </span>
                </div>

                <div className="event-people-list">
                  {event.speakers.map((researcher) => (
                    <Link
                      key={researcher.id}
                      to={`/researchers/${researcher.id}`}
                      className="event-person-card"
                    >
                      <div className="event-person-initial">
                        {researcher.name?.charAt(0).toUpperCase()}
                      </div>

                      <div className="event-person-info">
                        <h3>{researcher.name}</h3>

                        {researcher.position && (
                          <p>{researcher.position}</p>
                        )}
                      </div>

                      <span className="event-person-arrow">
                        ↗
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {event.publications?.length > 0 && (
              <section className="event-related-section">
                <div className="event-section-heading">
                  <div>
                    <span className="event-section-kicker">
                      ACADEMIC OUTPUT
                    </span>

                    <h2>Related publications</h2>
                  </div>

                  <span className="event-section-count">
                    {event.publications.length}
                  </span>
                </div>

                <div className="event-publications-list">
                  {event.publications.map((publication) => (
                    <Link
                      key={publication.id}
                      to={`/publications/${publication.id}`}
                      className="event-publication-card"
                    >
                      <div className="event-publication-number">
                        PUB
                      </div>

                      <div className="event-publication-content">
                        <h3>{publication.title}</h3>
                      </div>

                      <span className="event-publication-arrow">
                        ↗
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}