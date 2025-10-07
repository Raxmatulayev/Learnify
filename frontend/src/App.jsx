import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students"; 
import Teachers from "./pages/Teachers";
import Groups from "./pages/Groups";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/students" element={<Students />} /> 
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default App;
