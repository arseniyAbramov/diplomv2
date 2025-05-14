import { useEffect, useState } from "react";

export default function CreateAppointmentModal({ slot, onClose, onCreated }) {
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [masters, setMasters] = useState([]);

    const [clientId, setClientId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [masterId, setMasterId] = useState("");
    const [start, setStart] = useState(slot.start);
    const [end, setEnd] = useState(slot.end);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formatDateTime = (date) => {
        return new Date(date).toISOString().slice(0, 16);
    };

    const parseDateTime = (str) => {
        return new Date(str);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        Promise.all([
            fetch("http://127.0.0.1:8000/api/clients").then((res) =>
                res.json()
            ),
            fetch("http://127.0.0.1:8000/api/services").then((res) =>
                res.json()
            ),
        ]).then(([clientsData, servicesData]) => {
            setClients(clientsData);
            setServices(servicesData);
        });

        // Мастера — это пользователи с ролью "master"
        fetch("http://127.0.0.1:8000/api/users")
            .then((res) => res.json())
            .then((data) => {
                const mastersOnly = data.filter(
                    (user) => user.role === "master"
                );
                setMasters(mastersOnly);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const service = services.find((s) => s.id == serviceId);
        if (!service) {
            setError("Услуга не найдена");
            setLoading(false);
            return;
        }

        const price = parseFloat(service.price);
        const masterShare = Math.round(price * 0.7);
        const studioShare = Math.round(price * 0.3);

        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/appointments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                service_id: serviceId,
                master_id: masterId,
                start_time: start,
                end_time: end,
                price,
                master_share: masterShare,
                studio_share: studioShare,
            }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.message || "Ошибка создания");
            return;
        }

        onCreated(data);
    };

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white rounded-xl shadow-2xl p-6 z-50 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                Создать запись
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 text-sm text-gray-700"
            >
                <div>
                    <label className="block mb-1 font-medium">Клиент</label>
                    <select
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Выберите клиента</option>
                        {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Услуга</label>
                    <select
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Выберите услугу</option>
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({s.price}₽)
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Мастер</label>
                    <select
                        value={masterId}
                        onChange={(e) => setMasterId(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Выберите мастера</option>
                        {masters.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Начало</label>
                        <input
                            type="datetime-local"
                            value={formatDateTime(start)}
                            onChange={(e) =>
                                setStart(parseDateTime(e.target.value))
                            }
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Конец</label>
                        <input
                            type="datetime-local"
                            value={formatDateTime(end)}
                            onChange={(e) =>
                                setEnd(parseDateTime(e.target.value))
                            }
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "Создание..." : "Создать"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}
