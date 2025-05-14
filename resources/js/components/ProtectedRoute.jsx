export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(role))
        return <Navigate to="/calendar" replace />;

    return children;
}
