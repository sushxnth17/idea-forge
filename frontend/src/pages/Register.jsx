import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);

            await api.post("/users/register", {
                username,
                email,
                password
            });

            alert("Account created successfully. Please login.");
            navigate("/login");
        } catch (error) {
            const message =
                error.response?.data?.detail ||
                error.message ||
                "Unable to create account.";

            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-shell">
            <section className="auth-card">
                <div className="auth__header">
                    <p className="page__eyebrow">Join the platform</p>
                    <h1>Create Account</h1>
                    <p className="page__lead muted">
                        Build in public, share your ideas, and connect with creators.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form__field">
                        <label className="form__label" htmlFor="register-username">
                            Username
                        </label>
                        <input
                            id="register-username"
                            type="text"
                            placeholder="Username"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form__field">
                        <label className="form__label" htmlFor="register-email">
                            Email
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="Email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form__field">
                        <label className="form__label" htmlFor="register-password">
                            Password
                        </label>
                        <input
                            id="register-password"
                            type="password"
                            placeholder="Password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="button button--primary button--full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <div className="auth-card__footer">
                    <Link to="/login" className="button button--ghost">
                        Back to Login
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Register;