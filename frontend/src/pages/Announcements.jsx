import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";
import PageHero from "../components/PageHero";

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

  return (
    <main className="page-container">
      <PageHero
        accent="pink"
        kicker="Research Cell"
        title="Stay in the"
        accentWord="loop."
        description="Stay updated with the latest news, activities and opportunities from the Research Cell."
        stat={
          !loading && !error
            ? {
                number: String(announcements.length).padStart(2, "0"),
                label:
                  announcements.length === 1 ? "Announcement" : "Announcements",
              }
            : undefined
        }
      />

      {loading && (
        <div className="empty-state">
          <p>Loading announcements...</p>
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && announcements.length === 0 && (
        <div className="empty-state">
          <p>No announcements available.</p>
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
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