import ClientManagement from "../components/admin/ClientManagement";
import UserManagement from "../components/admin/UserManagement";
import Aside from "../components/Aside";

export default function AdminPage() {
    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className="flex-1 p-6 bg-gray-50">
                <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>

                <UserManagement />
                <ClientManagement />
            </div>
        </div>
    );
}
