import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Branch() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <i className="fas fa-code-branch text-green-600 text-2xl mr-3"></i>
              <h1 className="text-xl font-bold text-gray-800">Branch Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Xush kelibsiz, {user?.name || user?.username}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Branch Page</h2>
          <p className="text-gray-600 mb-6">
            Bu Branch foydalanuvchisi uchun maxsus sahifa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <i className="fas fa-user-graduate text-blue-600 text-3xl mb-3"></i>
              <h3 className="font-semibold text-gray-800 mb-2">O'quvchilar</h3>
              <p className="text-gray-600 text-sm">Filial o'quvchilari</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <i className="fas fa-chalkboard-teacher text-green-600 text-3xl mb-3"></i>
              <h3 className="font-semibold text-gray-800 mb-2">O'qituvchilar</h3>
              <p className="text-gray-600 text-sm">Filial o'qituvchilari</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <i className="fas fa-layer-group text-purple-600 text-3xl mb-3"></i>
              <h3 className="font-semibold text-gray-800 mb-2">Guruhlar</h3>
              <p className="text-gray-600 text-sm">Filial guruhlari</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





