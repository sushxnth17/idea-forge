import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";

function Bookmarks() {

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    async function fetchBookmarks() {
        setLoading(true);
        try {
            const response = await api.get(
                "/bookmarks"
            );
            setIdeas(response.data);
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AppLayout>

            <section className="page__header">
                <p className="page__eyebrow">Saved</p>
                <h1>⭐ Bookmarked Ideas</h1>
                <p className="page__lead muted">
                    Ideas you've saved for later.
                </p>
            </section>

            {loading ? (
                <div className="ideas-grid">
                    <SkeletonCard type="bookmark" />
                    <SkeletonCard type="bookmark" />
                    <SkeletonCard type="bookmark" />
                </div>
            ) : ideas.length === 0 ? (
                <EmptyState
                    icon="🔖"
                    title="No bookmarks yet."
                    description="Save ideas you want to revisit later."
                />
            ) : (
                <div className="ideas-grid">

                    {ideas.map((idea) => (

                        <Link
                            key={idea.id}
                            to={`/ideas/${idea.id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit"
                            }}
                        >
                            <div className="card">

                                <h3>{idea.title}</h3>

                                <p className="muted">
                                    {idea.description}
                                </p>

                                <div
                                    style={{
                                        marginTop: "10px"
                                    }}
                                >
                                    ❤️ {idea.likes_count}
                                </div>

                            </div>
                        </Link>

                    ))}

                </div>
            )}

        </AppLayout>
    );
}

export default Bookmarks;