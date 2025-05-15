import { useEffect, useState } from "react";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editUserId, setEditUserId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        surname: "",
        email: "",
        role: "user",
    });

    const [newUser, setNewUser] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        role: "user",
    });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://127.0.0.1:8000/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) throw new Error("Ошибка загрузки пользователей");

            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const startEditing = (user) => {
        setEditUserId(user.id);
        setEditForm({
            name: user.name,
            surname: user.surname || "",
            email: user.email,
            role: user.role,
        });
    };

    const cancelEditing = () => {
        setEditUserId(null);
        setEditForm({ name: "", surname: "", email: "", role: "user" });
    };

    const handleUpdate = async (userId) => {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(editForm),
        });

        if (res.ok) {
            const updatedUser = await res.json();
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? updatedUser : u))
            );
            cancelEditing();
        } else {
            alert("Ошибка при сохранении изменений");
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm("Удалить пользователя?")) return;

        const token = localStorage.getItem("token");

        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        if (res.ok) {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } else {
            alert("Ошибка при удалении пользователя");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/register", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(newUser),
        });

        if (res.ok) {
            setNewUser({
                name: "",
                surname: "",
                email: "",
                password: "",
                role: "user",
            });
            await fetchUsers();
        } else {
            const data = await res.json();
            alert(data.message || "Ошибка при создании пользователя");
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow space-y-6">
            <h2 className="text-lg font-semibold">Пользователи</h2>

            <form
                onSubmit={handleCreate}
                className="grid grid-cols-6 gap-4 items-end bg-gray-50 p-4 rounded border"
            >
                <div className="col-span-1">
                    <label className="block text-xs font-medium">Имя</label>
                    <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                        }
                        required
                        className="w-full border px-2 py-1 rounded"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium">Фамилия</label>
                    <input
                        type="text"
                        value={newUser.surname}
                        onChange={(e) =>
                            setNewUser({ ...newUser, surname: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium">Email</label>
                    <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                        }
                        required
                        className="w-full border px-2 py-1 rounded"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium">Пароль</label>
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                        }
                        required
                        className="w-full border px-2 py-1 rounded"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium">Роль</label>
                    <select
                        value={newUser.role}
                        onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded"
                    >
                        <option value="user">user</option>
                        <option value="master">master</option>
                        <option value="admin">admin</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                    >
                        ➕ Добавить
                    </button>
                </div>
            </form>

            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="w-full text-sm text-left border">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Имя</th>
                            <th className="p-2 border">Фамилия</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Роль</th>
                            <th className="p-2 border">Создан</th>
                            <th className="p-2 border">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="p-2 border">{user.id}</td>
                                {editUserId === user.id ? (
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
                                                value={editForm.email}
                                                onChange={(e) =>
                                                    setEditForm((f) => ({
                                                        ...f,
                                                        email: e.target.value,
                                                    }))
                                                }
                                                className="border px-2 py-1 rounded w-full"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <select
                                                value={editForm.role}
                                                onChange={(e) =>
                                                    setEditForm((f) => ({
                                                        ...f,
                                                        role: e.target.value,
                                                    }))
                                                }
                                                className="border px-2 py-1 rounded"
                                            >
                                                <option value="user">
                                                    user
                                                </option>
                                                <option value="master">
                                                    master
                                                </option>
                                                <option value="admin">
                                                    admin
                                                </option>
                                            </select>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-2 border">
                                            {user.name}
                                        </td>
                                        <td className="p-2 border">
                                            {user.surname || "—"}
                                        </td>
                                        <td className="p-2 border">
                                            {user.email}
                                        </td>
                                        <td className="p-2 border">
                                            {user.role}
                                        </td>
                                    </>
                                )}
                                <td className="p-2 border">
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="p-2 border flex gap-2 items-center">
                                    {editUserId === user.id ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleUpdate(user.id)
                                                }
                                                className="text-green-600 text-xs hover:underline"
                                            >
                                                Сохранить
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="text-gray-500 text-xs hover:underline"
                                            >
                                                Отмена
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    startEditing(user)
                                                }
                                                className="text-blue-600 text-xs hover:underline"
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                className="text-red-600 text-xs hover:underline"
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
            )}
        </div>
    );
}
