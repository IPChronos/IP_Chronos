import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import SecretariatDashboard from "./pages/SecretariatDashboard";
import Calendar from "./pages/Calendar";

import './index.css'; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/student-dashboard" element={<StudentDashboard />} />
  <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
  <Route path="/secretariat-dashboard" element={<SecretariatDashboard />} />

</Routes>
    </BrowserRouter>
  </React.StrictMode>
);
