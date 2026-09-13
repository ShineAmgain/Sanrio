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

  if (loading) {
    return (
      <div className="opportunity-detail-page">
        <div className="opportunity-detail-container">
          <LoadingState count={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunity-detail-page">
        <div className="opportunity-detail-container">
          <ErrorState onRetry={reload} />
        </div>
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="opportunity-detail-page">
        <div className="opportunity-detail-container">
          <EmptyState message="Opportunity not found." />
        </div>
      </div>
    );
  }

  return (
    <div className="opportunity-detail-page">
      <div className="opportunity-detail-container">

        <div className="opportunity-detail-back">
          <BackButton />
        </div>

        <header className="opportunity-detail-header">

          <div className="opportunity-detail-kicker">
            <span className="opportunity-detail-kicker-line"></span>
            FUNDING OPPORTUNITY
          </div>

          {grant.funding_type && (
            <span className="opportunity-detail-type">
              {grant.funding_type}
            </span>
          )}

          <h1>{grant.title}</h1>

          {grant.provider && (
            <p className="opportunity-detail-provider">
              {grant.provider}
            </p>
          )}

          {grant.description && (
            <p className="opportunity-detail-lead">
              {grant.description}
            </p>
          )}

          {(grant.amount || grant.deadline) && (
            <div className="opportunity-detail-meta">

              {grant.amount && (
                <div className="opportunity-detail-meta-item">
                  <span className="opportunity-detail-meta-label">
                    FUNDING
                  </span>
                  <span className="opportunity-detail-meta-value">
                    {grant.amount}
                  </span>
                </div>
              )}

              {grant.deadline && (
                <div className="opportunity-detail-meta-item">
                  <span className="opportunity-detail-meta-label">
                    DEADLINE
                  </span>
                  <span className="opportunity-detail-meta-value">
                    {grant.deadline}
                  </span>
                </div>
              )}

            </div>
          )}
        </header>

        <div className="opportunity-detail-layout">

          <main className="opportunity-detail-main">

            {grant.research_areas?.length > 0 && (
              <section className="opportunity-detail-section">
                <div className="opportunity-detail-section-heading">
                  <span className="opportunity-detail-section-marker"></span>
                  Research Areas
                </div>

                <div className="opportunity-detail-tags">
                  {grant.research_areas.map((area) => (
                    <Link
                      key={area.id}
                      to={`/research-areas?area=${area.id}`}
                      className="opportunity-detail-tag"
                    >
                      {area.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {grant.eligibility && (
              <section className="opportunity-detail-section">
                <div className="opportunity-detail-section-heading">
                  <span className="opportunity-detail-section-marker"></span>
                  Eligibility
                </div>

                <p className="opportunity-detail-text">
                  {grant.eligibility}
                </p>
              </section>
            )}

            {grant.requirements && (
              <section className="opportunity-detail-section">
                <div className="opportunity-detail-section-heading">
                  <span className="opportunity-detail-section-marker"></span>
                  Requirements
                </div>

                <p className="opportunity-detail-text">
                  {grant.requirements}
                </p>
              </section>
            )}

            {grant.application_process && (
              <section className="opportunity-detail-section">
                <div className="opportunity-detail-section-heading">
                  <span className="opportunity-detail-section-marker"></span>
                  Application Process
                </div>

                <p className="opportunity-detail-text">
                  {grant.application_process}
                </p>
              </section>
            )}

            {grant.projects?.length > 0 && (
              <section className="opportunity-detail-section">
                <div className="opportunity-detail-section-heading">
                  <span className="opportunity-detail-section-marker"></span>
                  Funded Projects
                </div>

                <div className="opportunity-related-list">
                  {grant.projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="opportunity-related-item"
                    >
                      <div>
                        <h4>{project.title}</h4>

                        {project.status && (
                          <p>
                            Status: {project.status}
                          </p>
                        )}
                      </div>

                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </main>

          <aside className="opportunity-detail-sidebar">

            <div className="opportunity-action-card">

              <div className="opportunity-action-label">
                NEXT STEP
              </div>

              <h3>Interested in this opportunity?</h3>

              <p>
                Review the available information and follow the application
                resources below.
              </p>

              <div className="opportunity-detail-actions">

                {grant.external_url && (
                  <a
                    href={grant.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="opportunity-btn opportunity-btn-primary"
                  >
                    Apply
                    <span aria-hidden="true">↗</span>
                  </a>
                )}

                {grant.guidelines_url && (
                  <a
                    href={grant.guidelines_url}
                    target="_blank"
                    rel="noreferrer"
                    className="opportunity-btn opportunity-btn-secondary"
                  >
                    View Guidelines
                  </a>
                )}

              </div>

            </div>

            {grant.contact && (
              <div className="opportunity-contact-card">
                <span className="opportunity-contact-label">
                  CONTACT
                </span>

                <p>{grant.contact}</p>
              </div>
            )}

          </aside>

        </div>
      </div>
    </div>
  );
}