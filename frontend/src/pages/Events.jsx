import { useApiData } from "../hooks/useApiData";
import { getEvents } from "../api/events";
import EventCard from "../components/EventCard";
import PageHero from "../components/PageHero";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Events() {
  const { data, loading, error, reload } = useApiData(() => getEvents(), []);
  const events = data?.data || [];

  return (
    <main className="page-container">
      <PageHero
        accent="orange"
        kicker="Research & Academic Calendar"
        title="What's"
        accentWord="happening."
        description="Discover upcoming talks, conferences, seminars, and other activities across the research community."
        stat={{
          number: String(events.length).padStart(2, "0"),
          label: events.length === 1 ? "Upcoming event" : "Upcoming events",
        }}
      />

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

    </main>
  );
}