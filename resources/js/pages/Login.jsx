// resources/js/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Ошибка входа");
            }

            localStorage.setItem("token", data.token);
            navigate("/calendar");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit} className="login__form">
                <img
                    className="login__logo"
                    src="/logo-mechta.svg"
                    alt="Логотип"
                />

                <h2 className="login__title">Добро пожаловать</h2>
                <p className="login__subtitle">
                    Введите email и пароль для входа в систему
                </p>

                {error && <p className="login__error">{error}</p>}

                <div className="login__field">
                    <input
                        type="email"
                        id="email"
                        className="login__input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email" className="login__label">
                        Email
                    </label>
                </div>

                <div className="login__field">
                    <input
                        type="password"
                        id="password"
                        className="login__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="login__label">
                        Пароль
                    </label>
                </div>

                <div className="login__options">
                    <button type="button" className="login__forgot">
                        Забыли пароль?
                    </button>
                </div>

                <button type="submit" className="login__button">
                    Войти
                </button>
            </form>
        </div>
    );
}
