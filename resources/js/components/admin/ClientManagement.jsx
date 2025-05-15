import { useEffect, useState } from "react";

export default function ClientManagement() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newClient, setNewClient] = useState({
        name: "",
        surname: "",
        phone: "",
    });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        surname: "",
        phone: "",
    });

    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/clients", { headers })
            .then((res) => res.json())
            .then(setClients)
            .catch(() => setError("Ошибка загрузки клиентов"))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/api/clients", {
            method: "POST",
            headers,
            body: JSON.stringify(newClient),
        });

        if (res.ok) {
            const data = await res.json();
            setClients([...clients, data.client]); // ← важно: .client, а не весь ответ
            setNewClient({ name: "", surname: "", phone: "" });
        } else {
            alert("Ошибка создания клиента");
        }
    };

    const startEdit = (client) => {
        setEditId(client.id);
        setEditForm({
            name: client.name,
            surname: client.surname || "",
            phone: client.phone || "",
        });
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditForm({ name: "", surname: "", phone: "" });
    };

    const handleUpdate = async (id) => {
        const res = await fetch(`http://127.0.0.1:8000/api/clients/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(editForm),
        });

        if (res.ok) {
            const updated = await res.json();
            setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
            cancelEdit();
        } else {
            alert("Ошибка обновления клиента");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить клиента?")) return;

        const res = await fetch(`http://127.0.0.1:8000/api/clients/${id}`, {
            method: "DELETE",
            headers,
        });

        if (res.ok) {
            setClients((prev) => prev.filter((c) => c.id !== id));
        } else {
            alert("Ошибка удаления клиента");
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mt-8">
            <h2 className="text-lg font-semibold mb-4">Клиенты</h2>

            <form onSubmit={handleCreate} className="flex gap-2 mb-4">
                <input
                    value={newClient.name}
                    onChange={(e) =>
                        setNewClient((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    placeholder="Имя"
                    className="border px-3 py-1 rounded w-1/4"
                    required
                />
                <input
                    value={newClient.surname}
                    onChange={(e) =>
                        setNewClient((prev) => ({
                            ...prev,
                            surname: e.target.value,
                        }))
                    }
                    placeholder="Фамилия (необязательно)"
                    className="border px-3 py-1 rounded w-1/4"
                />
                <input
                    value={newClient.phone}
                    onChange={(e) =>
                        setNewClient((prev) => ({
                            ...prev,
                            phone: e.target.value,
                        }))
                    }
                    placeholder="Телефон"
                    className="border px-3 py-1 rounded w-1/4"
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
                        <th className="p-2 border">Имя</th>
                        <th className="p-2 border">Фамилия</th>
                        <th className="p-2 border">Телефон</th>
                        <th className="p-2 border">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td className="p-2 border">{client.id}</td>
                            {editId === client.id ? (
                                <>
                                    <td className="p-2 border">
                                        <input
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm((f) => ({
                                                    ...f,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    </td>
                                    <td className="p-2 border">
                                        <input
                                            value={editForm.surname}
                                            onChange={(e) =>
                                                setEditForm((f) => ({
                                                    ...f,
                                                    surname: e.target.value,
                                                }))
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    </td>
                                    <td className="p-2 border">
                                        <input
                                            value={editForm.phone}
                                            onChange={(e) =>
                                                setEditForm((f) => ({
                                                    ...f,
                                                    phone: e.target.value,
                                                }))
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="p-2 border">
                                        {client.name}
                                    </td>
                                    <td className="p-2 border">
                                        {client.surname || "—"}
                                    </td>
                                    <td className="p-2 border">
                                        {client.phone || "—"}
                                    </td>
                                </>
                            )}
                            <td className="p-2 border">
                                {editId === client.id ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleUpdate(client.id)
                                            }
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
                                            onClick={() => startEdit(client)}
                                            className="text-blue-600 text-xs mr-2"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(client.id)
                                            }
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
