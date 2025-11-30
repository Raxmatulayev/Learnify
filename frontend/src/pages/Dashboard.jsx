import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

// Skeleton loader komponenti
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* So'nggi faoliyat skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tezkor amallar skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Yangi O'quvchi Modal Komponenti (Yangilangan)
function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    groupId: "",
    group: "",
    phone: "",
    status: "active",
    payment: "unpaid"
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_BASE}/groups`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Guruhlarni olishda xatolik:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: Date.now(),
          groupId: formData.groupId ? parseInt(formData.groupId) : null,
          group: formData.group || null
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setFormData({
          name: "",
          groupId: "",
          group: "",
          phone: "",
          status: "active",
          payment: "unpaid"
        });
      } else {
        alert("O'quvchi qo'shishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Agar guruh tanlansa, guruh nomini avtomatik to'ldirish
    if (field === "groupId" && value) {
      const selectedGroup = groups.find(group => group.id === parseInt(value));
      if (selectedGroup) {
        setFormData(prev => ({
          ...prev,
          groupId: value,
          group: selectedGroup.name
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Yangi O'quvchi Qo'shish</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ism va Familiya *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ali Valiyev"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+998901112233"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guruh
              </label>
              <select
                value={formData.groupId}
                onChange={(e) => handleInputChange("groupId", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Guruh tanlanmagan</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holati
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Faol</option>
                  <option value="inactive">Faol emas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To'lov holati
                </label>
                <select
                  value={formData.payment}
                  onChange={(e) => handleInputChange("payment", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="paid">To'langan</option>
                  <option value="unpaid">To'lanmagan</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Yangi O'qituvchi Modal Komponenti
function AddTeacherModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    phone: "",
    salary: "",
    status: "active"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: Date.now()
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setFormData({
          name: "",
          subject: "",
          phone: "",
          salary: "",
          status: "active"
        });
      } else {
        alert("O'qituvchi qo'shishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Yangi O'qituvchi Qo'shish</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ism va Familiya *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Qobiljon Karimov"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fan *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Fizika"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+998901238372"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maosh
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder="3450000"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holati
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Faol</option>
                <option value="inactive">Faol emas</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Yangi Guruh Modal Komponenti
function AddGroupModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    teacherId: "",
    startDate: "",
    schedule: "",
    startTime: "",
    endTime: "",
    capacity: 20,
    status: "upcoming"
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE}/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("O'qituvchilarni olishda xatolik:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: Date.now(),
          teacherId: parseInt(formData.teacherId),
          capacity: parseInt(formData.capacity),
          students: [],
          studentsCount: 0
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setFormData({
          name: "",
          teacherId: "",
          startDate: "",
          schedule: "",
          startTime: "",
          endTime: "",
          capacity: 20,
          status: "upcoming"
        });
      } else {
        alert("Guruh yaratishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Yangi Guruh Yaratish</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guruh Nomi *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Fizika"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                O'qituvchi *
              </label>
              <select
                required
                value={formData.teacherId}
                onChange={(e) => handleInputChange("teacherId", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tanlang</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Boshlanish Sanasi
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dars Jadvali
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => handleInputChange("schedule", e.target.value)}
                placeholder="Dushanba Chorshanba Juma"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Boshlanish Vaqti
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tugash Vaqti
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maksimal O'quvchilar
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 20)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holati
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="upcoming">Boshlanmagan</option>
                <option value="active">Faol</option>
                <option value="completed">Yakunlangan</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Yangi To'lov Modal Komponenti
function AddPaymentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    paymentType: "cash",
    description: ""
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("O'quvchilarni olishda xatolik:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          studentId: parseInt(formData.studentId),
          amount: parseFloat(formData.amount)
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setFormData({
          studentId: "",
          amount: "",
          paymentDate: new Date().toISOString().split('T')[0],
          paymentType: "cash",
          description: ""
        });
      } else {
        alert("To'lov qo'shishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Yangi To'lov Qo'shish</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                O'quvchi *
              </label>
              <select
                required
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tanlang</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To'lov Miqdori *
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="500000"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To'lov Sanasi *
              </label>
              <input
                type="date"
                required
                value={formData.paymentDate}
                onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To'lov Turi
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => handleInputChange("paymentType", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cash">Naqd</option>
                <option value="card">Karta</option>
                <option value="transfer">O'tkazma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Izoh
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows="3"
                placeholder="To'lov haqida qo'shimcha ma'lumot"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Asosiy Dashboard Komponenti
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    groups: 0,
    paymentRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Modal holatlari
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Barcha ma'lumotlarni parallel ravishda olish
      const [studentsRes, teachersRes, groupsRes] = await Promise.all([
        fetch(`${API_BASE}/students`),
        fetch(`${API_BASE}/teachers`),
        fetch(`${API_BASE}/groups`)
      ]);

      if (!studentsRes.ok || !teachersRes.ok || !groupsRes.ok) {
        throw new Error("Ma'lumotlarni olishda xatolik");
      }

      const students = await studentsRes.json();
      const teachers = await teachersRes.json();
      const groups = await groupsRes.json();

      // Statistikani hisoblash
      const totalStudents = students.length;
      const totalTeachers = teachers.length;
      const totalGroups = groups.length;

      // To'lov stavkasini hisoblash
      const paymentRate = calculatePaymentRate(students);

      // So'nggi faoliyatni yaratish
      const activity = generateRecentActivity(students, teachers, groups);

      setStats({
        students: totalStudents,
        teachers: totalTeachers,
        groups: totalGroups,
        paymentRate: paymentRate
      });
      setRecentActivity(activity);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
      setStats({
        students: 0,
        teachers: 0,
        groups: 0,
        paymentRate: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  // To'lov stavkasini hisoblash funksiyasi
  const calculatePaymentRate = (students) => {
    if (students.length === 0) return 0;
    
    const paidStudents = students.filter(student => 
      student.payment === 'paid'
    ).length;
    
    return Math.round((paidStudents / students.length) * 100);
  };

  // So'nggi faoliyatni yaratish funksiyasi
  const generateRecentActivity = (students, teachers, groups) => {
    const activities = [];

    // Yangi o'quvchilar
    const newStudents = students
      .slice(-3)
      .map(student => ({
        id: student.id,
        name: student.name,
        action: "Yangi ro'yxatdan o'tdi",
        time: "Yaqinda",
        type: "success"
      }));

    // Yangi o'qituvchilar
    const newTeachers = teachers
      .slice(-2)
      .map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        action: "Yangi o'qituvchi qo'shildi",
        time: "Yaqinda",
        type: "info"
      }));

    // Yangi guruhlar
    const newGroups = groups
      .slice(-2)
      .map(group => ({
        id: group.id,
        name: group.name,
        action: "Yangi guruh yaratildi",
        time: "Yaqinda",
        type: "payment"
      }));

    // Barcha faoliyatlarni birlashtirish
    activities.push(...newStudents, ...newTeachers, ...newGroups);

    // Vaqt bo'yicha saralash va cheklash
    return activities.slice(-5);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "success": return "fas fa-user-plus text-green-500";
      case "payment": return "fas fa-credit-card text-blue-500";
      case "warning": return "fas fa-exchange-alt text-yellow-500";
      case "error": return "fas fa-user-times text-red-500";
      case "info": return "fas fa-calendar-plus text-purple-500";
      default: return "fas fa-info-circle text-gray-500";
    }
  };

  const handleSuccess = () => {
    // Yangi ma'lumot qo'shilgandan so'ng dashboardni yangilash
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 ml-0 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <DashboardSkeleton />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 ml-0 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">O'quv markazi boshqaruvi va monitoringi</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all"
                 onClick={() => navigate("/students")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">O'quvchilar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.students}</h2>
                </div>
                <i className="fas fa-users text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all"
                 onClick={() => navigate("/teachers")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">O'qituvchilar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.teachers}</h2>
                </div>
                <i className="fas fa-chalkboard-teacher text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all"
                 onClick={() => navigate("/groups")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Guruhlar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.groups}</h2>
                </div>
                <i className="fas fa-layer-group text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all"
                 onClick={() => navigate("/payments")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">To'lovlar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.paymentRate}%</h2>
                  <p className="text-orange-100 text-xs mt-1">To'lov qilingan</p>
                </div>
                <i className="fas fa-credit-card text-2xl opacity-80"></i>
              </div>
            </div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* So'nggi Faoliyat */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">So'nggi Faoliyat</h3>
                <button 
                  onClick={() => navigate("/activity")}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Barchasini ko'rish
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <i className={`${getActivityIcon(activity.type)} text-lg`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{activity.name}</p>
                        <p className="text-gray-500 text-sm">{activity.action}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-inbox text-4xl mb-2 opacity-50"></i>
                    <p>Hozircha faoliyat mavjud emas</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tezkor Amallar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-6">Tezkor Amallar</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowStudentModal(true)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-blue-100 flex flex-col items-center justify-center h-20"
                >
                  <i className="fas fa-user-plus text-xl mb-1"></i>
                  <p className="text-sm font-medium">Yangi O'quvchi</p>
                </button>
                
                <button 
                  onClick={() => setShowTeacherModal(true)}
                  className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-green-100 flex flex-col items-center justify-center h-20"
                >
                  <i className="fas fa-chalkboard-teacher text-xl mb-1"></i>
                  <p className="text-sm font-medium">Yangi O'qituvchi</p>
                </button>
                
                <button 
                  onClick={() => setShowGroupModal(true)}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-purple-100 flex flex-col items-center justify-center h-20"
                >
                  <i className="fas fa-layer-group text-xl mb-1"></i>
                  <p className="text-sm font-medium">Yangi Guruh</p>
                </button>
                
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-orange-100 flex flex-col items-center justify-center h-20"
                >
                  <i className="fas fa-file-invoice-dollar text-xl mb-1"></i>
                  <p className="text-sm font-medium">Yangi To'lov</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal komponentlari */}
      <AddStudentModal 
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onSuccess={handleSuccess}
      />
      
      <AddTeacherModal 
        isOpen={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
        onSuccess={handleSuccess}
      />
      
      <AddGroupModal 
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onSuccess={handleSuccess}
      />
      
      <AddPaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}