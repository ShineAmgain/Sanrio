import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useApiData } from "../hooks/useApiData";
import { getGrant } from "../api/grants";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function OpportunityDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApiData(() => getGrant(id), [id]);
  const grant = data?.data;

  if (loading) return <LoadingState count={1} />;
  if (error) return <ErrorState onRetry={reload} />;
  if (!grant) return <EmptyState message="Opportunity not found." />;

  return (
    <div className="page-container detail-page">
      <BackButton />
      {grant.funding_type && <span className="badge badge-type">{grant.funding_type}</span>}
      <h1>{grant.title}</h1>
      {grant.provider && <p className="meta-line">{grant.provider}</p>}
      {grant.description && <p className="detail-lead">{grant.description}</p>}

      {grant.research_areas?.length > 0 && (
        <div className="tag-row" style={{ margin: "0.75rem 0" }}>
          {grant.research_areas.map((area) => (
            <Link key={area.id} to={`/research-areas?area=${area.id}`} className="tag">
              {area.name}
            </Link>
          ))}
        </div>
      )}

      {grant.amount && (
        <p className="meta-line">
          <strong>Amount: </strong>
          {grant.amount}
        </p>
      )}
      {grant.deadline && (
        <p className="meta-line">
          <strong>Deadline: </strong>
          {grant.deadline}
        </p>
      )}
      {grant.eligibility && (
        <section>
          <h3>Eligibility</h3>
          <p>{grant.eligibility}</p>
        </section>
      )}
      {grant.requirements && (
        <section>
          <h3>Requirements</h3>
          <p>{grant.requirements}</p>
        </section>
      )}
      {grant.application_process && (
        <section>
          <h3>Application Process</h3>
          <p>{grant.application_process}</p>
        </section>
      )}

      {grant.projects?.length > 0 && (
        <section>
          <h3>Funded Projects</h3>
          <div className="related-list">
            {grant.projects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="related-item">
                <h4>{p.title}</h4>
                {p.status && <p className="muted">Status: {p.status}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="detail-actions">
        {grant.external_url && (
          <a href={grant.external_url} target="_blank" rel="noreferrer" className="btn btn-primary">
            Apply
          </a>
        )}
        {grant.guidelines_url && (
          <a
            href={grant.guidelines_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            Guidelines
          </a>
        )}
      </div>

      {grant.contact && <p className="meta-line">Contact: {grant.contact}</p>}
    </div>
  );
}
