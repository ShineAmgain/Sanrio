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
    <div className="opportunities-page">
      <div className="opportunities-header">
        <div>
          <span className="opportunities-label">RESEARCH & ACADEMIA</span>
          <h1>Opportunities</h1>
          <p>
            Explore grants and funding opportunities that can support research,
            academic work, and new ideas.
          </p>
        </div>
      </div>

      {loading && (
        <div className="opportunities-content">
          <LoadingState count={4} />
        </div>
      )}

      {error && (
        <div className="opportunities-content">
          <ErrorState onRetry={reload} />
        </div>
      )}

      {!loading && !error && grants.length === 0 && (
        <div className="opportunities-content">
          <EmptyState message="No opportunities available at the moment." />
        </div>
      )}

      {!loading && !error && grants.length > 0 && (
        <div className="opportunities-grid">
          {grants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      )}
    </div>
  );
}