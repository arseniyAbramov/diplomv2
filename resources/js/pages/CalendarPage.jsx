import format from "date-fns/format";
import getDay from "date-fns/getDay";
import ru from "date-fns/locale/ru";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Aside from "../components/Aside";
import CreateAppointmentModal from "../components/CreateAppointmentModal";

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
    const [creatingSlot, setCreatingSlot] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://127.0.0.1:8000/api/appointments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) throw new Error("Ошибка загрузки");

            const data = await res.json();

            const events = data.map((item) => ({
                id: item.id,
                title: item.service?.name || "Запись клиента",
                start: new Date(item.start_time),
                end: new Date(item.end_time),
                client: item.client?.name,
                service: item.service?.name,
                price: item.price,
                master: item.user?.name, // 👈 заменено master → user
                notes: item.notes,
            }));

            setAppointments(events);
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");

        await fetch(
            `http://127.0.0.1:8000/api/appointments/${selectedEvent.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        setAppointments((prev) =>
            prev.filter((a) => a.id !== selectedEvent.id)
        );
        setSelectedEvent(null);
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
                    selectable
                    onSelectEvent={(event) => setSelectedEvent(event)}
                    onSelectSlot={(slotInfo) => setCreatingSlot(slotInfo)}
                    style={{
                        height: 600,
                        backgroundColor: "white",
                        padding: "1rem",
                    }}
                />

                {/* Модалка просмотра записи */}
                {selectedEvent && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white rounded-xl shadow-2xl p-6 z-50 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                            {selectedEvent.title}
                        </h2>

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
                                <span className="font-medium">Стоимость:</span>{" "}
                                {selectedEvent.price != null
                                    ? `${selectedEvent.price} ₽`
                                    : "—"}
                            </p>
                            <p>
                                <span className="font-medium">Время:</span>{" "}
                                <br />
                                {format(
                                    selectedEvent.start,
                                    "dd.MM.yyyy HH:mm",
                                    { locale: ru }
                                )}{" "}
                                —{" "}
                                {format(selectedEvent.end, "dd.MM.yyyy HH:mm", {
                                    locale: ru,
                                })}
                            </p>
                        </div>

                        <div className="mt-6 space-y-2">
                            <button
                                onClick={handleDelete}
                                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                            >
                                🗑 Удалить запись
                            </button>

                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}

                {/* Модалка создания записи */}
                {creatingSlot && (
                    <CreateAppointmentModal
                        slot={creatingSlot}
                        onClose={() => setCreatingSlot(null)}
                        onCreated={(newAppointment) => {
                            setAppointments((prev) => [
                                ...prev,
                                {
                                    ...newAppointment,
                                    title:
                                        newAppointment.service?.name ||
                                        "Запись клиента",
                                    start: new Date(newAppointment.start_time),
                                    end: new Date(newAppointment.end_time),
                                    client: newAppointment.client?.name,
                                    service: newAppointment.service?.name,
                                    price: newAppointment.price,
                                    master: newAppointment.user?.name,
                                },
                            ]);
                            setCreatingSlot(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
