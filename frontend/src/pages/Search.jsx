import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

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
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

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
            // Refresh results to update followers count
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

    const getAvatarColor = (id) => {
        return avatarColors[id % avatarColors.length];
    };

    const getAvatarInitials = (user) => {
        if (!user.username) return "U";
        return user.username.slice(0, 2).toUpperCase();
    };

    return (
        <AppLayout>
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
                <div className="loading-state card">
                    <h3>Searching...</h3>
                    <p className="muted">Retrieving creator records matching "{query}".</p>
                </div>
            )}

            {!loading && (
                <div className="section-grid">
                    {results.length === 0 ? (
                        query ? (
                            <div className="card">
                                <h3>No creators found</h3>
                                <p className="muted">We couldn't find any creators matching <strong>"{query}"</strong>. Try a different username.</p>
                            </div>
                        ) : (
                            <div className="card">
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
                                        to={user.id === currentUser?.id ? "/profile" : `/users/${user.id}/ideas`} 
                                        className="button button--secondary search-card__btn"
                                    >
                                        View Profile
                                    </Link>
                                    <Link 
                                        to={`/users/${user.id}/ideas`} 
                                        className="button button--secondary search-card__btn"
                                    >
                                        View Ideas
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
        </AppLayout>
    );
}

export default Search;