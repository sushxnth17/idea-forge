import { NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

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
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // close mobile menu on navigation
        setOpen(false);
    }, [location.pathname]);

    return (
        <header className="app-nav">
            <a className="sr-only" href="#main">Skip to content</a>
            <div className="app-nav__inner">
                <Link to="/dashboard" className="app-nav__brand" aria-label="IdeaForge home">
                    <span className="app-nav__brand-mark" aria-hidden="true">
                        IF
                    </span>
                    <span className="app-nav__brand-copy">
                        <span className="app-nav__brand-title">IdeaForge</span>
                        <span className="app-nav__brand-subtitle">Build in public · Ship fast</span>
                    </span>
                </Link>

                <button
                    className="app-nav__toggle"
                    aria-expanded={open}
                    aria-controls="primary-navigation"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close navigation" : "Open navigation"}
                >
                    <span className="app-nav__toggle-box" aria-hidden="true">
                        <span className={`app-nav__toggle-bar ${open ? 'open' : ''}`} />
                    </span>
                </button>

                <nav
                    id="primary-navigation"
                    className={`app-nav__links ${open ? "app-nav__links--open" : ""}`}
                    aria-label="Primary"
                >
                    {navigationItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `app-nav__link ${isActive ? "app-nav__link--active" : ""}`.trim()
                            }
                        >
                            <span className="app-nav__link-label">{item.label}</span>
                            <span aria-hidden className="app-nav__link-indicator" />
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