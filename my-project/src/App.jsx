import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AdminLayout from "./pages/admin/Admin-layout";
import Dashboard from "./components/admin/dashboard";
import StudentPage from "./pages/admin/student-page";

import TableReader from "./pages/admin/listdata";
import SchedulePage from "./pages/admin/schedule";
import CLass from "./pages/admin/class";
import Events from "./pages/admin/event";
import AuthLayout from "./pages/auth/auth-layout";
import LoginForm from "./pages/auth/login";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { checkAuth } from "./services/user";

function App() {



  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/list" element={<AdminLayout />}>
        <Route path="home" element={<Dashboard />} />
        <Route path="students" element={<StudentPage />} />
        <Route path="class" element={<CLass />} />
        <Route path="events" element={<Events />} />
        <Route path="attendance" element={<TableReader />} />
        <Route path="finance" element={<SchedulePage />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
      </Route>
    </Routes>
  );
}

export default App;
