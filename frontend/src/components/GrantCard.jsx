import { Link } from "react-router-dom";

export default function GrantCard({ grant }) {
  return (
    <div className="grant-card">
      <h3>{grant.title}</h3>
      {grant.provider && <p className="meta-line">{grant.provider}</p>}
      {grant.description && <p className="card-snippet">{grant.description}</p>}
      <div className="card-footer-row">
        {grant.deadline && (
          <span className="meta-line">Deadline: {grant.deadline}</span>
        )}
        <Link to={`/opportunities/${grant.id}`} className="link-arrow">
          View more
        </Link>
      </div>
    </div>
  );
}
