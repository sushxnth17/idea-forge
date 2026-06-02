import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

function Bookmarks() {

    const [ideas, setIdeas] = useState([]);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    async function fetchBookmarks() {

        try {

            const response = await api.get(
                "/bookmarks"
            );

            setIdeas(response.data);

        } catch(error) {
            console.log(error);
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

            {ideas.length === 0 ? (
                <div className="card">
                    <h3>No bookmarks yet</h3>
                    <p className="muted">
                        Bookmark ideas from the feed to see them here.
                    </p>
                </div>
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