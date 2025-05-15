import { useEffect, useState } from "react";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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

        fetchUsers();
    }, []);

    const updateRole = async (userId, newRole) => {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `http://127.0.0.1:8000/api/users/${userId}/role`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            }
        );

        if (res.ok) {
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } else {
            alert("Ошибка при обновлении роли");
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Пользователи</h2>

            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="w-full text-sm text-left border">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Имя</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Роль</th>
                            <th className="p-2 border">Изменить</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="p-2 border">{user.id}</td>
                                <td className="p-2 border">{user.name}</td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border">{user.role}</td>
                                <td className="p-2 border">
                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            updateRole(user.id, e.target.value)
                                        }
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="user">user</option>
                                        <option value="master">master</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
