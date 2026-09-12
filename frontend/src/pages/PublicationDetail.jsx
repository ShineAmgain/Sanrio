import { useParams } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getPublication } from "../api/publications";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function PublicationDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApiData(() => getPublication(id), [id]);
  const publication = data?.data;

  if (loading) return <LoadingState count={1} />;
  if (error) return <ErrorState onRetry={reload} />;
  if (!publication) return <EmptyState message="Publication not found." />;

  return (
    <div className="page-container detail-page">
      {publication.publication_type && (
        <span className="badge badge-type">{publication.publication_type}</span>
      )}
      <h1>{publication.title}</h1>
      {publication.authors && <p className="meta-line">{publication.authors}</p>}
      {publication.year && <p className="meta-line">{publication.year}</p>}

      {(publication.abstract || publication.summary) && (
        <section>
          <h3>Abstract</h3>
          <p>{publication.abstract || publication.summary}</p>
        </section>
      )}

      {publication.journal && (
        <p className="meta-line">
          <strong>Journal/Venue: </strong>
          {publication.journal}
        </p>
      )}
      {publication.doi && (
        <p className="meta-line">
          <strong>DOI: </strong>
          {publication.doi}
        </p>
      )}
      {publication.external_url && (
        <a
          href={publication.external_url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          View publication
        </a>
      )}
    </div>
  );
}
