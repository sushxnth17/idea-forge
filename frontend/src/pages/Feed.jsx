import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function Feed() {
    const [ideas, setIdeas] = useState([]);

    useEffect(() => {
        let isActive = true;

        async function loadIdeas() {
            try {
                const response = await api.get("/feed");

                if (isActive) {
                    setIdeas(response.data);
                }
            } catch(error) {
                console.log(error);
            }
        }

        loadIdeas();

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <AppLayout>
            <div className="feed-shell">
                <section className="feed-hero card">
                    <div className="feed-hero__copy">
                        <p className="page__eyebrow">Community stream</p>
                        <h1>Public Feed</h1>
                        <p className="page__lead muted">
                            Browse the latest ideas shared across the platform in a fast, product-led layout.
                        </p>
                    </div>

                    <div className="feed-hero__meta">
                        <div className="feed-hero__stat">
                            <span className="feed-hero__stat-value">{ideas.length}</span>
                            <span className="feed-hero__stat-label">Live ideas</span>
                        </div>
                        <div className="feed-hero__stat">
                            <span className="feed-hero__stat-value">Trending</span>
                            <span className="feed-hero__stat-label">Community spotlight</span>
                        </div>
                        <div className="feed-hero__stat">
                            <span className="feed-hero__stat-value">Fast</span>
                            <span className="feed-hero__stat-label">Direct navigation</span>
                        </div>
                    </div>
                </section>

                <div className="feed-grid">
                    {ideas.map((idea, index) => {
                        const tags = Array.isArray(idea.tags) ? idea.tags : [];
                        const commentCount = Array.isArray(idea.comments) ? idea.comments.length : 0;

                        return (
                            <Link key={idea.id} to={`/ideas/${idea.id}`} className="feed-card card card--interactive">
                                <div className="feed-card__rank">#{index + 1}</div>

                                <div className="feed-card__body">
                                    <div className="feed-card__topline">
                                        <span className="badge badge--muted">Public</span>
                                        <span className="feed-card__signal">Featured submission</span>
                                    </div>

                                    <div className="feed-card__title-row">
                                        <h2 className="feed-card__title">{idea.title}</h2>
                                        <span className="feed-card__chevron">View details</span>
                                    </div>

                                    <p className="feed-card__description">{idea.description}</p>

                                    {tags.length > 0 && (
                                        <div className="feed-card__tags" aria-label="Idea tags">
                                            {tags.slice(0, 4).map((tag) => (
                                                <span key={tag.id} className="tag-pill">
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="feed-card__footer">
                                    <div className="feed-card__engagement">
                                        <span className="feed-card__engagement-item">
                                            <span aria-hidden="true">❤️</span>
                                            <span>{idea.likes_count}</span>
                                        </span>
                                        <span className="feed-card__engagement-item">
                                            <span aria-hidden="true">💬</span>
                                            <span>{commentCount}</span>
                                        </span>
                                    </div>

                                    <span className="button button--ghost">Open idea</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}

export default Feed;