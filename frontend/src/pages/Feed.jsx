import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import "../styles/feed.css";

const avatarColors = [
    "#6d7cff", // Accent blue
    "#37d39b", // Success green
    "#f3bf4a", // Warning yellow
    "#f66b86", // Danger pink
    "#a855f7", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#f97316"  // Orange
];

function Feed() {
    const [ideas, setIdeas] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 5;

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const response = await api.get("/users/profile");
                setCurrentUser(response.data);
            } catch (error) {
                console.log("Could not load current user:", error);
            }
        }
        loadCurrentUser();
    }, []);

    const loadIdeas = async () => {
        try {
            const response = await api.get(`/feed?page=${page}&limit=${limit}`);
            setIdeas(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadIdeas();
    }, [page]);

    async function handleLike(ideaId, e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/ideas/${ideaId}/like`);
            loadIdeas();
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("You have already liked this idea!");
            } else {
                alert("Failed to like the idea.");
            }
        }
    }

    async function handleBookmark(ideaId, e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/ideas/${ideaId}/bookmark`);
            alert("Idea bookmarked successfully!");
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("You have already bookmarked this idea!");
            } else {
                alert("Failed to bookmark the idea.");
            }
        }
    }

    async function handleRemix(ideaId, e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/ideas/${ideaId}/remix`);
            alert("Idea remixed successfully!");
            loadIdeas();
        } catch (error) {
            console.log(error);
            alert("Failed to remix the idea.");
        }
    }

    const getAvatarColor = (id) => {
        return avatarColors[id % avatarColors.length];
    };

    const getCreatorUsername = (idea) => {
        if (idea.owner?.username) {
            return `@${idea.owner.username}`;
        }
        if (currentUser && idea.owner_id === currentUser.id) {
            return `@${currentUser.username}`;
        }
        return `@creator_${idea.owner_id}`;
    };

    const getAvatarInitials = (idea) => {
        if (idea.owner?.username) {
            return idea.owner.username.slice(0, 2).toUpperCase();
        }
        if (currentUser && idea.owner_id === currentUser.id) {
            return currentUser.username.slice(0, 2).toUpperCase();
        }
        return `C${idea.owner_id}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <AppLayout>
            <div className="feed-shell">
                <section className="feed-hero">
                    <div className="feed-hero__copy">
                        <p className="page__eyebrow">Community stream</p>
                        <h1>Public Feed</h1>
                        <p className="page__lead muted">
                            Browse the latest ideas shared across the platform in a clean, creator-focused layout.
                        </p>
                    </div>
                </section>

                <div className="feed-grid">
                    {ideas.length === 0 ? (
                        <EmptyState 
                            icon="💡" 
                            title="No ideas yet." 
                            description="Be the first to share an idea with the community." 
                        />
                    ) : (
                        ideas.map((idea) => {
                            const tags = Array.isArray(idea.tags) ? idea.tags : [];
                            const commentCount = Array.isArray(idea.comments) ? idea.comments.length : 0;

                            return (
                                <div key={idea.id} className="feed-card-wrapper">
                                    <article className="feed-card card">
                                        <header className="feed-card__header">
                                            <Link 
                                                to={currentUser && idea.owner_id === currentUser.id ? "/profile" : `/user/${idea.owner_id}`}
                                                className="feed-card__creator-info"
                                                style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 12 }}
                                            >
                                                <div 
                                                    className="feed-card__avatar" 
                                                    style={{ backgroundColor: getAvatarColor(idea.owner_id) }}
                                                >
                                                    {idea.owner?.profile_picture ? (
                                                        <img 
                                                            src={idea.owner.profile_picture} 
                                                            alt={idea.owner.username} 
                                                            className="feed-card__avatar-img" 
                                                        />
                                                    ) : currentUser && idea.owner_id === currentUser.id && currentUser.profile_picture ? (
                                                        <img 
                                                            src={currentUser.profile_picture} 
                                                            alt={currentUser.username} 
                                                            className="feed-card__avatar-img" 
                                                        />
                                                    ) : (
                                                        <span className="feed-card__avatar-text">{getAvatarInitials(idea)}</span>
                                                    )}
                                                </div>
                                                <div className="feed-card__creator-meta">
                                                    <span className="feed-card__username" style={{ textDecoration: "underline" }}>{getCreatorUsername(idea)}</span>
                                                    <span className="feed-card__date-separator">•</span>
                                                    <time className="feed-card__date" dateTime={idea.created_at}>
                                                        {formatDate(idea.created_at)}
                                                    </time>
                                                </div>
                                            </Link>
                                            <div className="feed-card__header-badges">
                                                {idea.featured && <span className="badge badge--success">Featured</span>}
                                                {idea.parent_idea_id && <span className="badge badge--remix">Remix</span>}
                                            </div>
                                        </header>

                                        <Link to={`/ideas/${idea.id}`} className="feed-card__content-link">
                                            <h2 className="feed-card__title" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                {idea.title}
                                                <StatusBadge status={idea.status} />
                                            </h2>
                                            <p className="feed-card__description">{idea.description}</p>
                                        </Link>

                                        {tags.length > 0 && (
                                            <div className="feed-card__tags" aria-label="Idea tags">
                                                {tags.map((tag) => (
                                                    <Link key={tag.id} to={`/search?tag=${encodeURIComponent(tag.name)}`} className="tag-pill">#{tag.name}</Link>
                                                ))}
                                            </div>
                                        )}

                                        {idea.parent_idea_id && (
                                            <div className="feed-card__parent-remix">
                                                <span className="remix-label">🔁 Remixed from </span>
                                                <Link to={`/ideas/${idea.parent_idea_id}`} className="remix-parent-link">
                                                    Idea #{idea.parent_idea_id}
                                                </Link>
                                            </div>
                                        )}

                                        <footer className="feed-card__actions" role="group" aria-label="Card actions">
                                            <button
                                                type="button"
                                                onClick={(e) => handleLike(idea.id, e)}
                                                className="feed-card__action-btn feed-card__action-btn--like"
                                                title="Like Idea"
                                            >
                                                <svg className="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                                </svg>
                                                <span className="action-count">{idea.likes_count}</span>
                                            </button>

                                            <Link
                                                to={`/ideas/${idea.id}`}
                                                className="feed-card__action-btn feed-card__action-btn--comment"
                                                title="Comment on Idea"
                                            >
                                                <svg className="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                                </svg>
                                                <span className="action-count">{commentCount}</span>
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={(e) => handleRemix(idea.id, e)}
                                                className="feed-card__action-btn feed-card__action-btn--remix"
                                                title="Remix Idea"
                                            >
                                                <svg className="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="17 1 21 5 17 9"/>
                                                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                                                    <polyline points="7 23 3 19 7 15"/>
                                                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                                                </svg>
                                                <span className="action-label">Remix</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(e) => handleBookmark(idea.id, e)}
                                                className="feed-card__action-btn feed-card__action-btn--bookmark"
                                                title="Bookmark Idea"
                                            >
                                                <svg className="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
                                                </svg>
                                                <span className="action-label">Save</span>
                                            </button>
                                        </footer>
                                    </article>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="feed-pagination">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="button button--secondary feed-pagination__btn"
                    >
                        ← Previous
                    </button>
                    <span className="feed-pagination__page-indicator">
                        Page {page}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={ideas.length < limit}
                        className="button button--secondary feed-pagination__btn"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}

export default Feed;