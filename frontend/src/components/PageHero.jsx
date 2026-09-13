/**
 * Shared hero header for listing pages: a small kicker line, a big heading
 * with one accent word, an optional description, and an optional stat
 * (e.g. "14 Publications") aligned to the right. Every top-level list page
 * should use this instead of rolling its own header, so the site reads as
 * one design instead of a different header treatment per page.
 *
 * accent: "pink" | "blue" | "green" | "orange" | "purple" — picks which
 * swirl color from the logo is used for this page's kicker dash, accent
 * word, and stat divider.
 */
export default function PageHero({
  kicker,
  title,
  accentWord,
  description,
  stat,
  accent = "pink",
  children,
}) {
  return (
    <header className={`page-hero page-hero--${accent}`}>
      <div className="page-hero-main">
        {kicker && (
          <div className="page-hero-kicker">
            <span className="page-hero-kicker-line" />
            {kicker}
          </div>
        )}

        <h1>
          {title}
          {accentWord && <span className="accent"> {accentWord}</span>}
        </h1>

        {description && (
          <p className="page-hero-description">{description}</p>
        )}
      </div>

      <div className="page-hero-controls">
        {stat && (
          <div className="page-hero-stat">
            <span className="page-hero-stat-number">{stat.number}</span>
            <span className="page-hero-stat-label">{stat.label}</span>
          </div>
        )}
        {children}
      </div>
    </header>
  );
}
