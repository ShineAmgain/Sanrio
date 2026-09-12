import { useApiData } from "../hooks/useApiData";
import { getEvents } from "../api/events";
import EventCard from "../components/EventCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Events() {
  const { data, loading, error, reload } = useApiData(() => getEvents(), []);
  const events = data?.data || [];

  return (
    <main className="events-page">
      <div className="events-container">

        <header className="events-header">
          <div className="events-header-content">
            <span className="events-kicker">
              RESEARCH & ACADEMIC CALENDAR
            </span>

            <h1>
              Events<span>.</span>
            </h1>

            <p>
              Discover upcoming talks, conferences, seminars, and other
              activities across the research community.
            </p>
          </div>

          {!loading && !error && events.length > 0 && (
            <div className="events-count">
              <strong>{events.length}</strong>
              <span>Upcoming events</span>
            </div>
          )}
        </header>

        <div className="events-divider" />

        {loading && (
          <div className="events-loading">
            <LoadingState count={4} />
          </div>
        )}

        {error && (
          <div className="events-state">
            <ErrorState onRetry={reload} />
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="events-state">
            <EmptyState message="No upcoming events found." />
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <section className="events-list" aria-label="Upcoming events">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </section>
        )}

      </div>
    </main>
  );
}