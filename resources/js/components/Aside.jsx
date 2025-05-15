import { NavLink, useNavigate } from "react-router-dom";

export default function Aside() {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <aside className="sticky top-0 h-screen w-64 bg-white shadow-lg p-6">
            <div className="mb-8">
                <img
                    src="/logo-mechta.svg"
                    alt="Логотип"
                    className="w-32 mx-auto"
                />
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                <NavLink
                    to="/calendar"
                    className={({ isActive }) =>
                        `aside-link ${isActive ? "aside-link--active" : ""}`
                    }
                >
                    <img src="/icons/calendar.svg" alt="" className="icon" />
                    Календарь
                </NavLink>

                {role === "admin" && (
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `aside-link ${isActive ? "aside-link--active" : ""}`
                        }
                    >
                        <img src="/icons/chart.svg" alt="" className="icon" />
                        Дашборд
                    </NavLink>
                )}

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `aside-link ${isActive ? "aside-link--active" : ""}`
                    }
                >
                    <img src="/icons/profile.svg" alt="" className="icon" />
                    Профиль
                </NavLink>

                {role === "admin" && (
                    <NavLink
                        to="/staff"
                        className={({ isActive }) =>
                            `aside-link ${isActive ? "aside-link--active" : ""}`
                        }
                    >
                        <img src="/icons/people.svg" alt="" className="icon" />
                        Сотрудники
                    </NavLink>
                )}

                <NavLink
                    to="/guidelines"
                    className={({ isActive }) =>
                        `aside-link ${isActive ? "aside-link--active" : ""}`
                    }
                >
                    <img src="/icons/info-circle.svg" alt="" className="icon" />
                    Руководство
                </NavLink>

                {role === "admin" && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `aside-link ${isActive ? "aside-link--active" : ""}`
                        }
                    >
                        <img src="/icons/data.svg" alt="" className="icon" />
                        Админ панель
                    </NavLink>
                )}

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `aside-link ${isActive ? "aside-link--active" : ""}`
                    }
                >
                    <img src="/icons/setting.svg" alt="" className="icon" />
                    Настройки
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="aside-link mt-auto text-left"
                >
                    <img src="/icons/logout.svg" alt="" className="icon" />
                    Выход
                </button>
            </nav>
        </aside>
    );
}
