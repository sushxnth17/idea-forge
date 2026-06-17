import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";

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
                {ideas.length === 0 ? (
                    <div className="card">
                        <h3>No trending ideas yet</h3>
                        <p className="muted">There isn't enough signal to show trending ideas. Try again later.</p>
                    </div>
                ) : (
                    ideas.map((idea, index) => (
                        <div key={idea.id} className="ranking-card card card--interactive">
                            <div className="ranking-card__rank">#{index + 1}</div>
                            <div className="card__body">
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                                    <div style={{flex:1}}>
                                        <h2 className="ranking-card__title" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                            {idea.title}
                                            <StatusBadge status={idea.status} />
                                        </h2>
                                        <p className="ranking-card__description muted">{idea.description}</p>
                                        {idea.tags && idea.tags.length > 0 && (
                                            <div className="details-tags" style={{marginTop:8}} aria-label="Idea tags">
                                                {idea.tags.slice(0,4).map(t => (
                                                    <Link key={t.id} to={`/search?tag=${encodeURIComponent(t.name)}`} className="tag-pill">#{t.name}</Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{minWidth:110,textAlign:'right'}}>
                                        <div style={{marginBottom:8}}>
                                            <span className="badge">❤️ {idea.likes_count}</span>
                                            <span className="badge" style={{marginLeft:8}}>💬 {idea.comments?.length || 0}</span>
                                        </div>
                                        {idea.trend_delta != null && (
                                            <div className={`badge ${idea.trend_delta > 0 ? 'badge--success' : 'badge--warning'}`}>
                                                {idea.trend_delta > 0 ? `▲ ${idea.trend_delta}` : `▼ ${Math.abs(idea.trend_delta)}`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}

export default Trending;