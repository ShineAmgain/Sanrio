import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoIcon from "../assets/logo-icon.png";

const RESEARCH_DROPDOWN = [
  { to: "/projects", label: "Projects" },
  { to: "/publications", label: "Publications" },
  { to: "/research-areas", label: "Research Areas" },
  { to: "/research-groups", label: "Research Groups" },
  { to: "/research-support", label: "Research Support" },
];

const COMMUNITY_DROPDOWN = [
  { to: "/events", label: "Events" },
  { to: "/opportunities", label: "Grants & Funding" },
  { to: "/ijmr", label: "IJMR" },
  { to: "/partnerships", label: "Partnerships" },
  { to: "/ethics", label: "Ethics & Integrity" },
];

function navLinkClass({ isActive }) {
  return isActive ? "navbar-link active" : "navbar-link";
}

function NavDropdown({ label, items, onNavigate }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  function handleSelect() {
    setOpen(false);
    onNavigate();
  }

  return (
    <div className="navbar-dropdown" ref={containerRef}>
      <button
        type="button"
        className="navbar-link navbar-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <svg
          className="navbar-dropdown-caret"
          viewBox="0 0 24 24"
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="dropdown-panel">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="dropdown-item"
              onClick={handleSelect}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
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

        <NavLink
          to="/researchers"
          className={navLinkClass}
          onClick={closeMenu}
        >
          People
        </NavLink>

        <NavDropdown
          label="Research"
          items={RESEARCH_DROPDOWN}
          onNavigate={closeMenu}
        />

        <NavDropdown
          label="Community"
          items={COMMUNITY_DROPDOWN}
          onNavigate={closeMenu}
        />

        <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
          About R&amp;D
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