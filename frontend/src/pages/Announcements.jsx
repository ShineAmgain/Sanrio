import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await fetch(`${API_BASE}/api/announcements`);

        if (!response.ok) {
          throw new Error("Failed to load announcements");
        }

        const result = await response.json();

        setAnnouncements(result.data || []);
      } catch (err) {
        console.error("Announcements error:", err);
        setError("Unable to load announcements.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="page-shell">
        <section className="page-header">
          <p className="section-eyebrow">RESEARCH CELL</p>
          <h1>Announcements</h1>
          <p>
            Stay updated with the latest news, activities and opportunities
            from the Research Cell.
          </p>
        </section>

        <div className="empty-state">
          <p>Loading announcements...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <section className="page-header">
          <p className="section-eyebrow">RESEARCH CELL</p>
          <h1>Announcements</h1>
          <p>
            Stay updated with the latest news, activities and opportunities
            from the Research Cell.
          </p>
        </section>

        <div className="empty-state">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="section-eyebrow">RESEARCH CELL</p>

        <h1>Announcements</h1>

        <p>
          Stay updated with the latest news, activities and opportunities
          from the Research Cell.
        </p>
      </section>

      {announcements.length === 0 ? (
        <div className="empty-state">
          <p>No announcements available.</p>
        </div>
      ) : (
        <section className="card-grid card-grid-3">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="generic-card announcement-card"
            >
              <div className="card-meta">
                <span className="badge badge-type">Announcement</span>

                {announcement.publish_at && (
                  <span className="muted">
                    {formatDate(announcement.publish_at)}
                  </span>
                )}
              </div>

              <h2>{announcement.title}</h2>

              <p>{announcement.content}</p>

              {announcement.expires_at && (
                <p className="muted announcement-expiry">
                  Until {formatDate(announcement.expires_at)}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}