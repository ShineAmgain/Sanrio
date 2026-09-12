import { useParams } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getEvent } from "../api/events";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function EventDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApiData(() => getEvent(id), [id]);
  const event = data?.data;

  if (loading) return <LoadingState count={1} />;
  if (error) return <ErrorState onRetry={reload} />;
  if (!event) return <EmptyState message="Event not found." />;

  return (
    <div className="page-container detail-page">
      {event.event_type && <span className="badge badge-type">{event.event_type}</span>}
      <h1>{event.title}</h1>

      {event.start_at && (
        <p className="meta-line">
          {new Date(event.start_at).toLocaleString()}
          {event.end_at ? ` – ${new Date(event.end_at).toLocaleString()}` : ""}
        </p>
      )}
      {event.location && <p className="meta-line">{event.location}</p>}
      {event.description && <p className="detail-lead">{event.description}</p>}

      <div className="detail-actions">
        {event.registration_url && (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Register
          </a>
        )}
        {(event.action_url || event.external_url) && (
          <a
            href={event.action_url || event.external_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            More info
          </a>
        )}
      </div>
    </div>
  );
}
