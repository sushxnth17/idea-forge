import { useState } from "react";
import api from "../services/api";

function CreateIdea() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await api.post("/ideas", {
                title,
                description,
                is_public: true,
                tags: []
            });

            alert("Idea created!");

            setTitle("");
            setDescription("");

        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Create Idea</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />

                <br/><br/>

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />

                <br/><br/>

                <button type="submit">
                    Create
                </button>

            </form>
        </div>
    );
}

export default CreateIdea;