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

            <form onSubmit={handleSearch} className="search-form card">
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
                </div>

                <div className="search-form__actions">
                    <button type="submit" className="button button--primary">
                        Search
                    </button>
                </div>
            </form>

            <div className="section-grid">
                {results.map((idea) => (
                    <Link key={idea.id} to={`/ideas/${idea.id}`} className="card card--interactive">
                        <div className="card__body">
                            <h3>{idea.title}</h3>
                            <p className="muted">{idea.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}

export default Search;