import { Link } from "react-router-dom";

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return {
    day: date.toLocaleDateString(undefined, {
      day: "2-digit",
    }),
    month: date.toLocaleDateString(undefined, {
      month: "short",
    }),
    year: date.toLocaleDateString(undefined, {
      year: "numeric",
    }),
  };
}

export default function EventCard({ event }) {
  const date = formatDate(event.start_at);

  return (
    <Link
      to={`/events/${event.id}`}
      className="events-card"
    >
      <div className="events-date">
        {date ? (
          <>
            <span className="events-date-day">{date.day}</span>
            <span className="events-date-month">{date.month}</span>
            <span className="events-date-year">{date.year}</span>
          </>
        ) : (
          <span className="events-date-tba">TBA</span>
        )}
      </div>

      <div className="events-card-content">
        <div className="events-card-top">
          <span className="events-card-label">
            EVENT
          </span>

          <span className="events-card-arrow" aria-hidden="true">
            ↗
          </span>
        </div>

        <h2>{event.title}</h2>

        {event.location && (
          <div className="events-location">
            <span className="events-location-icon">●</span>
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </Link>
  );
}