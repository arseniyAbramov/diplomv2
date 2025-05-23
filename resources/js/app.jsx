// resources/js/App.jsx
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import "../css/app.css";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/Admin";
import CalendarPage from "./pages/CalendarPage";
import Dashboard from "./pages/Dashboard";
import Guidelines from "./pages/Guidelines";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Staff from "./pages/Staff";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/staff" element={<Staff />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
