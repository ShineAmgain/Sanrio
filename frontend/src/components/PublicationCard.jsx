import { Link } from "react-router-dom";

export default function PublicationCard({ publication }) {
  return (
    <Link to={`/publications/${publication.id}`} className="publication-card">
      {publication.cover_image_url && (
        <img
          src={publication.cover_image_url}
          alt=""
          className="publication-thumb"
        />
      )}
      <div className="publication-body">
        {publication.publication_type && (
          <span className="badge badge-type">{publication.publication_type}</span>
        )}
        <h3>{publication.title}</h3>
        {(publication.abstract || publication.summary) && (
          <p className="card-snippet">
            {publication.abstract || publication.summary}
          </p>
        )}
        {publication.authors && (
          <p className="meta-line">Authors: {publication.authors}</p>
        )}
      </div>
    </Link>
  );
}
