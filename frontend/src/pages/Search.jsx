import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

function Search() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    async function handleSearch(e) {

        e.preventDefault();

        try {

            const response = await api.get(
                `/search?query=${query}`
            );

            setResults(response.data);

        } catch(error) {
            console.log(error);
        }
    }

    return (
        <AppLayout>
            <section className="page__header">
                <p className="page__eyebrow">Discovery</p>
                <h1>Search Ideas</h1>
                <p className="page__lead muted">Search through ideas using the live backend query.</p>
            </section>
            <form onSubmit={handleSearch} className="search-form card" aria-label="Search ideas">
                <div className="form__field">
                    <label className="form__label" htmlFor="idea-search">
                        Search term
                    </label>
                    <input
                        id="idea-search"
                        type="text"
                        placeholder="Search ideas..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-field"
                    />
                    <p className="muted" style={{marginTop:8, fontSize:14}}>Try searching for topics like <strong>AI</strong>, <strong>productivity</strong>, or <strong>community</strong>.</p>
                </div>

                <div className="search-form__actions">
                    <button type="submit" className="button button--primary">
                        Search
                    </button>
                </div>
            </form>
            <div className="section-grid">
                {results.length === 0 ? (
                    query ? (
                        <div className="card">
                            <h3>No results</h3>
                            <p className="muted">We couldn't find any ideas matching <strong>"{query}"</strong>. Try different keywords or broader terms.</p>
                        </div>
                    ) : (
                        <div className="card">
                            <h3>Start exploring</h3>
                            <p className="muted">Enter a search term to discover ideas. Use short topic keywords for best results.</p>
                        </div>
                    )
                ) : (
                    results.map((idea) => (
                        <Link key={idea.id} to={`/ideas/${idea.id}`} className="feed-card card card--interactive">
                            <div className="feed-card__body card__body">
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                                    <div style={{flex:1}}>
                                        <h3 className="feed-card__title">{idea.title}</h3>
                                        <p className="feed-card__description muted">{idea.description}</p>
                                        {idea.tags && idea.tags.length > 0 && (
                                            <div className="feed-card__tags" style={{marginTop:8}} aria-label="Idea tags">
                                                {idea.tags.slice(0,4).map(t => (
                                                    <span key={t.id} className="tag-pill">#{t.name}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                                        <div className="feed-card__likes">
                                            <span className="badge">❤️ {idea.likes_count}</span>
                                            <span className="badge" style={{marginLeft:8}}>💬 {idea.comments?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </AppLayout>
    );
}

export default Search;