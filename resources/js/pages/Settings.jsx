import { useState } from "react";
import Aside from "../components/Aside";

export default function Settings() {
    const [form, setForm] = useState({
        title: "",
        priority: "low",
        description: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/report-bug", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setMessage("✅ Отчёт успешно отправлен!");
                setForm({ title: "", priority: "low", description: "" });
            } else {
                setMessage("❌ Не удалось отправить отчёт.");
            }
        } catch (error) {
            console.error(error);
            setMessage("❌ Ошибка при отправке.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <Aside />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6">
                    ⚙️ Настройки / Сообщить о баге
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow rounded-xl p-6 max-w-xl space-y-4"
                >
                    <div>
                        <label className="block font-medium mb-1">
                            Название проблемы
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded px-4 py-2"
                            placeholder="Например: Не работает кнопка сохранения"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">
                            Приоритетность
                        </label>
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full border rounded px-4 py-2"
                        >
                            <option value="low">Низкий</option>
                            <option value="medium">Средний</option>
                            <option value="high">Высокий</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">
                            Описание
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded px-4 py-2"
                            placeholder="Опишите, в чём заключается проблема или пожелание..."
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    {message && (
                        <p className="text-green-600 text-sm">{message}</p>
                    )}

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    >
                        🚀 Отправить
                    </button>
                </form>
            </div>
        </div>
    );
}
