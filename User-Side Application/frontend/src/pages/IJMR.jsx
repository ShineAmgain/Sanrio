import { useApiData } from "../hooks/useApiData";
import { getIjmr } from "../api/ijmr";
import PageHero from "../components/PageHero";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

// IJMR remains a separate journal platform — this page is a gateway/
// integration layer only, so the intro/about copy below stays static.
// GET /api/ijmr (Supabase table: ijmr_links) supplies whatever dynamic
// links or issue callouts you want listed underneath. Assumed columns:
// title, url, description — adjust if your schema differs.
const IJMR_URL = "https://ijmr.islingtoncollege.edu.np";

export default function IJMR() {
  const { data, loading, error, reload } = useApiData(() => getIjmr(), []);
  const links = data?.data || [];

  return (
    <div className="page-container detail-page">
      <PageHero
        accent="orange"
        kicker="Research & Development / IJMR"
        title="Multidisciplinary"
        accentWord="research."
        description="The Islington Journal of Multidisciplinary Research (IJMR) is Islington College's peer-reviewed research journal. This hub links out to the journal rather than duplicating its submission or editorial system."
      />

 

      <section>
        <h3>About IJMR</h3>
        <p>
          IJMR publishes original research across computing, business,
          management, and interdisciplinary fields, with a focus on
          applied and industry-relevant work from the Islington College
          research community.
        </p>
      </section>

      {loading && <LoadingState count={2} />}
      {error && <ErrorState onRetry={reload} />}

      {!loading && !error && links.length > 0 && (
        <section>
          <div className="researcher-section-header">
            <h3>Latest from IJMR</h3>
            <a
              href={`${IJMR_URL}/current-issue`}
              target="https://ijmr.islingtoncollege.edu.np/index.php/IJMR/issue/view/2"
              rel="noreferrer"
              className="researcher-explore-button"
            >
              View current issue
              <span>→</span>
            </a>
          </div>
          <div className="related-list">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="related-item"
              >
                <h4>{link.title}</h4>
                {link.description && <p className="muted">{link.description}</p>}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
