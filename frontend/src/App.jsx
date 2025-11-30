import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students"; 
import Teachers from "./pages/Teachers";
import Groups from "./pages/Groups";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Company from "./pages/Company";
import Branch from "./pages/Branch";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import Admin from "./pages/Admin";

// Protected Route komponenti
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Admin va branch uchun dashboard ga yo'naltirish
    if (user?.role === "admin" || user?.role === "branch") {
      return <Navigate to="/dashboard" replace />;
    }
    // Boshqa rollar uchun o'z sahifasiga
    return <Navigate to={`/${user?.role}`} replace />;
  }

  return children;
}

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Login sahifasi */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            user?.role === "company" ? <Navigate to="/company" replace /> :
            user?.role === "admin" ? <Navigate to="/companies" replace /> :
            user?.role === "branch" ? <Navigate to="/dashboard" replace /> :
            user?.role === "teacher" ? <Navigate to="/teacher" replace /> :
            user?.role === "student" ? <Navigate to="/student" replace /> :
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        } 
      />
      
      {/* Admin sahifalari */}
      <Route 
        path="/companies" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        } 
      />

      {/* Asosiy ERP sahifalari - branch va admin uchun */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={["branch", "admin"]}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/students" 
        element={
          <ProtectedRoute allowedRoles={["branch", "admin"]}>
            <Students />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers" 
        element={
          <ProtectedRoute allowedRoles={["branch", "admin"]}>
            <Teachers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/groups" 
        element={
          <ProtectedRoute allowedRoles={["branch", "admin"]}>
            <Groups />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payments" 
        element={
          <ProtectedRoute allowedRoles={["branch", "admin"]}>
            <Payments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRoles={["branch", "admin"]}>
            <Reports />
          </ProtectedRoute>
        } 
      />

      {/* Role-based sahifalar */}
      <Route 
        path="/company" 
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <Company />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/branch" 
        element={
          <ProtectedRoute allowedRoles={["branch"]}>
            <Branch />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher" 
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <Teacher />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Student />
          </ProtectedRoute>
        } 
      />

      {/* Root path */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            user?.role === "company" ? <Navigate to="/company" replace /> :
            user?.role === "admin" ? <Navigate to="/companies" replace /> :
            user?.role === "branch" ? <Navigate to="/dashboard" replace /> :
            user?.role === "teacher" ? <Navigate to="/teacher" replace /> :
            user?.role === "student" ? <Navigate to="/student" replace /> :
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Not found route - barcha boshqa routelar uchun */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } 
      />
    </Routes>
  );
}

export default App;
