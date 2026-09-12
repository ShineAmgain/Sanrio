import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
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
      <BackButton />
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

      {event.research_areas?.length > 0 && (
        <div className="tag-row" style={{ margin: "0.75rem 0" }}>
          {event.research_areas.map((area) => (
            <Link key={area.id} to={`/research-areas?area=${area.id}`} className="tag">
              {area.name}
            </Link>
          ))}
        </div>
      )}

      {event.speakers?.length > 0 && (
        <section>
          <h3>Speakers</h3>
          <div className="related-list">
            {event.speakers.map((r) => (
              <Link key={r.id} to={`/researchers/${r.id}`} className="related-item">
                <h4>{r.name}</h4>
                {r.position && <p className="muted">{r.position}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {event.publications?.length > 0 && (
        <section>
          <h3>Related Publications</h3>
          <div className="related-list">
            {event.publications.map((p) => (
              <Link key={p.id} to={`/publications/${p.id}`} className="related-item">
                <h4>{p.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

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
