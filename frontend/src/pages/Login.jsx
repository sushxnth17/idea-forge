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
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

                <br /><br />

                <Link to="/register">
                    Create Account
                </Link>

            </form>
        </div>
    );
}

export default Login;