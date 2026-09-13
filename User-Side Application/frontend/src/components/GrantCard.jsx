import { Link } from "react-router-dom";

export default function GrantCard({ grant }) {
  return (
    <article className="opportunity-card">
      <div className="opportunity-card-top">
        <span className="opportunity-tag">OPPORTUNITY</span>
      </div>

      <div className="opportunity-card-body">
        <h3>{grant.title}</h3>

        {grant.provider && (
          <p className="opportunity-provider">{grant.provider}</p>
        )}

        {grant.description && (
          <p className="opportunity-description">{grant.description}</p>
        )}
      </div>

      <div className="opportunity-card-footer">
        {grant.deadline ? (
          <div className="opportunity-deadline">
            <span>Deadline</span>
            <strong>{grant.deadline}</strong>
          </div>
        ) : (
          <div className="opportunity-deadline">
            <span>Deadline</span>
            <strong>Not specified</strong>
          </div>
        )}

        <Link
          to={`/opportunities/${grant.id}`}
          className="opportunity-view-link"
        >
          View more
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}