import { useEffect, useState } from "react";

export default function ServiceManagement() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newService, setNewService] = useState({ name: "" });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "" });

    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/services", { headers })
            .then((res) => res.json())
            .then(setServices)
            .catch(() => setError("Ошибка загрузки услуг"))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/api/services", {
            method: "POST",
            headers,
            body: JSON.stringify(newService),
        });
        if (res.ok) {
            const created = await res.json();
            setServices([...services, created]);
            setNewService({ name: "" });
        } else {
            alert("Ошибка создания услуги");
        }
    };

    const startEdit = (s) => {
        setEditId(s.id);
        setEditForm({ name: s.name });
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditForm({ name: "" });
    };

    const handleUpdate = async (id) => {
        const res = await fetch(`http://127.0.0.1:8000/api/services/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(editForm),
        });
        if (res.ok) {
            const updated = await res.json();
            setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
            cancelEdit();
        } else {
            alert("Ошибка обновления услуги");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить услугу?")) return;
        const res = await fetch(`http://127.0.0.1:8000/api/services/${id}`, {
            method: "DELETE",
            headers,
        });
        if (res.ok) {
            setServices((prev) => prev.filter((s) => s.id !== id));
        } else {
            alert("Ошибка удаления услуги");
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mt-8">
            <h2 className="text-lg font-semibold mb-4">Услуги</h2>

            <form onSubmit={handleCreate} className="flex gap-2 mb-4">
                <input
                    value={newService.name}
                    onChange={(e) => setNewService({ name: e.target.value })}
                    placeholder="Название"
                    className="border px-3 py-1 rounded w-2/3"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Добавить
                </button>
            </form>

            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Название</th>
                        <th className="p-2 border">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s.id}>
                            <td className="p-2 border">{s.id}</td>
                            {editId === s.id ? (
                                <td className="p-2 border">
                                    <input
                                        value={editForm.name}
                                        onChange={(e) =>
                                            setEditForm({
                                                name: e.target.value,
                                            })
                                        }
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                </td>
                            ) : (
                                <td className="p-2 border">{s.name}</td>
                            )}
                            <td className="p-2 border">
                                {editId === s.id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdate(s.id)}
                                            className="text-green-600 text-xs mr-2"
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="text-gray-500 text-xs"
                                        >
                                            Отмена
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(s)}
                                            className="text-blue-600 text-xs mr-2"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="text-red-600 text-xs"
                                        >
                                            Удалить
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
