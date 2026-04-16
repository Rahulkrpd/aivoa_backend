import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            token
              ? (
                JSON.parse(atob(token.split(".")[1])).role === "admin"
                  ? <Navigate to="/admin" />
                  : <Navigate to="/" />
              )
              : <Login />
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={token ?
            (
              JSON.parse(atob(token.split(".")[1])).role === "admin"
                ? <Navigate to="/admin" />
                : <Navigate to="/" />
            )
            : <Register />
          }
        />
        <Route
          path="/admin"
          element={
            token
              ? (
                JSON.parse(atob(token.split(".")[1])).role === "admin"
                  ? <AdminDashboard />
                  : <Navigate to="/" />
              )
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;