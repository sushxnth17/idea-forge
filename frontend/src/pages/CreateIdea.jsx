import { useState } from "react";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

function CreateIdea() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const tagsArray = tagsInput
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "");

            await api.post("/ideas", {
                title,
                description,
                is_public: true,
                tags: tagsArray
            });

            alert("Idea created!");

            setTitle("");
            setDescription("");
            setTagsInput("");

        } catch(error) {
            console.log(error);
        }
    }

    return (
        <AppLayout>
            <section className="page__header">
                <p className="page__eyebrow">Submission</p>
                <h1>Create Idea</h1>
                <p className="page__lead muted">Draft and publish a new public idea entry.</p>
            </section>

            <div className="card">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-title">
                            Title
                        </label>
                        <input
                            id="idea-title"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-description">
                            Description
                        </label>
                        <textarea
                            id="idea-description"
                            placeholder="Describe your idea..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea"
                        />
                    </div>

                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-tags">
                            Tags (comma separated)
                        </label>
                        <input
                            id="idea-tags"
                            type="text"
                            placeholder="AI, Startup, Education"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button type="submit" className="button button--primary">
                        Create
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}

export default CreateIdea;