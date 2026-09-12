import logoIcon from "../assets/logo-icon.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={logoIcon} alt="" className="brand-swirl" aria-hidden="true" />
          <p>
            Supporting research, innovation, and publications across
            Islington College — from faculty projects to the IJMR journal.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/about">About Us</a>
          <a href="/research-areas">Research Areas</a>
          <a href="/research-support">Research Support</a>
          <a href="/ethics">Ethics &amp; Integrity</a>
          <a href="/partnerships">Partnerships</a>
          <a href="/events">Our Events</a>
          <a href="/ijmr">IJMR</a>
        </nav>

        <div className="footer-social" aria-label="Social links">
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="X">X</a>
          <a href="#" aria-label="LinkedIn">IN</a>
          <a href="#" aria-label="YouTube">YT</a>
        </div>
      </div>

      <div className="footer-bottom">
        <a href="mailto:academic.research@islingtoncollege.edu.np">
          academic.research@islingtoncollege.edu.np
        </a>
        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookies Settings</a>
        </div>
      </div>
    </footer>
  );
}
