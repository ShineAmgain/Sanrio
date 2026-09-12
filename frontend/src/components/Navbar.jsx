import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoIcon from "../assets/logo-icon.png";

const RESEARCH_DROPDOWN = [
  { to: "/research-areas", label: "Research Areas" },
  { to: "/research-groups", label: "Research Groups" },
  { to: "/research-support", label: "Research Support" },
  { to: "/ethics", label: "Ethics & Integrity" },
  { to: "/partnerships", label: "Partnerships" },
];

function navLinkClass({ isActive }) {
  return isActive ? "navbar-link active" : "navbar-link";
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim();

    if (!q) return;

    navigate(`/search?q=${encodeURIComponent(q)}`);
    closeMenu();
  }

  return (
    <header className="navbar">
      <div className="navbar-row">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img
            src={logoIcon}
            alt=""
            className="brand-swirl"
            aria-hidden="true"
          />

          <span className="brand-text">
            Research &amp;<br />
            Development
          </span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
        </button>
      </div>

      <nav
        className={menuOpen ? "navbar-links navbar-links-open" : "navbar-links"}
        aria-label="Main navigation"
      >
        <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
          About R&amp;D
        </NavLink>

        <details className="navbar-dropdown">
          <summary className="navbar-link">Research</summary>

          <div className="dropdown-panel">
            {RESEARCH_DROPDOWN.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="dropdown-item"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>

        <NavLink
          to="/researchers"
          className={navLinkClass}
          onClick={closeMenu}
        >
          People
        </NavLink>

        <NavLink to="/projects" className={navLinkClass} onClick={closeMenu}>
          Projects
        </NavLink>

        <NavLink
          to="/publications"
          className={navLinkClass}
          onClick={closeMenu}
        >
          Publications
        </NavLink>

        <NavLink to="/events" className={navLinkClass} onClick={closeMenu}>
          Events
        </NavLink>

        <NavLink
          to="/opportunities"
          className={navLinkClass}
          onClick={closeMenu}
        >
          Grants
        </NavLink>

        <NavLink to="/ijmr" className={navLinkClass} onClick={closeMenu}>
          IJMR
        </NavLink>

        {/* Announcements */}
        <div className="navbar-notification-wrapper">
  <Link
    to="/announcements"
    className="navbar-notification"
    onClick={closeMenu}
    aria-label="Announcements"
  >
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>

    <span className="notification-dot" />
  </Link>

  <div className="announcement-preview">
    <div className="announcement-preview-header">
      <span>Announcements</span>
      <span className="announcement-new">3 new</span>
    </div>

    <div className="announcement-preview-item">
      <strong>TEDx Islington College</strong>
      <span>September 13</span>
    </div>

    <div className="announcement-preview-item">
      <strong>Lens of Hope</strong>
      <span>September 13–20</span>
    </div>

    <Link
      to="/announcements"
      className="announcement-preview-link"
      onClick={closeMenu}
    >
      View all announcements →
    </Link>
  </div>
</div>

        <form
          className="navbar-search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <svg
            className="navbar-search-icon"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search"
            className="navbar-search-input"
          />
        </form>
      </nav>
    </header>
  );
}