import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_BASE } from "../config/api";

// Modal forma komponenti
function TeacherModal({ teacher, onClose, onSave }) {
  const [formData, setFormData] = useState(
    teacher || {
      name: "",
      subject: "",
      phone: "",
      salary: "",
      status: "active",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {teacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ism"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Fan"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Maosh"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
          </select>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Skeleton loader komponenti
function TeachersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Filter va search skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
          <div className="h-12 bg-gray-200 rounded w-48"></div>
          <div className="h-12 bg-gray-200 rounded w-48"></div>
        </div>
      </div>

      // Jadval skeleton qismini yangilash
      <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Teachers() {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [editTeacher, setEditTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Backenddan o'qituvchilarni olish
  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.TEACHERS);
        const data = await res.json();
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (error) {
        console.error("❌ O'qituvchilarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachersData();
  }, []);

  // Backenddan o'quvchilarni olish
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.STUDENTS);
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("❌ O'quvchilarni yuklashda xatolik:", error);
      }
    };
    fetchStudentsData();
  }, []);

  // Filterlash
  useEffect(() => {
    let filtered = teachers;
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.includes(searchTerm)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    if (subjectFilter !== "all") {
      filtered = filtered.filter(t => t.subject === subjectFilter);
    }
    setFilteredTeachers(filtered);
  }, [searchTerm, statusFilter, subjectFilter, teachers]);

  // 📌 Qo'shish
  const addTeacher = async (teacherData) => {
    const res = await fetch(API_ENDPOINTS.TEACHERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacherData),
    });
    const newTeacher = await res.json();
    setTeachers([...teachers, newTeacher]);
    setShowModal(false);
  };

  // 📌 Tahrirlash
  const saveEdit = async (updatedTeacher) => {
    const res = await fetch(`${API_ENDPOINTS.TEACHERS}/${updatedTeacher.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTeacher),
    });
    const data = await res.json();
    setTeachers((prev) =>
      prev.map((t) => (t.id === updatedTeacher.id ? data : t))
    );
    setEditTeacher(null);
    setShowModal(false);
  };

  // 📌 O'chirish
  const deleteTeacher = async (id) => {
    await fetch(`${API_ENDPOINTS.TEACHERS}/${id}`, { method: "DELETE" });
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // Har bir o'qituvchining o'quvchilar sonini hisoblash
  const getTeacherStudentsCount = (teacherId) => {
    return students.filter(student => student.teacherId === teacherId).length;
  };

  // Jami o'quvchilar sonini hisoblash
  const getTotalStudentsCount = () => {
    return students.length;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status === "active" ? "Faol" : "Faol emas"}
      </span>
    );
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Matematika": "bg-blue-100 text-blue-800",
      "Fizika": "bg-purple-100 text-purple-800",
      "Ingliz tili": "bg-green-100 text-green-800",
      "Dasturlash": "bg-orange-100 text-orange-800",
      "Kimyo": "bg-pink-100 text-pink-800"
    };
    return colors[subject] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === "active").length,
    subjects: [...new Set(teachers.map(t => t.subject))].length,
    totalStudents: getTotalStudentsCount()
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 ml-0 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <TeachersSkeleton />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">O'qituvchilar</h1>
              <p className="text-gray-600">Barcha o'qituvchilar ro'yxati va ma'lumotlari</p>
            </div>
            <button
              onClick={() => {
                setEditTeacher(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition transform hover:scale-105 mt-4 md:mt-0"
            >
              <i className="fas fa-plus"></i>
              Yangi O'qituvchi
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Jami O'qituvchilar</p>
                  <h2 className="text-3xl font-bold">{stats.total}</h2>
                </div>
                <i className="fas fa-chalkboard-teacher text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Faol O'qituvchilar</p>
                  <h2 className="text-3xl font-bold">{stats.active}</h2>
                </div>
                <i className="fas fa-user-check text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Fanlar</p>
                  <h2 className="text-3xl font-bold">{stats.subjects}</h2>
                </div>
                <i className="fas fa-book text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Jami O'quvchilar</p>
                  <h2 className="text-3xl font-bold">{stats.totalStudents}</h2>
                </div>
                <i className="fas fa-users text-2xl opacity-80"></i>
              </div>
            </div>
          </div>

          {/* Filter va Search */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="O'qituvchi ismi, fani yoki telefon raqami bo'yicha qidirish..."
                  className="w-full pl-10 pr-1 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Barcha holatlar</option>
                <option value="active">Faol</option>
                <option value="inactive">Faol emas</option>
              </select>

              <select
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="all">Barcha fanlar</option>
                {[...new Set(teachers.map(t => t.subject))].map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* O'qituvchilar Jadvali */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">O'qituvchilar Ro'yxati</h3>
              <span className="text-gray-500">{filteredTeachers.length} ta o'qituvchi</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 font-medium text-gray-500">O'qituvchi</th>
                    <th className="text-left py-4 font-medium text-gray-500">Fan</th>
                    <th className="text-left py-4 font-medium text-gray-500">Telefon</th>
                    <th className="text-left py-4 font-medium text-gray-500">O'quvchilar</th>
                    <th className="text-left py-4 font-medium text-gray-500">Maosh</th>
                    <th className="text-left py-4 font-medium text-gray-500">Holati</th>
                    <th className="text-left py-4 font-medium text-gray-500">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg">
                            {teacher.avatar || "👨‍🏫"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{teacher.name}</p>
                            {teacher.email && (
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <i className="fas fa-envelope text-blue-500 text-xs"></i>
                                {teacher.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(teacher.subject)}`}>
                          {teacher.subject}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-phone text-blue-500"></i>
                          <span className="font-medium">{teacher.phone}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-users text-green-500"></i>
                          <span className="font-medium">{getTeacherStudentsCount(teacher.id)}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-money-bill-wave text-orange-500"></i>
                          <span className="font-medium">{teacher.salary?.toLocaleString() || '0'} so'm</span>
                        </div>
                      </td>
                      <td className="py-4">
                        {getStatusBadge(teacher.status)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditTeacher(teacher);
                              setShowModal(true);
                            }}
                            className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition"
                            title="Tahrirlash"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => deleteTeacher(teacher.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                            title="O'chirish"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTeachers.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">Hech qanday o'qituvchi topilmadi</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <TeacherModal
          teacher={editTeacher}
          onClose={() => {
            setEditTeacher(null);
            setShowModal(false);
          }}
          onSave={editTeacher ? saveEdit : addTeacher}
        />
      )}
    </div>
  );
}