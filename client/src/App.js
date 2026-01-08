import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

//------------ Route 
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (user === undefined) return null;

  if (!user) return <Navigate to="/" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* -=-==-=-=-=-=--=-Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* -------------------Admin Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["System Administrator"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/*----------------- Normal User Rout*/}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Normal User"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* ====================Store Owner Route */}
      <Route
        path="/store-owner"
        element={
          <ProtectedRoute allowedRoles={["Store Owner"]}>
            <h1>Store Owner Dashboard (Coming Soon)</h1>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
