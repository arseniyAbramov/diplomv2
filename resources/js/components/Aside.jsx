import { NavLink } from "react-router-dom";

export default function Aside() {
    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded transition font-medium ${
            isActive
                ? "bg-indigo-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    const iconClass = (isActive) =>
        `w-5 h-5 transition ${isActive ? "brightness-0 invert" : ""}`;

    const navItems = [
        { to: "/calendar", icon: "calendar", label: "Календарь" },
        { to: "/dashboard", icon: "chart", label: "Дашборд" },
        { to: "/profile", icon: "profile", label: "Профиль" },
        { to: "/staff", icon: "people", label: "Сотрудники" },
        { to: "/guidelines", icon: "info-circle", label: "Руководство" },
        { to: "/admin", icon: "data", label: "Админ панель" },
        { to: "/settings", icon: "setting", label: "Настройки" },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r flex flex-col p-4 shadow-sm">
            <div className="mb-8">
                <img
                    src="/logo-mechta.svg"
                    alt="Логотип"
                    className="w-32 mx-auto"
                />
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={navLinkClass}
                    >
                        {({ isActive }) => (
                            <>
                                <img
                                    src={`/icons/${item.icon}.svg`}
                                    alt=""
                                    className={iconClass(isActive)}
                                />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}

                <button className="flex items-center gap-3 px-4 py-2 mt-auto text-gray-700 hover:bg-gray-100 rounded transition">
                    <img src="/icons/logout.svg" alt="" className="w-5 h-5" />
                    Выход
                </button>
            </nav>
        </aside>
    );
}
