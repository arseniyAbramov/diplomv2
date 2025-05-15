import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Aside from "../components/Aside";

export default function Dashboard() {
    const [monthlyIncome, setMonthlyIncome] = useState([]);
    const [appointmentsByMaster, setAppointmentsByMaster] = useState([]);
    const [appointmentsByService, setAppointmentsByService] = useState([]);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/dashboard", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const data = await res.json();

        setMonthlyIncome(data.monthly_income);
        setAppointmentsByMaster(data.by_master);
        setAppointmentsByService(data.by_service);
    };

    const downloadCSV = () => {
        const rows = [
            ["Месяц", "Доход"],
            ...monthlyIncome.map((item) => [item.month, item.total]),
        ];

        const csv = rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "dashboard_report.csv";
        a.click();
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className="flex-1 p-8 bg-gray-50 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Дашборд
                    </h1>
                    <button
                        onClick={downloadCSV}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        📥 Скачать отчёт
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Доход по месяцам
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyIncome}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Записи по мастерам
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={appointmentsByMaster}
                                    dataKey="count"
                                    nameKey="master"
                                    outerRadius={100}
                                    label
                                >
                                    {appointmentsByMaster.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={`hsl(${
                                                index * 60
                                            }, 70%, 60%)`}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Записи по услугам
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={appointmentsByService}
                                    dataKey="count"
                                    nameKey="service"
                                    outerRadius={100}
                                    label
                                >
                                    {appointmentsByService.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={`hsl(${
                                                index * 50
                                            }, 70%, 60%)`}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
