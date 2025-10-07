import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LoadingSpinner, { StudentsSkeleton } from '../components/LoadingSpinner';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsContent, setSmsContent] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Yangi o'quvchi formasi uchun state
  const [newStudent, setNewStudent] = useState({
    name: '',
    group: 'Frontend 101',
    phone: '+998',
    status: 'active',
    payment: 'unpaid'
  });

  const API_URL = "http://localhost:5000/students";

  // 🔹 Ma'lumotlarni olish
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      
      if (!res.ok) {
        throw new Error(`Serverdan javob kelmadi: ${res.status}`);
      }
      
      const data = await res.json();
      setStudents(data || []);
      
      // Statistika hisoblash
      setStats({
        total: data.length,
        active: data.filter(s => s.status === "active").length,
        pendingPayment: data.filter(s => s.payment === "unpaid").length,
        newThisMonth: data.filter(s => {
          const now = new Date();
          const created = new Date(s.id);
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length
      });
      
    } catch (err) {
      console.error("Ma'lumotlarni olishda xatolik:", err);
      // Backend ishlamasa ham bo'sh ma'lumotlar bilan ishlash
      setStudents([]);
      setStats({
        total: 0,
        active: 0,
        pendingPayment: 0,
        newThisMonth: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // 🔹 Realtime search & filter
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      let filtered = students;

      if (searchTerm) {
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedGroup) {
        filtered = filtered.filter(s => s.group === selectedGroup);
      }
      if (selectedStatus) {
        filtered = filtered.filter(s => s.status === selectedStatus);
      }
      if (selectedPayment) {
        filtered = filtered.filter(s => s.payment === selectedPayment);
      }

      setFilteredStudents(filtered);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedGroup, selectedStatus, selectedPayment, students]);

  // 🔹 Select all
  useEffect(() => {
    if (selectAll) {
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  }, [selectAll, filteredStudents]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedGroup('');
    setSelectedStatus('');
    setSelectedPayment('');
    setFilteredStudents(students);
  };

  // 🔹 O'chirish
  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`${name} o'quvchisini o'chirishni istaysizmi?`)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error('Oʻchirish amalga oshirilmadi');
        }
        loadStudents();
      } catch (err) {
        alert("O'chirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      }
    }
  };

  // 🔹 To'lovni yangilash
  const handlePaymentChange = async (studentId, newPaymentStatus) => {
    setUpdatingPayment(studentId);
    try {
      const response = await fetch(`${API_URL}/${studentId}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment: newPaymentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Toʻlov holati yangilanmadi');
      }
      
      loadStudents();
    } catch (err) {
      alert("To'lov holatini yangilashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setUpdatingPayment(null);
    }
  };

  // 🔹 Yangi o'quvchi qo'shish
  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    if (!newStudent.name.trim()) {
      alert("Iltimos, o'quvchi ismini kiriting");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStudent,
          id: Date.now()
        })
      });
      
      if (!response.ok) {
        throw new Error('Oʻquvchi qoʻshilmadi');
      }
      
      loadStudents();
      setShowAddModal(false);
      setNewStudent({
        name: '',
        group: 'Frontend 101',
        phone: '+998',
        status: 'active',
        payment: 'unpaid'
      });
    } catch (err) {
      alert("O'quvchini qo'shishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  };

  // 🔹 O'quvchini tahrirlash
  const handleEditStudent = async (e) => {
    e.preventDefault();
    
    if (!editingStudent.name.trim()) {
      alert("Iltimos, o'quvchi ismini kiriting");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingStudent)
      });
      
      if (!response.ok) {
        throw new Error('Oʻquvchi maʼlumotlari yangilanmadi');
      }
      
      loadStudents();
      setShowEditModal(false);
      setEditingStudent(null);
    } catch (err) {
      alert("O'quvchini tahrirlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  };

  // 🔹 Tahrirlash modali ochish
  const openEditModal = (student) => {
    setEditingStudent({...student});
    setShowEditModal(true);
  };

  // 🔹 SMS yuborish
  const handleSendSms = async () => {
    if (selectedStudents.length === 0) {
      alert("Iltimos, kamida bitta o'quvchi tanlang");
      return;
    }
    if (!smsContent.trim()) {
      alert("Iltimos, SMS matnini kiriting");
      return;
    }

    console.log("SMS yuborilmoqda:", {
      students: selectedStudents,
      message: smsContent
    });
    alert(`${selectedStudents.length} ta o'quvchiga SMS yuborildi!`);
    setShowSmsModal(false);
    setSmsContent('');
    setSelectedStudents([]);
    setSelectAll(false);
  };

  // 🔹 Badges
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "active") return `${baseClasses} bg-green-100 text-green-800`;
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  const getPaymentBadge = (payment) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (payment === "paid") return `${baseClasses} bg-green-100 text-green-800`;
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">O'quvchilar</h1>
              <p className="text-gray-600">Barcha o'quvchilar ro'yxati</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSmsModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
              >
                <i className="fas fa-sms"></i>
                SMS Yuborish
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
              >
                <i className="fas fa-plus"></i>
                Yangi o'quvchi
              </button>
            </div>
          </div>

          {/* Stats */}
          {loading && !stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-100">Jami o'quvchilar</p>
                    <h3 className="text-2xl font-bold">{stats?.total || 0}</h3>
                  </div>
                  <i className="fas fa-users text-2xl opacity-80"></i>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-100">Faol o'quvchilar</p>
                    <h3 className="text-2xl font-bold">{stats?.active || 0}</h3>
                  </div>
                  <i className="fas fa-user-check text-2xl opacity-80"></i>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-100">To'lov kutilmoqda</p>
                    <h3 className="text-2xl font-bold">{stats?.pendingPayment || 0}</h3>
                  </div>
                  <i className="fas fa-clock text-2xl opacity-80"></i>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-orange-100">Yangi o'quvchilar</p>
                    <h3 className="text-2xl font-bold">{stats?.newThisMonth || 0}</h3>
                  </div>
                  <i className="fas fa-user-plus text-2xl opacity-80"></i>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-col md:flex-row gap-6 flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="O'quvchi ismi bo'yicha qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Barcha guruhlar</option>
                  <option value="Frontend 101">Frontend 101</option>
                  <option value="Backend 202">Backend 202</option>
                  <option value="Design 101">Design 101</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Barcha holatlar</option>
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>
                <select
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Barcha to'lovlar</option>
                  <option value="paid">To'langan</option>
                  <option value="unpaid">To'lanmagan</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          {loading ? (
            <StudentsSkeleton />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-600">
                    {students.length === 0 ? "Hozircha o'quvchilar mavjud emas" : "O'quvchilar topilmadi"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {students.length === 0 
                      ? "Yangi o'quvchi qo'shish uchun pastdagi tugmani bosing"
                      : "Filtr shartlariga mos o'quvchilar mavjud emas"
                    }
                  </p>
                  {(searchTerm || selectedGroup || selectedStatus || selectedPayment) && students.length > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Filtrlarni tozalash
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={(e) => setSelectAll(e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ism Familiya</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guruh</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holati</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To'lov holati</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student.id)}
                                onChange={() => {
                                  setSelectedStudents(prev =>
                                    prev.includes(student.id)
                                      ? prev.filter(id => id !== student.id)
                                      : [...prev, student.id]
                                  );
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">#{student.id}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{student.group}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{student.phone}</td>
                            <td className="px-6 py-4">
                              <span className={getStatusBadge(student.status)}>
                                {student.status === 'active' ? 'Faol' : 'Nofaol'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={getPaymentBadge(student.payment)}>
                                  {student.payment === 'paid' ? "To'langan" : "To'lanmagan"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex space-x-3">
                                <button 
                                  onClick={() => openEditModal(student)}
                                  className="text-blue-600 hover:text-blue-900 transition duration-150 p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                                  title="Tahrirlash"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student.id, student.name)}
                                  className="text-red-600 hover:text-red-900 transition duration-150 p-2 rounded-lg bg-red-50 hover:bg-red-100"
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
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Yangi O'quvchi Qo'shish Modali */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Yangi O'quvchi Qo'shish</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleAddStudent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ism Familiya *
                    </label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      placeholder="O'quvchi ismi va familiyasini kiriting"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guruh
                    </label>
                    <select
                      value={newStudent.group}
                      onChange={(e) => setNewStudent({...newStudent, group: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Frontend 101">Frontend 101</option>
                      <option value="Backend 202">Backend 202</option>
                      <option value="Design 101">Design 101</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Raqam
                    </label>
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      placeholder="+998901234567"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Holati
                      </label>
                      <select
                        value={newStudent.status}
                        onChange={(e) => setNewStudent({...newStudent, status: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Faol</option>
                        <option value="inactive">Nofaol</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To'lov holati
                      </label>
                      <select
                        value={newStudent.payment}
                        onChange={(e) => setNewStudent({...newStudent, payment: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="paid">To'langan</option>
                        <option value="unpaid">To'lanmagan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    Qo'shish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* O'quvchini Tahrirlash Modali */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">O'quvchini Tahrirlash</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleEditStudent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ism Familiya *
                    </label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guruh
                    </label>
                    <select
                      value={editingStudent.group}
                      onChange={(e) => setEditingStudent({...editingStudent, group: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Frontend 101">Frontend 101</option>
                      <option value="Backend 202">Backend 202</option>
                      <option value="Design 101">Design 101</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Raqam
                    </label>
                    <input
                      type="tel"
                      value={editingStudent.phone}
                      onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Holati
                      </label>
                      <select
                        value={editingStudent.status}
                        onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Faol</option>
                        <option value="inactive">Nofaol</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To'lov holati
                      </label>
                      <select
                        value={editingStudent.payment}
                        onChange={(e) => setEditingStudent({...editingStudent, payment: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="paid">To'langan</option>
                        <option value="unpaid">To'lanmagan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <i className="fas fa-save"></i>
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">O'quvchilarga SMS Yuborish</h3>
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanlangan o'quvchilar: {selectedStudents.length} ta
                </label>
                <textarea
                  value={smsContent}
                  onChange={(e) => setSmsContent(e.target.value)}
                  placeholder="SMS matnini kiriting..."
                  rows="4"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSendSms}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <i className="fas fa-paper-plane"></i>
                  SMS Yuborish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}