import { Link } from "react-router-dom";

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="event-row">
      <div className="event-date-col">{formatDate(event.start_at) || "TBA"}</div>
      <div className="event-info-col">
        <h3>{event.title}</h3>
        {event.location && <p className="meta-line">{event.location}</p>}
      </div>
    </Link>
  );
}
