import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Agents from "./pages/Agents/Agents";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Departments from "./pages/Departments/Departments";
import Documents from "./pages/Documents/Documents";
import AI from "./pages/AI/AI";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

const protectedPage = (page) => (
  <ProtectedRoute>
    <DashboardLayout>{page}</DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/dashboard" replace />
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={protectedPage(<Dashboard />)}
      />

      <Route
        path="/employees"
        element={protectedPage(<Employees />)}
      />

      <Route
        path="/departments"
        element={protectedPage(<Departments />)}
      />

      <Route
        path="/documents"
        element={protectedPage(<Documents />)}
      />

      <Route
        path="/ai"
        element={protectedPage(<AI />)}
      />

      <Route
        path="/agents"
        element={protectedPage(<Agents />)}
      />

      <Route
        path="/settings"
        element={protectedPage(<Settings />)}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;