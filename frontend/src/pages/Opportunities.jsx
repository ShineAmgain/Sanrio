import { useApiData } from "../hooks/useApiData";
import { getGrants } from "../api/grants";
import GrantCard from "../components/GrantCard";
import PageHero from "../components/PageHero";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Opportunities() {
  const { data, loading, error, reload } = useApiData(() => getGrants(), []);
  const grants = data?.data || [];

  return (
    <div className="opportunities-page">
      <PageHero
        accent="purple"
        kicker="Research & Academia"
        title="Fund the"
        accentWord="future."
        description="Explore grants and funding opportunities that can support research, academic work, and new ideas."
        stat={{
          number: String(grants.length).padStart(2, "0"),
          label: grants.length === 1 ? "Opportunity" : "Opportunities",
        }}
      />

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