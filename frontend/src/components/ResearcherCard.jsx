import { Link } from "react-router-dom";

export default function ResearcherCard({ researcher }) {
  return (
    <div className="researcher-card">
      <div className="avatar-circle" aria-hidden="true" />
      <h3>{researcher.name}</h3>
      <p className="muted">{researcher.position || "Researcher"}</p>
      {researcher.department && (
        <span className="pill">{researcher.department}</span>
      )}
      {researcher.bio && <p className="card-snippet">{researcher.bio}</p>}
      {researcher.research_areas?.length > 0 && (
        <div className="tag-row">
          {researcher.research_areas.map((area) =>
            area?.id ? (
              <Link
                key={area.id}
                to={`/research-areas?area=${area.id}`}
                className="tag"
              >
                {area.name}
              </Link>
            ) : (
              <span className="tag" key={area?.name || area}>
                {area?.name || area}
              </span>
            )
          )}
        </div>
      )}
      <Link to={`/researchers/${researcher.id}`} className="link-arrow">
        View Profile
      </Link>
    </div>
  );
}
