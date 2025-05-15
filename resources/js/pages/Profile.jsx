import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Aside from "../components/Aside";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        const data = await res.json();
        setUser(data.user);
        setFormData({
            ...formData,
            name: data.user.name || "",
            surname: data.user.surname || "",
            email: data.user.email || "",
        });
    };

    const fetchStats = async () => {
        const res = await fetch("http://127.0.0.1:8000/api/profile/stats", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        const data = await res.json();
        setStats(data);
    };

    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            uploadAvatar(file);
        }
    };

    const uploadAvatar = async (file) => {
        const form = new FormData();
        form.append("avatar", file);

        const res = await fetch("http://127.0.0.1:8000/api/user/avatar", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form,
        });

        const data = await res.json();
        if (data.avatar) {
            setUser((prev) => ({ ...prev, avatar: data.avatar }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await fetch("http://127.0.0.1:8000/api/user", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setMessage("Ошибка обновления");
        } else {
            setMessage("✅ Данные обновлены");
            fetchProfile();
        }
    };

    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className="flex-1 p-8 bg-gray-50 space-y-8">
                <h1 className="text-3xl font-bold text-gray-800">Профиль</h1>

                {user && (
                    <div className="flex items-center gap-6 bg-white rounded-xl shadow p-6">
                        <div>
                            <img
                                src={
                                    avatarPreview ||
                                    user.avatar ||
                                    "https://via.placeholder.com/120"
                                }
                                alt="Avatar"
                                className="w-28 h-28 rounded-full object-cover border"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="mt-2 text-sm"
                            />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">
                                {user.name} {user.surname}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {user.email}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                Роль: {user.role}
                            </p>
                        </div>
                    </div>
                )}

                {stats && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow p-4">
                                <p className="text-gray-500 text-sm">
                                    Заработано всего
                                </p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {stats.total_income} ₽
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4">
                                <p className="text-gray-500 text-sm">
                                    Кол-во сеансов
                                </p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {stats.total_sessions}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4">
                                <p className="text-gray-500 text-sm">
                                    Средний чек
                                </p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {stats.average_check} ₽
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                Доход по дням
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={stats.by_day}>
                                    <defs>
                                        <linearGradient
                                            id="colorIncome"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#4f46e5"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#4f46e5"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#4f46e5"
                                        fillOpacity={1}
                                        fill="url(#colorIncome)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow p-6 space-y-4"
                >
                    <h2 className="text-xl font-semibold text-gray-700">
                        Обновить профиль
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Имя"
                            className="border rounded px-4 py-2"
                        />
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            placeholder="Фамилия"
                            className="border rounded px-4 py-2"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="border rounded px-4 py-2"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Новый пароль"
                            className="border rounded px-4 py-2"
                        />
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            placeholder="Повторите пароль"
                            className="border rounded px-4 py-2"
                        />
                    </div>

                    {message && (
                        <p className="text-sm text-indigo-600">{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        {loading ? "Сохраняем..." : "Сохранить изменения"}
                    </button>
                </form>
            </div>
        </div>
    );
}
