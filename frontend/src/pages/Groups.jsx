import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [detailedGroup, setDetailedGroup] = useState(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    teacherId: "",
    startDate: "",
    schedule: "",
    startTime: "",
    endTime: "",
    capacity: 20,
    status: "upcoming",
    studentIds: []
  });
  const [selectedStudent, setSelectedStudent] = useState("");

  // API orqali ma'lumotlarni olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [groupsRes, studentsRes, teachersRes] = await Promise.all([
          fetch("http://localhost:5000/groups"),
          fetch("http://localhost:5000/students"),
          fetch("http://localhost:5000/teachers")
        ]);

        if (!groupsRes.ok) throw new Error("Guruhlarni yuklab bo'lmadi");
        if (!studentsRes.ok) throw new Error("O'quvchilarni yuklab bo'lmadi");
        if (!teachersRes.ok) throw new Error("O'qituvchilarni yuklab bo'lmadi");

        const groupsData = await groupsRes.json();
        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();

        setGroups(groupsData || []);
        setStudents(studentsData || []);
        setTeachers(teachersData || []);
      }  finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Yangi guruh yaratish
  const handleCreateGroup = async () => {
    try {
      const response = await fetch("http://localhost:5000/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroupData),
      });

      if (!response.ok) {
        throw new Error("Guruh yaratishda xatolik yuz berdi");
      }

      const createdGroup = await response.json();
      
      // Yangi guruhni ro'yxatga qo'shish
      setGroups([...groups, createdGroup]);
      
      // Modalni yopish va formani tozalash
      setShowNewGroupModal(false);
      setNewGroupData({
        name: "",
        teacherId: "",
        startDate: "",
        schedule: "",
        startTime: "",
        endTime: "",
        capacity: 20,
        status: "upcoming",
        studentIds: []
      });

      console.log("✅ Yangi guruh muvaffaqiyatli yaratildi:", createdGroup);
      
    } catch (err) {
      console.error("❌ Guruh yaratishda xatolik:", err);
      alert("Backend serverga ulanishda muammo. Guruh yaratish amalga oshirilmadi.");
    }
  };

  // Guruhga student qo'shish
  const handleAddStudentToGroup = async (groupId, studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/groups/${groupId}/add-student`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: parseInt(studentId) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "O'quvchi qo'shishda xatolik yuz berdi");
      }

      const result = await response.json();
      
      // Groups ro'yxatini yangilash
      setGroups(groups.map(group => 
        group.id === groupId ? result.group : group
      ));
      
      // Agar detailedGroup ochiq bo'lsa, uni ham yangilash
      if (detailedGroup && detailedGroup.id === groupId) {
        setDetailedGroup(result.group);
      }

      // Studentlarni yangilash
      const studentsRes = await fetch("http://localhost:5000/students");
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      console.log("✅ O'quvchi muvaffaqiyatli qo'shildi");
      
    } catch (err) {
      console.error("❌ O'quvchi qo'shishda xatolik:", err);
      alert("Backend serverga ulanishda muammo. O'quvchi qo'shish amalga oshirilmadi.");
    }
  };

  // Guruhdan studentni o'chirish
  const handleRemoveStudentFromGroup = async (groupId, studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/groups/${groupId}/remove-student`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: parseInt(studentId) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "O'quvchini o'chirishda xatolik yuz berdi");
      }

      const result = await response.json();
      
      // Groups ro'yxatini yangilash
      setGroups(groups.map(group => 
        group.id === groupId ? result.group : group
      ));
      
      // Agar detailedGroup ochiq bo'lsa, uni ham yangilash
      if (detailedGroup && detailedGroup.id === groupId) {
        setDetailedGroup(result.group);
      }

      // Studentlarni yangilash
      const studentsRes = await fetch("http://localhost:5000/students");
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      console.log("✅ O'quvchi muvaffaqiyatli o'chirildi");
      
    } catch (err) {
      console.error("❌ O'quvchini o'chirishda xatolik:", err);
      alert("Backend serverga ulanishda muammo. O'quvchini o'chirish amalga oshirilmadi.");
    }
  };

  // Filter
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.teacherName && group.teacherName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTeacher =
      !selectedTeacher || group.teacherName === selectedTeacher;
    const matchesStatus =
      !selectedStatus || group.status === selectedStatus;

    return matchesSearch && matchesTeacher && matchesStatus;
  });

  const uniqueTeachers = [...new Set(groups.map((g) => g.teacherName).filter(Boolean))];

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case "active":
        return `${base} bg-green-100 text-green-800 border border-green-200`;
      case "inactive":
        return `${base} bg-red-100 text-red-800 border border-red-200`;
      case "upcoming":
        return `${base} bg-blue-100 text-blue-800 border border-blue-200`;
      default:
        return `${base} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Faol";
      case "inactive":
        return "Nofaol";
      case "upcoming":
        return "Kutilayotgan";
      default:
        return "Noma'lum";
    }
  };

  // Guruh tafsilotlari modal
  const handleViewDetails = async (group) => {
    try {
      const res = await fetch(`http://localhost:5000/groups/${group.id}`, {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Guruh ma'lumotlarini yuklab bo'lmadi");
      }

      const detailed = await res.json();
      console.log("✅ Guruh tafsilotlari:", detailed);
      setDetailedGroup(detailed);
      setShowGroupDetails(true);
      
      // Guruhda bo'lmagan studentlarni topish
      const availableStudents = students.filter(student => 
        !detailed.students?.some(s => s.id === student.id)
      );
      setSelectedStudent("");
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
      // Agar backend ishlamasa, mavjud guruh ma'lumotlarini ko'rsatish
      setDetailedGroup(group);
      setShowGroupDetails(true);
    }
  };

  // Guruhda bo'lmagan studentlarni olish
  const getAvailableStudents = () => {
    if (!detailedGroup) return [];
    return students.filter(student => 
      !detailedGroup.students?.some(s => s.id === student.id)
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Guruhlar yuklanmoqda...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {/* Sarlavha va yangi guruh tugmasi */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Guruhlar</h1>
              <p className="text-gray-600 mt-1">Barcha guruhlarni boshqarish</p>
            </div>
            <button
              onClick={() => setShowNewGroupModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yangi guruh
            </button>
          </div>

          {/* Error banner - agar error bo'lsa lekin dizayn saqlanadi */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <p className="text-yellow-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="ml-3 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Yangilash
                </button>
              </div>
            </div>
          )}

          {/* Filtr paneli */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qidiruv</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Guruh yoki o'qituvchi bo'yicha qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O'qituvchi</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Barcha o'qituvchilar</option>
                  {uniqueTeachers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Holati</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Barcha holatlar</option>
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                  <option value="upcoming">Kutilayotgan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guruhlar ro'yxati */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {groups.length === 0 ? "Ma'lumotlar mavjud emas" : "Guruhlar topilmadi"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {groups.length === 0 
                      ? "Backend serverga ulanishda muammo yoki hozircha guruhlar mavjud emas"
                      : "Filtr shartlariga mos guruhlar mavjud emas"
                    }
                  </p>
                  {groups.length === 0 && (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Qayta yuklash
                      </button>
                      <button
                        onClick={() => setShowNewGroupModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Guruh Yaratish
                      </button>
                    </div>
                  )}
                  {(searchTerm || selectedTeacher || selectedStatus) && groups.length > 0 && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedTeacher("");
                        setSelectedStatus("");
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Filtrlarni tozalash
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="font-bold text-xl text-gray-900">{group.name}</h2>
                      <span className={getStatusBadge(group.status)}>
                        {getStatusText(group.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">O'qituvchi:</span>
                        <span className="text-gray-900">{group.teacherName || "Topilmadi"}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">O'quvchilar:</span>
                        <span className="text-gray-900">{group.studentsCount || 0}/{group.capacity || 0}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Kunlar:</span>
                        <span className="text-gray-900">{group.schedule || "Belgilanmagan"}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Vaqt:</span>
                        <span className="text-gray-900">
                          {group.startTime || "00:00"} - {group.endTime || "00:00"}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewDetails(group)}
                      className="mt-6 w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl font-medium border border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Batafsil ko'rish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Yangi guruh modal */}
          {showNewGroupModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Yangi guruh yaratish</h3>
                  <p className="text-gray-600 mt-1">Guruh ma'lumotlarini to'ldiring</p>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Guruh nomi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guruh nomi</label>
                    <input
                      type="text"
                      placeholder="Guruh nomini kiriting"
                      value={newGroupData.name}
                      onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* O'qituvchi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">O'qituvchi</label>
                    <select
                      value={newGroupData.teacherId}
                      onChange={(e) => setNewGroupData({ ...newGroupData, teacherId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">O'qituvchini tanlang</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Boshlanish sanasi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Boshlanish sanasi</label>
                    <input
                      type="date"
                      value={newGroupData.startDate}
                      onChange={(e) => setNewGroupData({ ...newGroupData, startDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Dars kunlari */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dars kunlari</label>
                    <input
                      type="text"
                      placeholder="Masalan: Dushanba, Chorshanba, Juma"
                      value={newGroupData.schedule}
                      onChange={(e) => setNewGroupData({ ...newGroupData, schedule: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Vaqt oralig'i */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Boshlanish vaqti</label>
                      <input
                        type="time"
                        value={newGroupData.startTime}
                        onChange={(e) => setNewGroupData({ ...newGroupData, startTime: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tugash vaqti</label>
                      <input
                        type="time"
                        value={newGroupData.endTime}
                        onChange={(e) => setNewGroupData({ ...newGroupData, endTime: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Guruh sig'imi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guruh sig'imi</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Maksimal o'quvchilar soni"
                      value={newGroupData.capacity}
                      onChange={(e) => setNewGroupData({ ...newGroupData, capacity: parseInt(e.target.value) || 20 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Guruh holati */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guruh holati</label>
                    <select
                      value={newGroupData.status}
                      onChange={(e) => setNewGroupData({ ...newGroupData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="upcoming">Kutilayotgan</option>
                      <option value="active">Faol</option>
                      <option value="inactive">Nofaol</option>
                    </select>
                  </div>

                  {/* Studentlar (multi-select) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">O'quvchilar (bir nechtasini tanlash uchun Ctrl yoki Cmd tugmasini bosing)</label>
                    <select
                      multiple
                      value={newGroupData.studentIds}
                      onChange={(e) =>
                        setNewGroupData({
                          ...newGroupData,
                          studentIds: Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value))
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32"
                    >
                      {students.filter(s => !s.groupId).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.surname} - {s.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowNewGroupModal(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    disabled={!newGroupData.name || !newGroupData.teacherId}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Guruh yaratish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Guruh tafsilotlari modal */}
          {showGroupDetails && detailedGroup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{detailedGroup.name}</h3>
                      <p className="text-gray-600 mt-1">Guruh tafsilotlari</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={getStatusBadge(detailedGroup.status)}>
                        {getStatusText(detailedGroup.status)}
                      </span>
                      <button
                        onClick={() => setShowGroupDetails(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O'qituvchi</p>
                          <p className="font-semibold text-gray-900">
                            {detailedGroup.teacher ? detailedGroup.teacher.name : detailedGroup.teacherName || "Topilmadi"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O'quvchilar</p>
                          <p className="font-semibold text-gray-900">
                            {detailedGroup.students?.length || 0} / {detailedGroup.capacity || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dars kunlari</p>
                          <p className="font-semibold text-gray-900">{detailedGroup.schedule || "Belgilanmagan"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dars vaqti</p>
                          <p className="font-semibold text-gray-900">
                            {detailedGroup.startTime || "00:00"} - {detailedGroup.endTime || "00:00"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* O'quvchilar boshqaruvi */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">👥 O'quvchilar ro'yxati</h4>
                      {detailedGroup.students?.length < (detailedGroup.capacity || 0) && (
                        <div className="flex gap-3">
                          <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="">O'quvchi tanlang</option>
                            {getAvailableStudents().map((student) => (
                              <option key={student.id} value={student.id}>
                                {student.name} {student.surname} - {student.phone}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              if (selectedStudent) {
                                handleAddStudentToGroup(detailedGroup.id, selectedStudent);
                                setSelectedStudent("");
                              }
                            }}
                            disabled={!selectedStudent}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Qo'shish
                          </button>
                        </div>
                      )}
                    </div>

                    {detailedGroup.students && detailedGroup.students.length > 0 ? (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="space-y-3">
                          {detailedGroup.students.map((student) => (
                            <div key={student.id} className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                              <div>
                                <p className="font-medium text-gray-900">{student.name} {student.surname}</p>
                                <p className="text-sm text-gray-600">{student.phone}</p>
                                <div className="flex gap-2 mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    student.status === 'active' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {student.status === 'active' ? 'Faol' : 'Nofaol'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    student.payment === 'paid' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {student.payment === 'paid' ? "To'langan" : "To'lanmagan"}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveStudentFromGroup(detailedGroup.id, student.id)}
                                className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                                title="O'quvchini o'chirish"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-600">Guruhda hozircha o'quvchilar yo'q</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowGroupDetails(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}