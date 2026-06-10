import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

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
              <Link to="/feed" className="button button--secondary">
                Open feed
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

    <Link
      to="/notifications"
      className="button button--secondary"
    >
      Notifications
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
                <span className="dashboard-action-card__cta">Open</span>
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
                <span className="dashboard-feature-card__link">View</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
