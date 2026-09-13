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
    <div className="page-container">
      <h1>Events</h1>

      {loading && <LoadingState count={4} />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && events.length === 0 && (
        <EmptyState message="No upcoming events found." />
      )}
      {!loading && !error && events.length > 0 && (
        <div className="list-stack">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
