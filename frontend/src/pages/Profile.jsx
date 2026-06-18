import { useEffect, useState } from "react";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";
import "../styles/profile.css";
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

function Profile() {
    const [profile, setProfile] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAvatarColor = (userId) => {
        return avatarColors[userId % avatarColors.length];
    };

    const loadProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            setProfile(response.data);

            const followersResponse = await api.get(
                `/users/followers/${response.data.id}`
            );

            const followingResponse = await api.get(
                `/users/following/${response.data.id}`
            );

            const ideasResponse = await api.get("/ideas");

            setFollowersCount(followersResponse.data.length);
            setFollowingCount(followingResponse.data.length);
            setIdeas(ideasResponse.data);
        } catch (error) {
            console.log("Error loading profile details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleLike = async (ideaId, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/ideas/${ideaId}/like`);
            const ideasResponse = await api.get("/ideas");
            setIdeas(ideasResponse.data);
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("You have already liked this idea!");
            } else {
                alert("Failed to like the idea.");
            }
        }
    };

    const handleBookmark = async (ideaId, e) => {
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
    };

    const handleRemix = async (ideaId, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/ideas/${ideaId}/remix`);
            alert("Idea remixed successfully!");
            const ideasResponse = await api.get("/ideas");
            setIdeas(ideasResponse.data);
        } catch (error) {
            console.log(error);
            alert("Failed to remix the idea.");
        }
    };

    const handleDelete = async (ideaId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this idea?")) return;
        try {
            await api.delete(`/ideas/${ideaId}`);
            alert("Idea deleted successfully!");
            loadProfile();
        } catch (error) {
            console.log(error);
            alert("Failed to delete the idea.");
        }
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

    if (loading) {
        return (
            <AppLayout>
                <div className="creator-profile">
                    <SkeletonCard type="profile" />
                    <div className="creator-profile__section-header" style={{ marginTop: 24 }}>
                        <h2 className="creator-profile__section-title">💡 My Catalog</h2>
                    </div>
                    <div className="feed-grid">
                        <SkeletonCard type="feed" />
                        <SkeletonCard type="feed" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!profile) {
        return (
            <AppLayout>
                <div className="card" style={{ padding: 40, textAlign: "center" }}>
                    <h2>Profile not found</h2>
                    <p className="muted">Please log in to view your profile.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="creator-profile">
                {/* Profile Card Header */}
                <div className="creator-profile__card card">
                    <div className="creator-profile__header-main">
                        <div className="creator-profile__avatar-wrapper">
                            {profile.profile_picture ? (
                                <img
                                    src={profile.profile_picture}
                                    alt={profile.username}
                                    className="creator-profile__avatar creator-profile__avatar-img"
                                />
                            ) : (
                                <div 
                                    className="creator-profile__avatar"
                                    style={{ backgroundColor: getAvatarColor(profile.id) }}
                                >
                                    {profile.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="creator-profile__identity">
                            <div className="creator-profile__username-row">
                                <h1 className="creator-profile__username">@{profile.username}</h1>
                                <span className="creator-profile__badge">My Account</span>
                            </div>
                            <p className="creator-profile__bio">
                                {profile.bio || "No bio provided."}
                            </p>
                        </div>

                        <div className="creator-profile__actions-wrapper">
                            <Link to="/edit-profile" className="button creator-profile__btn button--primary">
                                ✏️ Edit Profile
                            </Link>
                            <Link to={`/users/${profile.id}/ideas`} className="button creator-profile__btn">
                                📄 My Ideas
                            </Link>
                        </div>
                    </div>

                    <div className="creator-profile__stats">
                        <div className="creator-profile__stat-badge">
                            👥 <span className="creator-profile__stat-count">{followersCount}</span> Followers
                        </div>
                        <div className="creator-profile__stat-badge">
                            👣 <span className="creator-profile__stat-count">{followingCount}</span> Following
                        </div>
                        <div className="creator-profile__stat-badge">
                            💡 <span className="creator-profile__stat-count">{ideas.length}</span> Ideas
                        </div>
                        <span className="creator-profile__meta-date">
                            Member since {profile.created_at ? new Date(profile.created_at).getFullYear() : "—"}
                        </span>
                    </div>
                </div>

                {/* Ideas Section */}
                <div className="creator-profile__section-header">
                    <h2 className="creator-profile__section-title">💡 My Catalog</h2>
                    <span className="badge">{ideas.length} Total {ideas.length === 1 ? "Idea" : "Ideas"}</span>
                </div>

                <div className="feed-grid">
                    {ideas.length === 0 ? (
                        <div className="creator-profile__empty-state">
                            <span style={{ fontSize: "2rem" }}>📭</span>
                            <h3 className="creator-profile__empty-title">You haven't created any ideas yet</h3>
                            <p className="muted">Start drafting concepts to share with the community!</p>
                            <Link to="/create" className="button button--primary" style={{ marginTop: 8 }}>
                                Write an Idea
                            </Link>
                        </div>
                    ) : (
                        ideas.map((idea) => {
                            const tags = Array.isArray(idea.tags) ? idea.tags : [];
                            const commentCount = Array.isArray(idea.comments) ? idea.comments.length : 0;

                            return (
                                <div key={idea.id} className="feed-card-wrapper">
                                    <article className="feed-card card">
                                        <header className="feed-card__header">
                                            <div className="feed-card__creator-info">
                                                <div 
                                                    className="feed-card__avatar" 
                                                    style={{ backgroundColor: getAvatarColor(profile.id) }}
                                                >
                                                    {profile.profile_picture ? (
                                                        <img 
                                                            src={profile.profile_picture} 
                                                            alt={profile.username} 
                                                            className="feed-card__avatar-img" 
                                                        />
                                                    ) : (
                                                        <span className="feed-card__avatar-text">{profile.username?.slice(0, 2).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="feed-card__creator-meta">
                                                    <span className="feed-card__username">@{profile.username}</span>
                                                    <span className="feed-card__date-separator">•</span>
                                                    <time className="feed-card__date" dateTime={idea.created_at}>
                                                        {formatDate(idea.created_at)}
                                                    </time>
                                                </div>
                                            </div>
                                            <div className="feed-card__header-badges">
                                                {idea.is_public ? (
                                                    <span className="badge badge--success">Public</span>
                                                ) : (
                                                    <span className="badge badge--muted">Private</span>
                                                )}
                                                {idea.parent_idea_id && <span className="badge">Remix</span>}
                                            </div>
                                        </header>

                                        <Link to={`/ideas/${idea.id}`} className="feed-card__content-link">
                                            <h2 className="feed-card__title">{idea.title}</h2>
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
                                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
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
                                                onClick={(e) => handleDelete(idea.id, e)}
                                                className="feed-card__action-btn"
                                                style={{ marginLeft: "auto", backgroundColor: "#fecaca", color: "#ef4444" }}
                                                title="Delete Idea"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </footer>
                                    </article>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default Profile;