import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import RemixLineage from "../components/RemixLineage";
import RemixTree from "../components/RemixTree";

function parseAIReview(text) {
    if (!text) return null;
    
    const sections = {
        strengths: [],
        weaknesses: [],
        targetAudience: [],
        mvpSuggestions: [],
        monetizationIdeas: []
    };
    
    let currentKey = null;
    const lines = text.split("\n");
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        const lowerLine = line.toLowerCase();
        const cleanHeader = lowerLine.replace(/[\*#_:]/g, "").trim();
        
        if (cleanHeader === "strengths") {
            currentKey = "strengths";
            continue;
        } else if (cleanHeader === "weaknesses") {
            currentKey = "weaknesses";
            continue;
        } else if (cleanHeader === "target audience") {
            currentKey = "targetAudience";
            continue;
        } else if (cleanHeader === "mvp suggestions") {
            currentKey = "mvpSuggestions";
            continue;
        } else if (cleanHeader === "monetization ideas") {
            currentKey = "monetizationIdeas";
            continue;
        }
        
        if (currentKey) {
            let content = line;
            if (line.startsWith("*") || line.startsWith("-") || line.startsWith("•")) {
                content = line.substring(1).trim();
            } else {
                const matchNum = line.match(/^\d+[\.\)]/);
                if (matchNum) {
                    content = line.substring(matchNum[0].length).trim();
                }
            }
            if (content) {
                sections[currentKey].push(content);
            }
        }
    }
    return sections;
}

function formatMarkdownText(text) {
    if (!text) return "";
    
    // Split the text by double asterisks `**`
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    
    return parts.map((part, idx) => {
        // Every odd part was enclosed in `**`
        if (idx % 2 === 1) {
            return <strong key={idx}>{part}</strong>;
        }
        return part;
    });
}

