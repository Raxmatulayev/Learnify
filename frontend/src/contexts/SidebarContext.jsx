import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const openMobileMenu = () => setIsMobileOpen(true);
  const closeMobileMenu = () => setIsMobileOpen(false);
  const toggleMobileMenu = () => setIsMobileOpen(prev => !prev);

  const value = {
    isMobileOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

