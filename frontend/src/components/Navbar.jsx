import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggleMobileMenu } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center md:ml-64 ml-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <i className="fas fa-bars text-gray-700 text-xl"></i>
        </button>
        <a href="/dashboard" className="text-blue-600 font-bold hidden sm:block">Bosh sahifa</a>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <i className="fas fa-user-circle text-gray-600 text-xl"></i>
          <span className="text-gray-700 hidden sm:inline">{user?.name || user?.username || "Admin"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span className="hidden sm:inline">Chiqish</span>
        </button>
      </div>
    </nav>
  );
}
