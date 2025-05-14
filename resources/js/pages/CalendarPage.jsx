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
                    price: item.service?.price ?? null, // безопасно
                    master: item.master?.name,
                    notes: item.notes,
                }));

                setAppointments(events);
            } catch (error) {
                console.error("Ошибка при загрузке:", error);
            }
        };

        fetchAppointments();
    }, []);

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

                {/* Модалка */}
                {selectedEvent && (
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-xl p-6 z-50 w-[400px]">
                        <h2 className="text-xl font-bold mb-2">
                            {selectedEvent.title}
                        </h2>
                        <p className="text-sm text-gray-700 mb-2">
                            Мастер: {selectedEvent.master || "не указано"}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                            Клиент: {selectedEvent.client || "не указано"}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                            Услуга: {selectedEvent.service || "—"}
                        </p>
                        {selectedEvent.price !== undefined &&
                            selectedEvent.price !== null && (
                                <p className="text-sm text-gray-700 mb-2">
                                    Стоимость: {selectedEvent.price}₽
                                </p>
                            )}
                        <p className="text-sm text-gray-700 mb-2">
                            С{" "}
                            {format(selectedEvent.start, "dd.MM.yyyy HH:mm", {
                                locale: ru,
                            })}
                            <br />
                            до{" "}
                            {format(selectedEvent.end, "dd.MM.yyyy HH:mm", {
                                locale: ru,
                            })}
                        </p>
                        {selectedEvent.notes && (
                            <p className="text-sm text-gray-600 italic">
                                Заметки: {selectedEvent.notes}
                            </p>
                        )}
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Закрыть
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
