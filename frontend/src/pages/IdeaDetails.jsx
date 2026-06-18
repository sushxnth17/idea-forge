import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import RemixLineage from "../components/RemixLineage";
import RemixTree from "../components/RemixTree";

function IdeaDetails() {

    const { id } = useParams();

    const [idea, setIdea] = useState(null);
    const [comment, setComment] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

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

    useEffect(() => {
        let isActive = true;

        async function loadIdea() {
            try {
                const response = await api.get(`/public/ideas/${id}`);

                if (isActive) {
                    setIdea(response.data);
                }
            } catch(error) {
                console.log(error);
            }
        }

        loadIdea();

        return () => {
            isActive = false;
        };
    }, [id]);

    async function fetchIdea() {

        try {

            const response = await api.get(
                `/public/ideas/${id}`
            );

            setIdea(response.data);

        } catch(error) {
            console.log(error);
        }
    }
    async function handleLike() {

    try {

        await api.post(
            `/ideas/${id}/like`
        );

        fetchIdea();

    } catch(error) {
        console.log(error);
    }
}
    async function handleBookmark() {

    try {

        await api.post(
            `/ideas/${id}/bookmark`
        );

        alert("Idea bookmarked!");

    } catch(error) {
        console.log(error);
    }
}
    async function handleRemix() {

    try {

        await api.post(
            `/ideas/${id}/remix`
        );

        alert("Idea remixed successfully!");

    } catch(error) {
        console.log(error);
    }
}

    async function handleComment(e) {

    e.preventDefault();

    try {

        await api.post(
            `/ideas/${id}/comments`,
            {
                content: comment
            }
        );

        setComment("");

        fetchIdea();

    } catch(error) {
        console.log(error);
    }
}

    if (!idea) {
        return (
            <AppLayout>
                <div className="loading-state">
                    <h2>Loading idea...</h2>
                    <p className="muted">Fetching the latest details from the backend.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <article className="details-hero">
                <div className="details-hero__copy">
                    <p className="page__eyebrow">Idea details</p>
                    <h1 className="details-title" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        {idea.title}
                        <StatusBadge status={idea.status} />
                    </h1>

                    <div className="details-stats">
                        <div className="meta-row">
                            <span className="badge">❤️ {idea.likes_count}</span>
                            <span className="badge">💬 {idea.comments.length}</span>
                            <span className="badge">🔁 {idea.remixes_count ?? 0}</span>
                        </div>
                        <p className="page__lead details-description">{idea.description}</p>
                    </div>

                    <div className="details-tags" aria-label="Idea tags">
                        {idea.tags.map((tag) => (
                            <Link key={tag.id} to={`/search?tag=${encodeURIComponent(tag.name)}`} className="tag-pill">
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <aside className="details-hero__panel">
                    <div className="card panel">
                        <div className="details-actions" role="group" aria-label="Idea actions">
                            <button
                                type="button"
                                onClick={handleLike}
                                className="button button--primary"
                                title="Like"
                            >
                                ❤️ Like
                            </button>

                            <div className="button-group">
                                <button type="button" onClick={handleRemix} className="button" title="Remix">
                                    🔁 Remix
                                </button>
                                <button type="button" onClick={handleBookmark} className="button" title="Bookmark">
                                    ⭐ Bookmark
                                </button>
                            </div>
                        </div>

                        <div className="card__meta" style={{marginTop:12}}>
                            <div>
                                <Link 
                                    to={currentUser && idea.owner_id === currentUser.id ? "/profile" : `/user/${idea.owner_id}`}
                                    style={{ textDecoration: "underline", color: "inherit" }}
                                >
                                    <strong>@{idea.owner?.username || `creator_${idea.owner_id}`}</strong>
                                </Link>
                                <div className="muted" style={{fontSize:12}}>{idea.created_at ? new Date(idea.created_at).toLocaleString() : null}</div>
                            </div>
                            <div style={{textAlign:'right'}}>
                                <div className="badge badge--muted">{idea.is_premium ? 'Premium' : 'Free'}</div>
                            </div>
                        </div>
                    </div>

                    <RemixLineage parentIdeaId={idea.parent_idea_id} currentIdea={idea} />

                    <div className="card panel" style={{marginTop:16}}>
                        <h3 style={{marginBottom:8}}>Product details</h3>
                        <p className="muted" style={{marginBottom:12}}>A premium layout tailored for showcasing ideas like a product page — clear CTAs, attractive metadata and tags.</p>
                        <div className="details-stats">
                            <div className="stats-row">
                                <div>
                                    <div className="badge">⭐ {idea.score ?? 0}</div>
                                    <div className="muted" style={{fontSize:12}}>Quality</div>
                                </div>
                                <div>
                                    <div className="badge">👁️ {idea.views_count ?? 0}</div>
                                    <div className="muted" style={{fontSize:12}}>Views</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </article>

            <section className="details-remix-tree" style={{ marginTop: 24 }}>
                <RemixTree ideaId={idea.id} />
            </section>

            <section className="details-comments">
                <div className="card">
                    <h3>Leave a comment</h3>
                    <form onSubmit={handleComment} className="form">
                        <textarea
                            placeholder="Write a thoughtful comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="textarea"
                        />

                        <div className="search-form__actions">
                            <button type="submit" className="button button--primary">
                                Add Comment
                            </button>
                        </div>
                    </form>
                </div>

                <div className="comments-list">
                    {idea.comments.map((c) => (
                        <article key={c.id} className="comment-card">
                            <div className="comment-card__meta">
                                <div>
                                    <Link 
                                        to={currentUser && c.user_id === currentUser.id ? "/profile" : `/user/${c.user_id}`}
                                        style={{ textDecoration: "underline", color: "inherit" }}
                                    >
                                        <strong className="comment-card__author">@{c.user?.username || `user_${c.user_id}`}</strong>
                                    </Link>
                                    <div className="muted" style={{fontSize:12}}>{c.created_at ? new Date(c.created_at).toLocaleString() : null}</div>
                                </div>
                                <div className="badge badge--muted">Community</div>
                            </div>

                            <p className="comment-card__content">{c.content}</p>
                        </article>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}

export default IdeaDetails;