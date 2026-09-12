import { Link, NavLink } from "react-router-dom";
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
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logoIcon} alt="" className="brand-swirl" aria-hidden="true" />
        <span className="brand-text">
          Research &amp;<br />Development
        </span>
      </Link>

      <nav className="navbar-links" aria-label="Main navigation">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/about" className={navLinkClass}>About R&amp;D</NavLink>

        <details className="navbar-dropdown">
          <summary className="navbar-link">Research</summary>
          <div className="dropdown-panel">
            {RESEARCH_DROPDOWN.map((item) => (
              <Link key={item.to} to={item.to} className="dropdown-item">
                {item.label}
              </Link>
            ))}
          </div>
        </details>

        <NavLink to="/researchers" className={navLinkClass}>People</NavLink>
        <NavLink to="/projects" className={navLinkClass}>Projects</NavLink>
        <NavLink to="/publications" className={navLinkClass}>Publications</NavLink>
        <NavLink to="/events" className={navLinkClass}>Events</NavLink>
        <NavLink to="/opportunities" className={navLinkClass}>Grants</NavLink>
        <NavLink to="/ijmr" className={navLinkClass}>IJMR</NavLink>
      </nav>
    </header>
  );
}
