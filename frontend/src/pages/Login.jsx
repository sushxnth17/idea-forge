import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);

            const response = await api.post(
                "/users/login",
                formData,
                {
                    headers: {
                        "Content-Type":
                        "application/x-www-form-urlencoded"
                    }
                }
            );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            navigate("/dashboard");

        } catch (error) {
    console.log("ERROR:", error);
    console.log("MESSAGE:", error.message);
    console.log("RESPONSE:", error.response);
    console.log("DATA:", error.response?.data);

    alert(error.message);
}
    }

    return (
        <div className="auth-shell">
            <section className="auth-card">
                <div className="auth__header">
                    <p className="page__eyebrow">Welcome back</p>
                    <h1>Login</h1>
                    <p className="page__lead muted">Sign in to continue building and exploring ideas.</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form__field">
                        <label className="form__label" htmlFor="login-email">
                            Email
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form__field">
                        <label className="form__label" htmlFor="login-password">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button type="submit" className="button button--primary button--full">
                        Login
                    </button>
                </form>

                <div className="auth-card__footer">
                    <Link to="/register" className="button button--ghost">
                        Create Account
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Login;