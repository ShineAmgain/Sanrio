import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import { getPublication, getRelatedPublications } from "../api/publications";
import RelatedResearch from "../components/RelatedResearch";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function PublicationDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApiData(() => getPublication(id), [id]);
  const publication = data?.data;

  // Semantically similar publications/projects + other work sharing an
  // author — fetched live from the database.
  const relatedState = useApiData(() => getRelatedPublications(id), [id]);
  const related = relatedState.data?.data;

  if (loading) return <LoadingState count={1} />;
  if (error) return <ErrorState onRetry={reload} />;
  if (!publication) return <EmptyState message="Publication not found." />;

  return (
    <div className="page-container detail-page">
      <BackButton />
      {publication.publication_type && (
        <span className="badge badge-type">{publication.publication_type}</span>
      )}
      <h1>{publication.title}</h1>
      {publication.authors && <p className="meta-line">{publication.authors}</p>}
      {publication.year && <p className="meta-line">{publication.year}</p>}

      {publication.research_areas?.length > 0 && (
        <div className="tag-row" style={{ margin: "0.75rem 0" }}>
          {publication.research_areas.map((area) => (
            <Link key={area.id} to={`/research-areas?area=${area.id}`} className="tag">
              {area.name}
            </Link>
          ))}
        </div>
      )}

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

      {publication.events?.length > 0 && (
        <section>
          <h3>Presented At</h3>
          <div className="related-list">
            {publication.events.map((e) => (
              <Link key={e.id} to={`/events/${e.id}`} className="related-item">
                <h4>{e.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!relatedState.loading && related && (
        <RelatedResearch
          similar={related.similar}
          more={related.moreByAuthors}
          moreLabel="More by these authors"
          moreType="publication"
        />
      )}
    </div>
  );
}
