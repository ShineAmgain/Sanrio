import { useApiData } from "../hooks/useApiData";
import { getIjmr } from "../api/ijmr";
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
      <h1>Islington Journal of Multidisciplinary Research (IJMR)</h1>

      <p className="detail-lead">
        IJMR is Islington College's peer-reviewed multidisciplinary research
        journal. This hub links out to the journal rather than duplicating
        its submission or editorial system.
      </p>

      <div className="detail-actions">
        <a href={IJMR_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
          Visit IJMR
        </a>
        <a href={`${IJMR_URL}/submit`} target="_blank" rel="noreferrer" className="btn btn-secondary">
          Submit a Paper
        </a>
        <a href={`${IJMR_URL}/current-issue`} target="_blank" rel="noreferrer" className="btn btn-secondary">
          View Current Issue
        </a>
      </div>

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
          <h3>Latest from IJMR</h3>
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
