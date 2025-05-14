import Aside from "../components/Aside";

// resources/js/pages/Calendar.jsx
export default function Calendar() {
    return (
        <div className="flex">
            <Aside />
            <h1>Календарь</h1>
            <main className="flex-1 p-6">{/* Контент страницы */}</main>
        </div>
    );
}
