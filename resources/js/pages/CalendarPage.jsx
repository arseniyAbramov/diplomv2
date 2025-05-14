import format from "date-fns/format";
import getDay from "date-fns/getDay";
import ru from "date-fns/locale/ru";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Aside from "../components/Aside";

const locales = { ru };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function CalendarPage() {
    const [appointments, setAppointments] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        price: "",
        start: "",
        end: "",
    });

    const formatForInput = (date) => date.toISOString().slice(0, 16);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "http://127.0.0.1:8000/api/appointments",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

                if (!res.ok) throw new Error("Ошибка загрузки записей");

                const data = await res.json();

                const events = data.map((item) => ({
                    id: item.id,
                    title: item.service?.name || "Запись клиента",
                    start: new Date(item.start_time),
                    end: new Date(item.end_time),
                    client: item.client?.name,
                    service: item.service?.name,
                    price: item.price,
                    master: item.master?.name,
                }));

                setAppointments(events);
            } catch (error) {
                console.error("Ошибка при загрузке:", error);
            }
        };

        fetchAppointments();
    }, []);

    const handleEdit = () => {
        setEditing(true);
        setFormData({
            price: selectedEvent.price ?? "",
            start: formatForInput(selectedEvent.start),
            end: formatForInput(selectedEvent.end),
        });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            const price = parseFloat(formData.price);
            const master_share = Math.round(price * 0.7);
            const studio_share = Math.round(price * 0.3);

            const res = await fetch(
                `http://127.0.0.1:8000/api/appointments/${selectedEvent.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        price,
                        master_share,
                        studio_share,
                        start_time: formData.start,
                        end_time: formData.end,
                    }),
                }
            );

            if (!res.ok) throw new Error("Ошибка при обновлении");

            const updated = await res.json();

            const updatedEvents = appointments.map((item) =>
                item.id === updated.id
                    ? {
                          ...item,
                          price: updated.price,
                          start: new Date(updated.start_time),
                          end: new Date(updated.end_time),
                      }
                    : item
            );

            setAppointments(updatedEvents);
            setEditing(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="flex min-h-screen relative">
            <Aside />
            <div className="flex-1 p-6 bg-gray-50">
                <h1 className="text-2xl font-bold mb-4">Календарь</h1>

                <Calendar
                    localizer={localizer}
                    events={appointments}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={(event) => setSelectedEvent(event)}
                    style={{
                        height: 600,
                        backgroundColor: "white",
                        padding: "1rem",
                    }}
                />

                {selectedEvent && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white rounded-xl shadow-2xl p-6 z-50 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                            {selectedEvent.title}
                        </h2>

                        {!editing ? (
                            <div className="space-y-2 text-gray-700 text-sm">
                                <p>
                                    <span className="font-medium">Мастер:</span>{" "}
                                    {selectedEvent.master || "—"}
                                </p>
                                <p>
                                    <span className="font-medium">Клиент:</span>{" "}
                                    {selectedEvent.client || "—"}
                                </p>
                                <p>
                                    <span className="font-medium">Услуга:</span>{" "}
                                    {selectedEvent.service || "—"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Стоимость:
                                    </span>{" "}
                                    {selectedEvent.price != null
                                        ? `${selectedEvent.price} ₽`
                                        : "—"}
                                </p>
                                <p>
                                    <span className="font-medium">Время:</span>
                                    <br />
                                    {format(
                                        selectedEvent.start,
                                        "dd.MM.yyyy HH:mm",
                                        { locale: ru }
                                    )}{" "}
                                    —{" "}
                                    {format(
                                        selectedEvent.end,
                                        "dd.MM.yyyy HH:mm",
                                        { locale: ru }
                                    )}
                                </p>

                                <div className="mt-6 space-y-2">
                                    <button
                                        onClick={handleEdit}
                                        className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                                    >
                                        ✏️ Редактировать запись
                                    </button>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-sm">
                                <div>
                                    <label className="block mb-1">
                                        Стоимость (₽):
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">
                                        Начало:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.start}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                start: e.target.value,
                                            })
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">
                                        Окончание:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.end}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                end: e.target.value,
                                            })
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div className="mt-4 space-y-2">
                                    <button
                                        onClick={handleUpdate}
                                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                                    >
                                        💾 Сохранить
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setSelectedEvent(null);
                                        }}
                                        className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
