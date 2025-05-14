import Aside from "../components/Aside";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-gray-800">Дашборд</h1>
                <p className="mt-4 text-gray-600">
                    Эта страница доступна только для администратора.
                </p>
            </div>
        </div>
    );
}
