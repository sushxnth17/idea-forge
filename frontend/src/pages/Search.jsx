import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

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
        <div>

            <h1>🔍 Search Ideas</h1>

            <form onSubmit={handleSearch}>

                <input
                    type="text"
                    placeholder="Search ideas..."
                    value={query}
                    onChange={(e)=>
                        setQuery(e.target.value)
                    }
                />

                <button type="submit">
                    Search
                </button>

            </form>

            <br/>

            {results.map((idea)=>(
                <Link
                    key={idea.id}
                    to={`/ideas/${idea.id}`}
                >
                    <div
                        style={{
                            border:"1px solid gray",
                            padding:"10px",
                            margin:"10px"
                        }}
                    >
                        <h3>{idea.title}</h3>
                        <p>{idea.description}</p>
                    </div>
                </Link>
            ))}

        </div>
    );
}

export default Search;