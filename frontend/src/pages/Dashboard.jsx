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

  // Collaboration state
  const [collabRequests, setCollabRequests] = useState([]);
  const [collabLoading, setCollabLoading] = useState(true);

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

    async function fetchCollabRequests() {
      try {
        const response = await api.get("/collaboration-requests/incoming");
        setCollabRequests(response.data);
      } catch (error) {
        console.error("Error fetching incoming collaboration requests:", error);
      } finally {
        setCollabLoading(false);
      }
    }

    fetchStats();
    fetchCollabRequests();
  }, []);

  async function handleUpdateCollabStatus(requestId, action) {
    try {
      const response = await api.patch(`/collaboration-requests/${requestId}/${action}`);
      setCollabRequests(prev =>
        prev.map(req => req.id === requestId ? response.data : req)
      );
    } catch (error) {
      console.error(`Error performing action ${action} on request ${requestId}:`, error);
      alert(error.response?.data?.detail || `Failed to ${action} collaboration request.`);
    }
  }

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

        {/* Collaboration Requests Section */}
        <section className="dashboard-section" style={{ marginTop: 32 }}>
          <div className="dashboard-section__header">
            <div>
              <p className="page__eyebrow">Collaboration</p>
              <h2>Incoming Requests</h2>
            </div>
          </div>

          {collabLoading && (
            <div className="loading-state card">
              <h3>Loading requests...</h3>
              <p className="muted">Retrieving incoming collaboration requests from the database.</p>
            </div>
          )}

          {!collabLoading && collabRequests.length === 0 && (
            <div className="card panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🤝</div>
              <h3>No incoming requests</h3>
              <p className="muted">When other creators want to collaborate on your ideas, they will show up here.</p>
            </div>
          )}

          {!collabLoading && collabRequests.length > 0 && (
            <div style={{ display: "grid", gap: "16px" }}>
              {collabRequests.map((req) => (
                <div key={req.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {req.requester?.profile_picture ? (
                        <img src={req.requester.profile_picture} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid black" }} />
                      ) : (
                        <span style={{ fontSize: "1.2rem" }}>👤</span>
                      )}
                      <strong className="badge badge--muted">
                        @{req.requester?.username || `user_${req.requester_id}`}
                      </strong>
                      <span>requested to collaborate on</span>
                      <Link to={`/ideas/${req.idea_id}`} style={{ textDecoration: "underline", fontWeight: "bold" }}>
                        {req.idea?.title || `Idea #${req.idea_id}`}
                      </Link>
                    </div>
                    <p style={{ margin: "12px 0 6px 0", fontSize: "0.95rem", color: "var(--text-strong)" }}>
                      "{req.message}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.85rem" }}>
                      <span className={`badge ${req.status === "accepted" ? "badge--success" : req.status === "rejected" ? "badge--danger" : "badge--warning"}`} style={{ padding: "2px 8px", fontSize: "0.75rem" }}>
                        {req.status.toUpperCase()}
                      </span>
                      <span className="muted">
                        {new Date(req.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {req.status === "pending" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateCollabStatus(req.id, "accept")}
                        className="button button--primary"
                        style={{ minHeight: "38px", padding: "8px 14px", fontSize: "0.85rem", background: "var(--success)", color: "white" }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateCollabStatus(req.id, "reject")}
                        className="button button--secondary"
                        style={{ minHeight: "38px", padding: "8px 14px", fontSize: "0.85rem", background: "#fecaca", color: "#b91c1c", borderColor: "#fecaca" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
