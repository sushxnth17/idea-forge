import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function Dashboard() {

    function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    return (
        <AppLayout>
            <section className="dashboard-hero">
                <div className="dashboard-hero__intro">
                    <p className="page__eyebrow">Workspace</p>
                    <h1>Dashboard</h1>
                    <p className="page__lead muted">
                        Jump into the areas you use most and keep building from one place.
                    </p>

                    <div className="stats-row">
                        <span className="badge badge--success">Connected</span>
                        <span className="badge">FastAPI backend</span>
                    </div>
                </div>

                <div className="dashboard-hero__panel card">
                    <h3>Quick actions</h3>
                    <p className="muted">Use the navigation cards below to get to the common flows faster.</p>
                    <button onClick={handleLogout} className="button button--secondary button--full">
                        Logout
                    </button>
                </div>
            </section>

            <div className="dashboard-grid">
                {[
                    { to: "/feed", title: "Feed", description: "Browse the latest public ideas.", icon: "📰" },
                    { to: "/search", title: "Search Ideas", description: "Find ideas by keyword.", icon: "🔎" },
                    { to: "/trending", title: "Trending", description: "See what is gaining momentum.", icon: "🔥" },
                    { to: "/create", title: "Create Idea", description: "Start a new idea submission.", icon: "✍️" },
                    { to: "/profile", title: "Profile", description: "Review your account details.", icon: "👤" },
                    { to: "/notifications", title: "Notifications", description: "Check activity and updates.", icon: "🔔" }
                ].map((item) => (
                    <Link key={item.to} to={item.to} className="dashboard-card card card--interactive">
                        <div className="dashboard-card__icon">{item.icon}</div>
                        <div className="dashboard-card__body">
                            <h3>{item.title}</h3>
                            <p className="muted">{item.description}</p>
                        </div>
                        <span className="dashboard-card__cta button button--primary">Open</span>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}

export default Dashboard;