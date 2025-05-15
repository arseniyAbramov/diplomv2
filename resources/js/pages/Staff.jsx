import { useEffect, useState } from "react";
import Aside from "../components/Aside";

export default function Staff() {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("http://127.0.0.1:8000/api/staff", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            setStaff(data);
        };

        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Сотрудники
                </h1>

                <div className="grid gap-4">
                    {staff.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center bg-white rounded-xl shadow p-4 gap-6"
                        >
                            <img
                                src={
                                    user.avatar ||
                                    "https://via.placeholder.com/80?text=avatar"
                                }
                                alt="avatar"
                                className="w-20 h-20 rounded-full object-cover border"
                            />
                            <div className="flex-1">
                                <p className="text-xl font-semibold">
                                    {user.name} {user.surname}
                                </p>
                            </div>
                            <div className="flex gap-8 text-center">
                                <div>
                                    <p className="text-xl font-bold">
                                        {user.clients}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Клиенты
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">
                                        {user.average_check}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Средний чек
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">
                                        {user.sessions}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Татуировки
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
