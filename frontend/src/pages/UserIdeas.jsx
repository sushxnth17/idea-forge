import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

function UserIdeas() {
    const { userId } = useParams();
    const [ideas, setIdeas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchIdeas();
    }, []);

    async function fetchIdeas() {
        try {
            const response = await api.get(`/users/${userId}/ideas`);
            setIdeas(response.data);
        } catch(error) {
            console.log(error);
        }
    }

    const handleTagClick = (tagName, e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/search?tag=${encodeURIComponent(tagName)}`);
    };

    return (
        <AppLayout>
            <section className="page__header">
                <p className="page__eyebrow">Catalog</p>
                <h1>User Ideas</h1>
                <p className="page__lead muted">Browse the public ideas shared by this creator.</p>
            </section>

            <div className="feed-grid">
                {ideas.length === 0 ? (
                    <div className="card">
                        <h3>No ideas shared yet</h3>
                        <p className="muted">This creator has not published any ideas to the public catalog.</p>
                    </div>
                ) : (
                    ideas.map((idea) => (
                        <Link
                            key={idea.id}
                            to={`/ideas/${idea.id}`}
                            className="feed-card-wrapper"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <article className="feed-card card card--interactive">
                                <h2 className="feed-card__title" style={{ marginTop: 0 }}>{idea.title}</h2>
                                <p className="feed-card__description">{idea.description}</p>

                                {idea.tags && idea.tags.length > 0 && (
                                    <div className="feed-card__tags" style={{ marginTop: 12 }} aria-label="Idea tags">
                                        {idea.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="tag-pill"
                                                onClick={(e) => handleTagClick(tag.name, e)}
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <footer className="feed-card__actions" style={{ marginTop: 12, borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 8 }} role="group" aria-label="Card actions">
                                    <div className="feed-card__action-btn" style={{ cursor: "default" }}>
                                        ❤️ <span className="action-count">{idea.likes_count}</span>
                                    </div>
                                </footer>
                            </article>
                        </Link>
                    ))
                )}
            </div>
        </AppLayout>
    );
}

export default UserIdeas;