import React from "react";
export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div>
        <a href="/" className="text-blue-600 font-bold">Bosh sahifa</a>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="flex items-center gap-2">
            <i className="fas fa-user-circle"></i> Admin
          </button>
        </div>
      </div>
    </nav>
  )
}
