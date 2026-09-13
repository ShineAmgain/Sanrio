import { useApiData } from "../hooks/useApiData";
import { getGrants } from "../api/grants";
import GrantCard from "../components/GrantCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Opportunities() {
  const { data, loading, error, reload } = useApiData(() => getGrants(), []);
  const grants = data?.data || [];

  return (
    <div className="page-container">
      <h1>Opportunities</h1>

      {loading && <LoadingState count={4} />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && grants.length === 0 && (
        <EmptyState message="No opportunities available at the moment." />
      )}
      {!loading && !error && grants.length > 0 && (
        <div className="card-grid card-grid-3">
          {grants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      )}
    </div>
  );
}
