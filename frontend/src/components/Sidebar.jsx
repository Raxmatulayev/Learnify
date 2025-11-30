import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isMobileOpen, closeMobileMenu, toggleMobileMenu } = useSidebar();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Role bo'yicha menu items
  const getMenuItems = () => {
    const role = user?.role;

    if (role === "admin") {
      return [
        { path: "/dashboard", icon: "fa-home", label: "Dashboard" },
        { path: "/companies", icon: "fa-building", label: "Companylar" },
        { path: "/users", icon: "fa-users", label: "Foydalanuvchilar" },
      ];
    }

    if (role === "company") {
      return [
        { path: "/company", icon: "fa-home", label: "Dashboard" },
        { path: "/company/branches", icon: "fa-code-branch", label: "Filiallar" },
        { path: "/company/stats", icon: "fa-chart-bar", label: "Statistika" },
      ];
    }

    if (role === "branch") {
      return [
        { path: "/dashboard", icon: "fa-home", label: "Dashboard" },
        { path: "/students", icon: "fa-user-graduate", label: "O'quvchilar" },
        { path: "/teachers", icon: "fa-chalkboard-teacher", label: "O'qituvchilar" },
        { path: "/groups", icon: "fa-layer-group", label: "Guruhlar" },
        { path: "/payments", icon: "fa-credit-card", label: "To'lovlar" },
        { path: "/reports", icon: "fa-chart-line", label: "Hisobotlar" },
      ];
    }

    if (role === "teacher") {
      return [
        { path: "/teacher", icon: "fa-home", label: "Dashboard" },
        { path: "/teacher", icon: "fa-user-graduate", label: "O'quvchilar" },
        { path: "/teacher", icon: "fa-layer-group", label: "Guruhlarim" },
        { path: "/teacher", icon: "fa-clipboard-list", label: "Vazifalar" },
      ];
    }

    if (role === "student") {
      return [
        { path: "/student", icon: "fa-home", label: "Dashboard" },
        { path: "/student", icon: "fa-layer-group", label: "Guruhlarim" },
        { path: "/student", icon: "fa-tasks", label: "Vazifalarim" },
        { path: "/student", icon: "fa-calendar-alt", label: "Dars Jadvali" },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  // Mobil uchun overlay yopish
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } min-h-screen fixed left-0 top-0 z-50 shadow-2xl ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
      {/* Logo va Toggle */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Learnify ERP
                </h4>
                <p className="text-xs text-white/60">{user?.role || "User"}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
            >
              <i className="fas fa-times text-white/80"></i>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden md:block"
            >
              <i className={`fas ${isOpen ? "fa-chevron-left" : "fa-chevron-right"} text-white/80`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <i className={`fas ${item.icon} text-lg w-6 text-center`}></i>
            {isOpen && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Info va Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <i className="fas fa-user text-white"></i>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name || user?.username}</p>
              <p className="text-xs text-white/60 truncate">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors text-white/90 hover:text-white"
        >
          <i className="fas fa-sign-out-alt"></i>
          {isOpen && <span className="font-medium">Chiqish</span>}
        </button>
      </div>
    </aside>
    
    {/* Mobile Menu Toggle Button */}
    {!isMobileOpen && (
      <button
        onClick={toggleMobileMenu}
        className="fixed bottom-4 right-4 md:hidden z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <i className="fas fa-bars text-xl"></i>
      </button>
    )}
    </>
  );
}
