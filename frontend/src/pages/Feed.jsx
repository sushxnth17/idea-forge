import { useEffect, useState } from "react";
import api from "../services/api";

function Feed() {
    const [ideas, setIdeas] = useState([]);

    useEffect(() => {
        fetchIdeas();
    }, []);

    async function fetchIdeas() {
        try {
            const response = await api.get("/feed");
            setIdeas(response.data);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Public Feed 🚀</h1>

            {ideas.map((idea) => (
                <div
                    key={idea.id}
                    style={{
                        border:"1px solid gray",
                        margin:"10px",
                        padding:"10px"
                    }}
                >
                    <h2>{idea.title}</h2>

                    <p>
                        {idea.description}
                    </p>

                    <p>
                        ❤️ {idea.likes_count}
                    </p>

                </div>
            ))}
        </div>
    );
}

export default Feed;