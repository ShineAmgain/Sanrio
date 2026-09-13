import { Link } from "react-router-dom";

export default function ResearcherCard({ researcher }) {
  const initials = researcher.name
    ? researcher.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("")
    : "R";

  return (
    <div className="researcher-card">
      <div className="researcher-avatar" aria-hidden="true">
        {researcher.avatar_url ? (
          <img
            src={researcher.avatar_url}
            alt=""
            className="researcher-avatar-img"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      <h3 className="researcher-name">{researcher.name}</h3>
      <p className="researcher-position">
        {researcher.position || "Researcher"}
      </p>

      {researcher.bio && <p className="researcher-bio">{researcher.bio}</p>}

      {researcher.research_areas?.length > 0 && (
        <div className="researcher-tag-row">
          {researcher.research_areas.map((area) =>
            area?.id ? (
              <Link
                key={area.id}
                to={`/research-areas?area=${area.id}`}
                className="area-tag"
              >
                {area.name}
              </Link>
            ) : (
              <span className="area-tag" key={area?.name || area}>
                {area?.name || area}
              </span>
            )
          )}
        </div>
      )}

      <Link
        to={`/researchers/${researcher.id}`}
        className="researcher-view-link"
      >
        View Profile
      </Link>
    </div>
  );
}