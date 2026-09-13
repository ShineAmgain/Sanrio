import { useApiData } from "../hooks/useApiData";
import BackButton from "../components/BackButton";
import { getPartners } from "../api/partners";
import PageHero from "../components/PageHero";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// Pulled from GET /api/partners (Supabase table: partners). Assumed
// columns: name, category, description, url — adjust the field names
// below if your actual schema differs.
export default function Partnerships() {
  const { data, loading, error, reload } = useApiData(() => getPartners(), []);
  const partners = data?.data || [];

  const grouped = partners.reduce((acc, p) => {
    const key = p.category || "Partners";
    acc[key] = acc[key] || [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <BackButton />

      <PageHero
        accent="blue"
        kicker="Research & Development / Partnerships"
        title="Better"
        accentWord="together."
        description="The organisations, industry partners and institutions collaborating with our research community."
        stat={{
          number: String(partners.length).padStart(2, "0"),
          label: partners.length === 1 ? "Partner" : "Partners",
        }}
      />

      {loading && <LoadingState count={4} />}
      {error && <ErrorState onRetry={reload} />}

      {!loading && !error && partners.length === 0 && (
        <EmptyState message="No partners published yet." />
      )}

      {!loading && !error && partners.length > 0 &&
        Object.entries(grouped).map(([label, group]) => (
          <section key={label} style={{ marginBottom: "2rem" }}>
            <h3>{label}</h3>
            <div className="tag-row">
              {group.map((p) =>
                p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="tag" key={p.id}>
                    {p.name}
                  </a>
                ) : (
                  <span className="tag" key={p.id}>
                    {p.name}
                  </span>
                )
              )}
            </div>
          </section>
        ))}
    </div>
  );
}
