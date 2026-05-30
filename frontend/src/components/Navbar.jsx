import { NavLink, Link } from "react-router-dom";

const navigationItems = [
    { to: "/feed", label: "Feed" },
    { to: "/search", label: "Search" },
    { to: "/trending", label: "Trending" },
    { to: "/create", label: "Create Idea" },
    { to: "/profile", label: "Profile" },
    { to: "/notifications", label: "Notifications" }
];

function Navbar() {
    return (
        <nav className="app-nav" aria-label="Primary">
            <div className="app-nav__inner">
                <Link to="/dashboard" className="app-nav__brand" aria-label="IdeaForge home">
                    <span className="app-nav__brand-mark">I</span>
                    <span className="app-nav__brand-copy">
                        <span className="app-nav__brand-title">IdeaForge</span>
                        <span className="app-nav__brand-subtitle">Build, share, iterate</span>
                    </span>
                </Link>

                <div className="app-nav__links">
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
                </div>
            </div>
        </nav>
    );
}

export default Navbar;