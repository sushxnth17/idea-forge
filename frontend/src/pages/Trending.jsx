import { useEffect, useState } from "react";
import api from "../services/api";

function Trending() {
    const [ideas, setIdeas] = useState([]);

    useEffect(() => {
        fetchTrending();
    }, []);

    async function fetchTrending() {
        try {
            const response = await api.get("/trending");
            setIdeas(response.data);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>🔥 Trending Ideas</h1>

            {ideas.map((idea)=>(
                <div
                    key={idea.id}
                    style={{
                        border:"1px solid gray",
                        margin:"10px",
                        padding:"10px"
                    }}
                >
                    <h2>{idea.title}</h2>

                    <p>{idea.description}</p>

                    <p>
                        ❤️ {idea.likes_count}
                    </p>

                    <p>
                        💬 {idea.comments.length}
                    </p>

                </div>
            ))}
        </div>
    );
}

export default Trending;