import { Link } from "react-router-dom";
import logoIcon from "../assets/logo-icon.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <img src={logoIcon} alt="" className="brand-swirl" aria-hidden="true" />
            <p>
              Supporting research, innovation, and publications across
              Islington College — from faculty projects to the IJMR journal.
            </p>
          </div>

          <div className="footer-social" aria-label="Social links">
            <a
              href="https://www.instagram.com/islingtonresearchcommunity/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/islington-research-commmunity/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <div className="footer-column">
            <span className="footer-column-title">Research</span>
            <Link to="/projects">Projects</Link>
            <Link to="/publications">Publications</Link>
            <Link to="/research-areas">Research Areas</Link>
            <Link to="/research-groups">Research Groups</Link>
            <Link to="/research-support">Research Support</Link>
          </div>

          <div className="footer-column">
            <span className="footer-column-title">Community</span>
            <Link to="/researchers">People</Link>
            <Link to="/events">Our Events</Link>
            <Link to="/opportunities">Grants &amp; Funding</Link>
            <Link to="/ijmr">IJMR</Link>
            <Link to="/partnerships">Partnerships</Link>
            <Link to="/ethics">Ethics &amp; Integrity</Link>
          </div>

          <div className="footer-column">
            <span className="footer-column-title">About</span>
            <Link to="/about">About R&amp;D</Link>
            <Link to="/announcements">Announcements</Link>
            <Link to="/search">Search</Link>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <a href="mailto:academic.research@islingtoncollege.edu.np">
          academic.research@islingtoncollege.edu.np
        </a>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/cookies">Cookies Settings</Link>
        </div>
      </div>
    </footer>
  );
}