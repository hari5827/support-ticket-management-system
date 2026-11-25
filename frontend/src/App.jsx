
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TicketDetails from "./pages/TicketDetails";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      <Route
        path="/"
        element={
          user ? (
            user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <UserDashboard />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/tickets/:id"
        element={
          user ? (
            <TicketDetails />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
