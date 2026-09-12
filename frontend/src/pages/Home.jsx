import { Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { getProjects } from "../api/projects";
import { getResearchers } from "../api/researchers";
import { getPublications } from "../api/publications";
import { getEvents } from "../api/events";
import { getGrants } from "../api/grants";
import { getIjmr } from "../api/ijmr";
import SearchBar from "../components/SearchBar";
import ProjectCard from "../components/ProjectCard";
import PublicationCard from "../components/PublicationCard";
import EventCard from "../components/EventCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const IJMR_URL = "https://ijmr.islingtoncollege.edu.np";

export default function Home() {
  const projects = useApiData(() => getProjects(), []);
  const researchers = useApiData(() => getResearchers(), []);
  const publications = useApiData(() => getPublications(), []);
  const events = useApiData(() => getEvents(), []);
  const grants = useApiData(() => getGrants(), []);
  const ijmr = useApiData(() => getIjmr(), []);

  const projectList = projects.data?.data || [];
  const researcherList = researchers.data?.data || [];
  const publicationList = publications.data?.data || [];
  const eventList = events.data?.data || [];
  const grantList = grants.data?.data || [];
  const ijmrLinks = ijmr.data?.data || [];

  return (
    <div className="home-page">
      <section className="hero">
        <h1>
          Research &amp; <span className="accent">Development</span>
        </h1>
        <p className="hero-subtitle">
          Explore and connect with the R&amp;D community through research,
          projects, publications, events and grants/opportunities.
        </p>

        <SearchBar />

        <div className="hero-stats">
          <div className="stat-pill">
            <strong>{researcherList.length || "20+"}</strong>
            <span>Researchers</span>
          </div>
          <div className="stat-pill">
            <strong>{projectList.length || "50+"}</strong>
            <span>Projects</span>
          </div>
          <div className="stat-pill">
            <strong>{publicationList.length || "50+"}</strong>
            <span>Publications</span>
          </div>
          <div className="stat-pill">
            <strong>{eventList.length}</strong>
            <span>Events</span>
          </div>
          <div className="stat-pill">
            <strong>{grantList.length}</strong>
            <span>Opportunities</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Recent Projects</h2>
          <Link to="/projects" className="link-arrow">
            View more
          </Link>
        </div>

        {projects.loading && <LoadingState count={4} />}
        {projects.error && (
          <ErrorState onRetry={projects.reload} />
        )}
        {!projects.loading && !projects.error && projectList.length === 0 && (
          <EmptyState message="No projects available yet." />
        )}
        {!projects.loading && !projects.error && projectList.length > 0 && (
          <div className="card-grid card-grid-4">
            {projectList.slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Publications</h2>
        <div className="split-section">
          <div className="split-main">
            {publications.loading && <LoadingState count={4} />}
            {publications.error && <ErrorState onRetry={publications.reload} />}
            {!publications.loading &&
              !publications.error &&
              publicationList.length === 0 && (
                <EmptyState message="No publications available yet." />
              )}
            {!publications.loading &&
              !publications.error &&
              publicationList.length > 0 && (
                <div className="card-grid card-grid-2">
                  {publicationList.slice(0, 4).map((pub) => (
                    <PublicationCard key={pub.id} publication={pub} />
                  ))}
                </div>
              )}
          </div>
          <aside className="split-feature">
            <h3>Explore Scholarly Research</h3>
            <p>Dive into published work from across the department.</p>
            <Link to="/publications" className="btn btn-light">
              View Research
            </Link>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Featured Researchers</h2>
          <Link to="/researchers" className="link-arrow">
            Discover Our Research Community
          </Link>
        </div>

        {researchers.loading && <LoadingState count={4} />}
        {researchers.error && <ErrorState onRetry={researchers.reload} />}
        {!researchers.loading &&
          !researchers.error &&
          researcherList.length === 0 && (
            <EmptyState message="No researchers available yet." />
          )}
        {!researchers.loading &&
          !researchers.error &&
          researcherList.length > 0 && (
            <div className="avatar-row">
              {researcherList.slice(0, 4).map((r) => (
                <Link
                  to={`/researchers/${r.id}`}
                  key={r.id}
                  className="avatar-item"
                >
                  <div className="avatar-circle" aria-hidden="true" />
                  <strong>{r.name}</strong>
                  <span className="muted">{r.position || "Researcher"}</span>
                </Link>
              ))}
            </div>
          )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <Link to="/events" className="link-arrow">
            Explore all events
          </Link>
        </div>

        {events.loading && <LoadingState count={3} />}
        {events.error && <ErrorState onRetry={events.reload} />}
        {!events.loading && !events.error && eventList.length === 0 && (
          <EmptyState message="No upcoming events found." />
        )}
        {!events.loading && !events.error && eventList.length > 0 && (
          <div className="list-stack">
            {eventList.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="section cta-section">
        <h2>Support for your Next Chapter</h2>
        <p>
          Explore funding opportunities, grants, and financial support
          available for researchers and research teams. Discover
          opportunities that support innovative projects, encourage
          collaboration, and help turn meaningful research ideas into
          impactful outcomes.
        </p>
        <Link to="/opportunities" className="btn btn-primary">
          Explore grant opportunities
        </Link>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Islington Journal of Multidisciplinary Research (IJMR)</h2>
          <Link to="/ijmr" className="link-arrow">
            Visit IJMR
          </Link>
        </div>

        {ijmr.loading && <LoadingState count={3} />}
        {ijmr.error && <ErrorState onRetry={ijmr.reload} />}
        {!ijmr.loading && !ijmr.error && ijmrLinks.length === 0 && (
          <EmptyState message="IJMR links are not available right now." />
        )}
        {!ijmr.loading && !ijmr.error && ijmrLinks.length > 0 && (
          <div className="card-grid card-grid-3">
            {ijmrLinks.slice(0, 3).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="grant-card"
              >
                <h3>{link.title}</h3>
                {link.description && (
                  <p className="card-snippet">{link.description}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
