import { useApiData } from "../hooks/useApiData";
import { getEthics } from "../api/ethics";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// Pulled from GET /api/ethics (Supabase table: ethics_entries). Assumed
// columns: title, body — adjust the field names below if your actual
// schema differs.
export default function Ethics() {
  const { data, loading, error, reload } = useApiData(() => getEthics(), []);
  const entries = data?.data || [];

  return (
    <div className="page-container detail-page">
      <h1>Ethics &amp; Research Integrity</h1>

      {loading && <LoadingState count={4} />}
      {error && <ErrorState onRetry={reload} />}

      {!loading && !error && entries.length === 0 && (
        <EmptyState message="No ethics &amp; integrity content published yet." />
      )}

      {!loading &&
        !error &&
        entries.map((entry) => (
          <section key={entry.id}>
            <h3>{entry.title}</h3>
            <p>{entry.body || entry.description}</p>
          </section>
        ))}
    </div>
  );
}
