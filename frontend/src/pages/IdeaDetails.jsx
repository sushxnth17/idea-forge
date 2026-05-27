import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function IdeaDetails() {

    const { id } = useParams();

    const [idea, setIdea] = useState(null);

    useEffect(() => {
        fetchIdea();
    }, []);

    async function fetchIdea() {

        try {

            const response = await api.get(
                `/ideas/${id}`
            );

            setIdea(response.data);

        } catch(error) {
            console.log(error);
        }
    }

    if (!idea) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>

            <h1>{idea.title}</h1>

            <p>{idea.description}</p>

            <p>
                ❤️ {idea.likes_count}
            </p>

            <h3>Tags</h3>

            {idea.tags.map((tag)=>(
                <span
                    key={tag.id}
                    style={{
                        margin:"5px"
                    }}
                >
                    #{tag.name}
                </span>
            ))}

            <h3>Comments</h3>

            {idea.comments.map((comment)=>(
                <div
                    key={comment.id}
                    style={{
                        border:"1px solid gray",
                        margin:"10px",
                        padding:"10px"
                    }}
                >
                    <p>{comment.content}</p>
                </div>
            ))}

        </div>
    );
}

export default IdeaDetails;