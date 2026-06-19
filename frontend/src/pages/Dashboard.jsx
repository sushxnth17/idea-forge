import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";

const quickActions = [
  {
    to: "/create",
    title: "Create idea",
    description: "Draft and publish a new idea from a focused workspace.",
    icon: "✍️"
  },
  {
    to: "/search",
    title: "Search ideas",
    description: "Find inspiration across the live idea catalog.",
    icon: "🔎"
  },
  {
    to: "/feed",
    title: "Review feed",
    description: "Scan the latest ideas and community activity.",
    icon: "📰"
  }
];

const featureOverview = [
  {
    to: "/trending",
    title: "Trend radar",
    description: "See what is gaining momentum across the platform.",
    icon: "🔥"
  },
  {
    to: "/bookmarks",
    title: "Saved concepts",
    description: "Return to ideas you want to revisit later.",
    icon: "⭐"
  },
  {
    to: "/notifications",
    title: "Activity inbox",
    description: "Track updates, responses, and important signals.",
    icon: "🔔"
  },
  
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topIdeaStatus, setTopIdeaStatus] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get("/users/dashboard/stats");
        setStats(response.data);
        if (response.data?.most_popular_idea?.id) {
          try {
            const detailResponse = await api.get(`/public/ideas/${response.data.most_popular_idea.id}`);
            setTopIdeaStatus(detailResponse.data.status);
          } catch (err) {
            console.error("Error fetching popular idea details:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <AppLayout>
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div className="dashboard-hero__content card">
            <p className="page__eyebrow">Workspace</p>
            <h1>Dashboard</h1>
            <p className="page__lead muted">
              A modern home for IdeaForge. Move between creation, discovery, and engagement from one clean workspace.
            </p>

            <div className="dashboard-hero__stats" aria-label="Dashboard status">
              
            </div>

            <div className="dashboard-hero__actions">
              <Link to="/create" className="button button--primary">
                Start an idea
              </Link>
            </div>
          </div>

          <aside className="dashboard-hero__panel card">
            <div className="dashboard-hero__panel-copy">
              <p className="dashboard-hero__panel-label">Account</p>

              <h3>Manage your account</h3>

              <p className="muted">
                View your profile, check notifications, or sign out of your session.
              </p>
            </div>

            <div className="dashboard-hero__actions">
              <Link
                to="/profile"
                className="button button--primary"
              >
                Profile
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="button button--secondary button--full"
            >
              Logout
            </button>
          </aside>
        </section>

        {/* Creator Analytics Section */}
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <div>
              <p className="page__eyebrow">Analytics</p>
              <h2>Creator Activity & Engagement</h2>
            </div>
          </div>

          {loading && (
            <div className="loading-state card">
              <h3>Loading stats...</h3>
              <p className="muted">Retrieving creator engagement records from the database.</p>
            </div>
          )}

          {!loading && stats && (
            <div className="section-grid">
              {/* ideas_posted card */}
              <div className="card card--interactive">
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>💡</div>
                <h3>Ideas Posted</h3>
                <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "12px 0 0 0", fontFamily: "var(--font-display)" }}>
                  {stats.ideas_posted}
                </p>
              </div>

              {/* likes_received card */}
              <div className="card card--interactive">
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>❤️</div>
                <h3>Likes Received</h3>
                <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "12px 0 0 0", fontFamily: "var(--font-display)" }}>
                  {stats.total_likes_received}
                </p>
              </div>

              {/* comments_received card */}
              <div className="card card--interactive">
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>💬</div>
                <h3>Comments Received</h3>
                <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "12px 0 0 0", fontFamily: "var(--font-display)" }}>
                  {stats.total_comments_received}
                </p>
              </div>

              {/* followers card */}
              <div className="card card--interactive">
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>👥</div>
                <h3>Followers</h3>
                <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "12px 0 0 0", fontFamily: "var(--font-display)" }}>
                  {stats.followers_count}
                </p>
              </div>

              {/* bookmarks card */}
              <div className="card card--interactive">
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔖</div>
                <h3>Bookmarks Saved</h3>
                <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "12px 0 0 0", fontFamily: "var(--font-display)" }}>
                  {stats.bookmarks_received}
                </p>
              </div>

              {/* Top Performing Idea or Empty State */}
              {stats.ideas_posted > 0 ? (
                <div className="card card--interactive panel" style={{ gridColumn: "span 1" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>🏆</div>
                  <h3>Top Performing Idea</h3>
                  {stats.most_popular_idea ? (
                    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <Link to={`/ideas/${stats.most_popular_idea.id}`} style={{ textDecoration: "underline", fontWeight: "bold" }}>
                          {stats.most_popular_idea.title}
                        </Link>
                        {topIdeaStatus && <StatusBadge status={topIdeaStatus} />}
                      </div>
                      <span className="badge" style={{ width: "fit-content" }}>
                        ❤️ {stats.most_popular_idea.likes} {stats.most_popular_idea.likes === 1 ? "Like" : "Likes"}
                      </span>
                    </div>
                  ) : (
                    <p className="muted" style={{ marginTop: 12 }}>No engagement on your ideas yet.</p>
                  )}
                </div>
              ) : (
                <div className="card panel" style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>📭</div>
                    <h3>No ideas yet</h3>
                    <p className="muted" style={{ marginTop: 8 }}>
                      No ideas yet. Start building your first idea.
                    </p>
                  </div>
                  <Link to="/create" className="button button--primary" style={{ width: "fit-content" }}>
                    Write your first idea
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <div>
              <p className="page__eyebrow">Quick actions</p>
              <h2>Jump to the most common flows</h2>
            </div>
          </div>

          <div className="dashboard-actions-grid">
            {quickActions.map((item) => (
              <Link key={item.to} to={item.to} className="dashboard-action-card card card--interactive">
                <div className="dashboard-action-card__icon">{item.icon}</div>
                <div className="dashboard-action-card__body">
                  <h3>{item.title}</h3>
                  <p className="muted">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <div>
              <p className="page__eyebrow">Feature overview</p>
              <h2>Explore the product surface</h2>
            </div>
          </div>

          <div className="dashboard-features-grid">
            {featureOverview.map((item) => (
              <Link key={item.to} to={item.to} className="dashboard-feature-card card card--interactive">
                <div className="dashboard-feature-card__icon">{item.icon}</div>
                <div className="dashboard-feature-card__body">
                  <h3>{item.title}</h3>
                  <p className="muted">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