function IdeaDetails() {

    const { id } = useParams();

    const [idea, setIdea] = useState(null);
    const [comment, setComment] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // AI Review State
    const [aiReview, setAiReview] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState(null);

    async function fetchAIReview() {
        if (!currentUser || !idea || idea.owner_id !== currentUser.id) {
            return;
        }
        try {
            const response = await api.get(`/ideas/${id}/ai-review`);
            setAiReview(response.data);
            setAiError(null);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setAiReview(null);
                setAiError(null);
            } else {
                console.log("Error loading AI review:", error);
                setAiError(error.response?.data?.detail || "Could not load AI review.");
            }
        }
    }

    async function handleGenerateAIReview() {
        setIsGenerating(true);
        setAiError(null);
        try {
            const response = await api.post(`/ideas/${id}/ai-review`);
            setAiReview(response.data);
        } catch (error) {
            console.log("Error generating AI review:", error);
            setAiError(error.response?.data?.detail || "Could not generate AI review.");
        } finally {
            setIsGenerating(false);
        }
    }

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
        if (currentUser && idea && idea.owner_id === currentUser.id) {
            fetchAIReview();
        }
    }, [id, currentUser, idea?.id]);

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

                            {currentUser && idea.owner_id === currentUser.id && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleGenerateAIReview}
                                        className="button button--primary button--full"
                                        disabled={isGenerating}
                                        style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
                                    >
                                        {isGenerating ? "Analyzing..." : "✨ Review with AI"}
                                    </button>
                                    <Link 
                                        to={`/ideas/${idea.id}/edit`} 
                                        className="button button--secondary button--full" 
                                        style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
                                    >
                                        ✏️ Edit Idea
                                    </Link>
                                </>
                            )}
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

            {/* AI Review Section */}
            {currentUser && idea.owner_id === currentUser.id && (
                <section className="details-ai-review" style={{ marginTop: 24 }}>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                    <div className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                                🤖 AI Idea Review
                            </h3>
                            {aiReview && (
                                <button
                                    type="button"
                                    onClick={handleGenerateAIReview}
                                    className="button button--secondary"
                                    disabled={isGenerating}
                                    style={{ padding: "6px 12px", minHeight: "36px", fontSize: "0.85rem" }}
                                >
                                    {isGenerating ? "Regenerating..." : "🔄 Regenerate"}
                                </button>
                            )}
                        </div>

                        {/* Error State */}
                        {aiError && (
                            <div className="card" style={{ background: "#fecaca", borderColor: "#ef4444", padding: "16px", marginBottom: "16px" }}>
                                <p style={{ color: "#b91c1c", fontWeight: "bold" }}>⚠️ Error fetching AI Review</p>
                                <p style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{aiError}</p>
                                <button
                                    type="button"
                                    onClick={aiReview ? fetchAIReview : handleGenerateAIReview}
                                    className="button button--primary"
                                    style={{ marginTop: "12px" }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isGenerating && (
                            <div style={{ textAlign: "center", padding: "40px 20px" }}>
                                <div className="loading-spinner" style={{ fontSize: "2rem", marginBottom: "12px", display: "inline-block", animation: "spin 2s linear infinite" }}>✨</div>
                                <h4>Analyzing your idea...</h4>
                                <p className="muted">This might take a moment. We're examining market potential, weaknesses, and suggestions.</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!aiReview && !isGenerating && !aiError && (
                            <div style={{ textAlign: "center", padding: "30px 20px" }}>
                                <p className="muted" style={{ marginBottom: "16px" }}>
                                    Get automated AI feedback on your startup idea. We'll analyze its strengths, weaknesses, and suggest MVP targets.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleGenerateAIReview}
                                    className="button button--primary"
                                    style={{ display: "inline-flex" }}
                                >
                                    ✨ Review with AI
                                </button>
                            </div>
                        )}

                        {/* Content State */}
                        {aiReview && !isGenerating && !aiError && (
                            <div className="ai-review-content" style={{ display: "grid", gap: "20px" }}>
                                {(() => {
                                    const parsed = parseAIReview(aiReview.review_text);
                                    if (!parsed) return <p className="muted">No content found in review.</p>;
                                    return (
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                                            <div className="card panel" style={{ padding: "16px", background: "var(--surface-soft)" }}>
                                                <h4 style={{ color: "#000000", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                    🟢 Strengths
                                                </h4>
                                                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                                    {parsed.strengths.map((s, idx) => (
                                                        <li key={idx} style={{ marginBottom: "4px" }}>{formatMarkdownText(s)}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="card panel" style={{ padding: "16px", background: "var(--surface-soft)" }}>
                                                <h4 style={{ color: "#000000", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                    🔴 Weaknesses
                                                </h4>
                                                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                                    {parsed.weaknesses.map((w, idx) => (
                                                        <li key={idx} style={{ marginBottom: "4px" }}>{formatMarkdownText(w)}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="card panel" style={{ padding: "16px", background: "var(--surface-soft)" }}>
                                                <h4 style={{ color: "#000000", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                    👥 Target Audience
                                                </h4>
                                                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                                    {parsed.targetAudience.map((t, idx) => (
                                                        <li key={idx} style={{ marginBottom: "4px" }}>{formatMarkdownText(t)}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="card panel" style={{ padding: "16px", background: "var(--surface-soft)" }}>
                                                <h4 style={{ color: "#000000", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                    🚀 MVP Suggestions
                                                </h4>
                                                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                                    {parsed.mvpSuggestions.map((m, idx) => (
                                                        <li key={idx} style={{ marginBottom: "4px" }}>{formatMarkdownText(m)}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {parsed.monetizationIdeas && parsed.monetizationIdeas.length > 0 && (
                                                <div className="card panel" style={{ padding: "16px", background: "var(--surface-soft)" }}>
                                                    <h4 style={{ color: "#000000", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                        💰 Monetization Ideas
                                                    </h4>
                                                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                                        {parsed.monetizationIdeas.map((m, idx) => (
                                                            <li key={idx} style={{ marginBottom: "4px" }}>{formatMarkdownText(m)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </section>
            )}

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