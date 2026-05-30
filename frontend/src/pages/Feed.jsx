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
            <section className="page__header">
                <p className="page__eyebrow">Community stream</p>
                <h1>Public Feed</h1>
                <p className="page__lead muted">
                    Browse the latest ideas shared across the platform.
                </p>
            </section>

            <div className="feed-grid">
                {ideas.map((idea) => (
                    <Link key={idea.id} to={`/ideas/${idea.id}`} className="feed-card card card--interactive">
                        <div className="feed-card__body">
                            <div className="card__meta">
                                <h2 className="feed-card__title">{idea.title}</h2>
                                <span className="badge badge--muted">Public</span>
                            </div>

                            <p className="feed-card__description">{idea.description}</p>
                        </div>

                        <div className="feed-card__footer">
                            <div className="feed-card__likes">
                                <span>❤️ {idea.likes_count}</span>
                            </div>
                            <span className="button button--ghost">View details</span>
                        </div>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}

export default Feed;