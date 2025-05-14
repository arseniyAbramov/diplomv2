// resources/js/App.jsx
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import "../css/app.css";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </Router>
    );
}
