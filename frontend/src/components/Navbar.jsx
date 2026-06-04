import { NavLink, Link } from "react-router-dom";

const navigationItems = [
    { to: "/feed", label: "Feed" },
    { to: "/search", label: "Search" },
    { to: "/bookmarks", label: "Bookmarks" },
    { to: "/trending", label: "Trending" },
    { to: "/create", label: "Create Idea" },
    { to: "/profile", label: "Profile" },
    { to: "/notifications", label: "Notifications" }
];

function Navbar() {
    return (
        <header className="app-nav">
            <div className="app-nav__inner">
                <Link to="/dashboard" className="app-nav__brand" aria-label="IdeaForge home">
                    <span className="app-nav__brand-mark" aria-hidden="true">
                        IF
                    </span>
                    <span className="app-nav__brand-copy">
                        <span className="app-nav__brand-title">IdeaForge</span>
                        <span className="app-nav__brand-subtitle">Startup workspace for building in public</span>
                    </span>
                </Link>

                <nav className="app-nav__links" aria-label="Primary">
                    {navigationItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `app-nav__link ${isActive ? "app-nav__link--active" : ""}`.trim()
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="app-nav__status" aria-hidden="true">
                    <span className="app-nav__status-pill">
                        <span className="app-nav__status-dot" />
                        Productive mode
                    </span>
                </div>
            </div>
        </header>
    );
}

export default Navbar;