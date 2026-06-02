import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function UserIdeas() {

    const { userId } = useParams();

    const [ideas, setIdeas] = useState([]);

    useEffect(() => {
        fetchIdeas();
    }, []);

    async function fetchIdeas() {

        try {

            const response = await api.get(
                `/users/${userId}/ideas`
            );

            setIdeas(response.data);

        } catch(error) {
            console.log(error);
        }
    }

    return (
        <>
            <Navbar />

            <div
                style={{
                    maxWidth:"900px",
                    margin:"auto",
                    padding:"20px"
                }}
            >

                <h1>📄 User Ideas</h1>

                {ideas.map((idea)=>(
                    <Link
                        key={idea.id}
                        to={`/ideas/${idea.id}`}
                        style={{
                            textDecoration:"none",
                            color:"white"
                        }}
                    >
                        <div
                            style={{
                                border:"1px solid #333",
                                borderRadius:"12px",
                                padding:"20px",
                                margin:"15px 0"
                            }}
                        >
                            <h2>{idea.title}</h2>

                            <p>{idea.description}</p>

                            <p>
                                ❤️ {idea.likes_count}
                            </p>
                        </div>
                    </Link>
                ))}

            </div>
        </>
    );
}

export default UserIdeas;