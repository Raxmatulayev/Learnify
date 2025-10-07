import React from "react";
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white hidden md:block">
      <div className="p-4 text-center border-b border-gray-700">
        <h4 className="font-bold text-lg"><i className="fas fa-graduation-cap"></i> Learnify</h4>
      </div>
      <nav className="flex flex-col">
        <Link to="/" className="px-4 py-3 hover:bg-gray-700">Dashboard</Link>
        <Link to="/students" className="px-4 py-3 hover:bg-gray-700">O'quvchilar</Link>
        <Link to="/teachers" className="px-4 py-3 hover:bg-gray-700">O'qituvchilar</Link>
        <Link to="/groups" className="px-4 py-3 hover:bg-gray-700">Guruhlar</Link>
        <Link to="/payments" className="px-4 py-3 hover:bg-gray-700">To'lovlar</Link>
        <Link to="/reports" className="px-4 py-3 hover:bg-gray-700">Hisobotlar</Link>
      </nav>
    </aside>
  )
}
