import { useEffect, useState } from "react";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

function Trending() {
    const [ideas, setIdeas] = useState([]);

    useEffect(() => {
        let isActive = true;

        async function loadTrending() {
            try {
                const response = await api.get("/trending");

                if (isActive) {
                    setIdeas(response.data);
                }
            } catch(error) {
                console.log(error);
            }
        }

        loadTrending();

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <AppLayout>
            <section className="page__header">
                <p className="page__eyebrow">Momentum</p>
                <h1>Trending Ideas</h1>
                <p className="page__lead muted">Ranked by engagement so you can spot what is taking off.</p>
            </section>

            <div className="ranking-list">
                {ideas.map((idea, index) => (
                    <div key={idea.id} className="ranking-card card card--interactive">
                        <div className="ranking-card__rank">#{index + 1}</div>
                        <div className="card__body">
                            <h2 className="ranking-card__title">{idea.title}</h2>
                            <p className="ranking-card__description">{idea.description}</p>
                            <div className="meta-row">
                                <span className="badge">❤️ {idea.likes_count}</span>
                                <span className="badge">💬 {idea.comments.length}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}

export default Trending;