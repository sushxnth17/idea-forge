import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

// Custom SVG Icons
const FeedIcon = () => (
    <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);

const SearchIcon = () => (
    <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
    </svg>
);

const CreateIcon = () => (
    <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="5"/>
        <path d="M12 8v8M8 12h8"/>
    </svg>
);

const NotificationsIcon = () => (
    <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
);

const ProfileIcon = () => (
    <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

const LogoutIcon = () => (
    <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
);

const desktopItems = [
    { to: "/feed", label: "Feed", icon: <FeedIcon /> },
    { to: "/search", label: "Search", icon: <SearchIcon /> },
    { to: "/create", label: "Create", icon: <CreateIcon /> },
    { to: "/notifications", label: "Notifications", icon: <NotificationsIcon /> },
    { to: "/profile", label: "Profile", icon: <ProfileIcon /> }
];

const mobileItems = [
    { to: "/feed", label: "Home", icon: <FeedIcon /> },
    { to: "/search", label: "Search", icon: <SearchIcon /> },
    { to: "/create", label: "Create", icon: <CreateIcon /> },
    { to: "/notifications", label: "Notifications", icon: <NotificationsIcon /> },
    { to: "/profile", label: "Profile", icon: <ProfileIcon /> }
];

function Navbar() {
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const isActive = (path) => {
        if (path === "/profile") {
            return location.pathname === "/profile" || location.pathname === "/edit-profile" || location.pathname.startsWith("/users/");
        }
        return location.pathname === path;
    };

    return (
        <>
            {/* Desktop Sidebar Navigation */}
            <aside className="app-sidebar" aria-label="Desktop Sidebar">
                <div className="app-sidebar__top">
                    <Link to="/dashboard" className="app-sidebar__brand" aria-label="IdeaForge home">
                        <span className="app-sidebar__brand-mark" aria-hidden="true">
                            IF
                        </span>
                        <span className="app-sidebar__brand-copy">
                            <span className="app-sidebar__brand-title">IdeaForge</span>
                            <span className="app-sidebar__brand-subtitle">Build in public</span>
                        </span>
                    </Link>

                    <nav className="app-sidebar__nav" aria-label="Sidebar navigation">
                        {desktopItems.map((item) => {
                            const active = isActive(item.to);
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`app-sidebar__link ${active ? "app-sidebar__link--active" : ""}`}
                                >
                                    <span className="app-sidebar__link-icon-container">{item.icon}</span>
                                    <span className="app-sidebar__link-label">{item.label}</span>
                                    <span aria-hidden className="app-sidebar__link-indicator" />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="app-sidebar__bottom">
                    <button onClick={handleLogout} className="app-sidebar__logout-btn" aria-label="Logout">
                        <span className="app-sidebar__link-icon-container">
                            <LogoutIcon />
                        </span>
                        <span className="app-sidebar__logout-text">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <header className="app-mobile-header">
                <Link to="/dashboard" className="app-mobile-header__brand" aria-label="IdeaForge home">
                    <span className="app-mobile-header__brand-mark" aria-hidden="true">
                        IF
                    </span>
                    <span className="app-mobile-header__brand-title">IdeaForge</span>
                </Link>
                <button onClick={handleLogout} className="app-mobile-header__logout-btn" aria-label="Logout">
                    <LogoutIcon />
                </button>
            </header>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="app-mobile-bottom-nav" aria-label="Mobile navigation">
                {mobileItems.map((item) => {
                    const active = isActive(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`app-mobile-bottom-nav__link ${active ? "app-mobile-bottom-nav__link--active" : ""}`}
                        >
                            <span className="app-mobile-bottom-nav__icon-container">{item.icon}</span>
                            <span className="app-mobile-bottom-nav__label">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

export default Navbar;