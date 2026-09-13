import { useApiData } from "../hooks/useApiData";
import { getPublications } from "../api/publications";
import PublicationCard from "../components/PublicationCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Publications() {
  const { data, loading, error, reload } = useApiData(() => getPublications(), []);
  const publications = data?.data || [];

  return (
    <div className="page-container">
      <h1>Publications</h1>

      {loading && <LoadingState count={6} />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && publications.length === 0 && (
        <EmptyState message="No publications available yet." />
      )}
      {!loading && !error && publications.length > 0 && (
        <div className="card-grid card-grid-3">
          {publications.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>
      )}
    </div>
  );
}
