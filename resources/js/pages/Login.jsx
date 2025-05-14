// resources/js/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./Login.css";

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
            localStorage.setItem("role", data.user.role); // ← сохраняем роль!
            navigate("/calendar");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
            >
                <img
                    src="/logo-mechta.svg"
                    alt="Логотип"
                    className="mx-auto h-24"
                />

                <h2 className="text-2xl font-semibold text-center">
                    Добро пожаловать
                </h2>
                <p className="text-sm text-gray-600 text-center">
                    Введите email и пароль для входа в систему
                </p>

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <div className="relative">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="relative">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end text-sm">
                    <button
                        type="button"
                        className="text-blue-600 hover:underline"
                    >
                        Забыли пароль?
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}
