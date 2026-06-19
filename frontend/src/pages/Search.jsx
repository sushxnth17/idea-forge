import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";

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

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tagParam = searchParams.get("tag");

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [tagResults, setTagResults] = useState([]);
    const [tagLoading, setTagLoading] = useState(false);

    useEffect(() => {
        async function fetchMe() {
            try {
                const response = await api.get("/users/profile");
                setCurrentUser(response.data);
            } catch (error) {
                console.log("Could not load logged-in user profile:", error);
            }
        }
        fetchMe();
    }, []);

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        try {
            const response = await api.get(`/users/search?query=${searchQuery}`);
            setResults(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const loadTagIdeas = async (tag_name) => {
        if (!tag_name) return;
        setTagLoading(true);
        try {
            const response = await api.get(`/ideas/tag/${encodeURIComponent(tag_name)}`);
            setTagResults(response.data);
        } catch (error) {
            console.log("Error loading tag ideas:", error);
        } finally {
            setTagLoading(false);
        }
    };

    useEffect(() => {
        if (tagParam) {
            loadTagIdeas(tagParam);
        }
    }, [tagParam]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            performSearch(query);
        }, 400); // 400ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    async function handleFollow(userId) {
        try {
            await api.post(`/users/follow/${userId}`);
            alert("Followed successfully!");
            performSearch(query);
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("You are already following this user!");
            } else {
                alert("Failed to follow user.");
            }
        }
    }

    async function handleLike(ideaId, e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/ideas/${ideaId}/like`);
            loadTagIdeas(tagParam);
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
            loadTagIdeas(tagParam);
        } catch (error) {
            console.log(error);
            alert("Failed to remix the idea.");
        }
    }

    const getAvatarColor = (id) => {
        return avatarColors[id % avatarColors.length];
    };

    const getAvatarInitials = (user) => {
        if (!user.username) return "U";
        return user.username.slice(0, 2).toUpperCase();
    };

    const getAvatarInitialsForIdea = (idea) => {
        if (idea.owner?.username) {
            return idea.owner.username.slice(0, 2).toUpperCase();
        }
        if (currentUser && idea.owner_id === currentUser.id) {
            return currentUser.username.slice(0, 2).toUpperCase();
        }
        return `C${idea.owner_id}`;
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
            {tagParam ? (
                <>
                    <section className="page__header">
                        <p className="page__eyebrow">Tag Discovery</p>
                        <h1>#{tagParam} Ideas</h1>
                        <p className="page__lead muted">Browse public ideas tagged with #{tagParam}.</p>
                    </section>

                    <div style={{ marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <button
                            type="button"
                            onClick={() => setSearchParams({})}
                            className="button button--secondary"
                        >
                            ← Back to Creator Search
                        </button>
                    </div>

                    {tagLoading && (
                        <div className="feed-grid">
                            <SkeletonCard type="feed" />
                            <SkeletonCard type="feed" />
                            <SkeletonCard type="feed" />
                        </div>
                    )}

                    {!tagLoading && (
                        <div className="feed-grid">
                            {tagResults.length === 0 ? (
                                <EmptyState
                                    icon="🔍"
                                    title="No matching ideas found."
                                    description="Try a different keyword or tag."
                                />
                            ) : (
                                tagResults.map((idea) => {
                                    const tags = Array.isArray(idea.tags) ? idea.tags : [];
                                    const commentCount = Array.isArray(idea.comments) ? idea.comments.length : 0;

                                    return (
                                        <div key={idea.id} className="feed-card-wrapper">
                                            <article className="feed-card card">
                                                {/* 1. Content First */}
                                                <Link to={`/ideas/${idea.id}`} className="feed-card__content-link">
                                                    <h2 className="feed-card__title" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                        {idea.title}
                                                        {idea.parent_idea_id && <span className="badge" style={{ fontSize: "0.72rem", padding: "4px 8px" }}>Remix</span>}
                                                    </h2>
                                                    <p className="feed-card__description">{idea.description}</p>
                                                </Link>

                                                {/* 2. Actions Second */}
                                                <div className="feed-card__actions" style={{ borderTop: "1.5px solid #000000", borderBottom: "1.5px solid #000000", padding: "10px 0", marginTop: 4, display: "flex", gap: 12, alignItems: "center" }}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleLike(idea.id, e)}
                                                        className="feed-card__action-btn feed-card__action-btn--like"
                                                        title="Like Idea"
                                                    >
                                                        <svg className="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                                        </svg>
                                                        <span className="action-count" style={{ marginLeft: 4, fontWeight: "bold" }}>{idea.likes_count}</span>
                                                    </button>

                                                    <Link
                                                        to={`/ideas/${idea.id}`}
                                                        className="feed-card__action-btn feed-card__action-btn--comment"
                                                        title="Comment on Idea"
                                                    >
                                                        <svg className="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                                        </svg>
                                                        <span className="action-count" style={{ marginLeft: 4, fontWeight: "bold" }}>{commentCount}</span>
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
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleBookmark(idea.id, e)}
                                                        className="feed-card__action-btn feed-card__action-btn--bookmark"
                                                        title="Bookmark Idea"
                                                        style={{ marginLeft: "auto" }}
                                                    >
                                                        <svg className="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* 3. Metadata Third */}
                                                <div className="feed-card__metadata-block" style={{ display: "grid", gap: 12, marginTop: 4 }}>
                                                    {tags.length > 0 && (
                                                        <div className="feed-card__tags" aria-label="Idea tags" style={{ margin: 0 }}>
                                                            {tags.map((tag) => (
                                                                <Link key={tag.id} to={`/search?tag=${encodeURIComponent(tag.name)}`} className="tag-pill">#{tag.name}</Link>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {idea.parent_idea_id && (
                                                        <div className="feed-card__parent-remix" style={{ margin: 0 }}>
                                                            <span className="remix-label">🔁 Remixed from </span>
                                                            <Link to={`/ideas/${idea.parent_idea_id}`} className="remix-parent-link">
                                                                Idea #{idea.parent_idea_id}
                                                            </Link>
                                                        </div>
                                                    )}

                                                    <div className="feed-card__creator-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 4 }}>
                                                        <Link 
                                                            to={currentUser && idea.owner_id === currentUser.id ? "/profile" : `/user/${idea.owner_id}`}
                                                            className="feed-card__creator-info"
                                                            style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}
                                                        >
                                                            <div 
                                                                className="feed-card__avatar" 
                                                                style={{ backgroundColor: getAvatarColor(idea.owner_id), width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #000000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#ffffff", fontWeight: "bold" }}
                                                            >
                                                                {idea.owner?.profile_picture ? (
                                                                    <img 
                                                                        src={idea.owner.profile_picture} 
                                                                        alt={idea.owner.username} 
                                                                        className="feed-card__avatar-img" 
                                                                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                                                    />
                                                                ) : currentUser && idea.owner_id === currentUser.id && currentUser.profile_picture ? (
                                                                    <img 
                                                                        src={currentUser.profile_picture} 
                                                                        alt={currentUser.username} 
                                                                        className="feed-card__avatar-img" 
                                                                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                                                    />
                                                                ) : (
                                                                    <span>{getAvatarInitialsForIdea(idea)}</span>
                                                                )}
                                                            </div>
                                                            <div className="feed-card__creator-meta" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                                <span className="feed-card__username" style={{ fontWeight: "800", color: "#000000", fontSize: "0.85rem" }}>{getCreatorUsername(idea)}</span>
                                                                <span className="feed-card__date-separator" style={{ fontSize: "0.8rem" }}>•</span>
                                                                <time className="feed-card__date" style={{ fontSize: "0.8rem", color: "#6b7280" }} dateTime={idea.created_at}>
                                                                    {formatDate(idea.created_at)}
                                                                </time>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <section className="page__header">
                        <p className="page__eyebrow">Discovery</p>
                        <h1>Search Creators</h1>
                        <p className="page__lead muted">Search for builders, designers, and creators across the IdeaForge platform.</p>
                    </section>

                    <div className="search-form card" style={{ marginBottom: "24px" }} aria-label="Search creators">
                        <div className="form__field">
                            <label className="form__label" htmlFor="creator-search">
                                Search by username
                            </label>
                            <input
                                id="creator-search"
                                type="text"
                                placeholder="Type a username..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="search-field"
                                autoFocus
                            />
                            <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
                                Results load automatically as you type. Try typing test usernames.
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className="section-grid">
                            <SkeletonCard type="bookmark" />
                            <SkeletonCard type="bookmark" />
                            <SkeletonCard type="bookmark" />
                        </div>
                    )}

                    {!loading && (
                        <div className="section-grid">
                            {results.length === 0 ? (
                                query ? (
                                    <EmptyState
                                        icon="🔍"
                                        title="No matching creators found."
                                        description="Try a different username."
                                    />
                                ) : (
                                    <div className="card" style={{ width: "100%", textAlign: "center", padding: "40px" }}>
                                        <h3>Start exploring</h3>
                                        <p className="muted">Type a username in the search field above to discover builders and creators.</p>
                                    </div>
                                )
                            ) : (
                                results.map((user) => (
                                    <article key={user.id} className="search-card card">
                                        <div className="search-card__body">
                                            <div className="search-card__profile-section">
                                                <div 
                                                    className="search-card__avatar"
                                                    style={{ backgroundColor: getAvatarColor(user.id) }}
                                                >
                                                    {user.profile_picture ? (
                                                        <img 
                                                            src={user.profile_picture} 
                                                            alt={user.username} 
                                                            className="search-card__avatar-img" 
                                                        />
                                                    ) : (
                                                        <span className="search-card__avatar-text">{getAvatarInitials(user)}</span>
                                                    )}
                                                </div>
                                                
                                                <div className="search-card__meta">
                                                    <h3 className="search-card__username">@{user.username}</h3>
                                                    <span className="badge badge--followers">👥 {user.followers_count ?? 0} Followers</span>
                                                </div>
                                            </div>
                                            
                                            <p className="search-card__bio">
                                                {user.bio ? (user.bio.length > 90 ? `${user.bio.slice(0, 90)}...` : user.bio) : "No bio provided."}
                                            </p>
                                        </div>
                                        
                                        <footer className="search-card__actions">
                                            <Link 
                                                to={user.id === currentUser?.id ? "/profile" : `/user/${user.id}`} 
                                                className="button button--secondary search-card__btn"
                                            >
                                                View Profile
                                            </Link>
                                            {user.id !== currentUser?.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleFollow(user.id)}
                                                    className="button button--primary search-card__btn"
                                                >
                                                    Follow
                                                </button>
                                            )}
                                        </footer>
                                    </article>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </AppLayout>
    );
}

export default Search;