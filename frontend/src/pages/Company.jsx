import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import { API_BASE, API_ENDPOINTS } from "../config/api";

// Branch Qo'shish Modal
function AddBranchModal({ isOpen, onClose, onSuccess, companyId }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "active",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        status: "active",
        username: "",
        password: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.BRANCHES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          companyId: companyId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Filial muvaffaqiyatli yaratildi!\n\nLogin ma'lumotlari:\nUsername: ${data.user.username}\nParol: ${formData.password}\n\nBu ma'lumotlarni saqlab qo'ying!`
        );
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Branch qo'shishda xatolik");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Yangi Filial Qo'shish</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filial Nomi *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masalan: Asaxiy Chilonzor"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manzil
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Toshkent shahar, Chilonzor tumani..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+998901234567"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="chilonzor@asaxiy.uz"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holati
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <i className="fas fa-key text-blue-500"></i>
                Login Ma'lumotlari *
              </p>
              <div className="space-y-4 bg-blue-50 p-4 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Masalan: asaxiy_chilonzor"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Parol kiriting"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bu login ma'lumotlari filial uchun avtomatik yaratiladi
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 font-medium shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    Saqlanmoqda...
                  </span>
                ) : (
                  "Saqlash"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Branch Edit Modal
function EditBranchModal({ isOpen, onClose, onSuccess, branch }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && branch) {
      setFormData({
        name: branch.name || "",
        address: branch.address || "",
        phone: branch.phone || "",
        email: branch.email || "",
        status: branch.status || "active",
      });
    }
  }, [isOpen, branch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.BRANCHES}/${branch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Branchni yangilashda xatolik");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-green-500 to-teal-600">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Filialni Tahrirlash</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filial Nomi *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manzil
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holati
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 font-medium shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    Saqlanmoqda...
                  </span>
                ) : (
                  "Saqlash"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Branch Detail Modal
function BranchDetailModal({ isOpen, onClose, branch, onEdit, onDelete }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && branch) {
      fetchBranchStats();
    }
  }, [isOpen, branch]);

  const fetchBranchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.BRANCHES}/${branch.id}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Statistikani olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{branch.name}</h3>
              <p className="text-indigo-100 text-sm mt-1">Filial batafsil ma'lumotlari</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="space-y-6">
            {/* Branch Ma'lumotlari */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-500"></i>
                Filial Ma'lumotlari
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Manzil</p>
                  <p className="font-medium text-gray-800">
                    {branch.address || "Kiritilmagan"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Telefon</p>
                  <p className="font-medium text-gray-800">
                    {branch.phone || "Kiritilmagan"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-800">
                    {branch.email || "Kiritilmagan"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Holati</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                      branch.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {branch.status === "active" ? "Faol" : "Nofaol"}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistika */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : stats ? (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-bar text-purple-500"></i>
                  Statistika
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">O'quvchilar</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.students}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">O'qituvchilar</p>
                    <p className="text-2xl font-bold text-green-600">{stats.teachers}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Guruhlar</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.groups}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Daromad</p>
                    <p className="text-lg font-bold text-orange-600">
                      {(stats.totalRevenue / 1000000).toFixed(1)}M so'm
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onEdit(branch);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
              >
                <i className="fas fa-edit mr-2"></i>
                Tahrirlash
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Bu filialni o'chirishni xohlaysizmi?")) {
                    onDelete(branch.id);
                    onClose();
                  }
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg"
              >
                <i className="fas fa-trash mr-2"></i>
                O'chirish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Company() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalRevenue: 0,
    activeBranches: 0,
  });
  const [branches, setBranches] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showBranchDetail, setShowBranchDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    fetchCompanyId();
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  const fetchCompanyId = async () => {
    try {
      // Agar user.companyId bo'lsa, undan foydalanish
      if (user?.companyId) {
        setCompanyId(user.companyId);
        return;
      }

      // Aks holda, user nomi bo'yicha company topish
      const response = await fetch(API_ENDPOINTS.COMPANIES);
      if (response.ok) {
        const companies = await response.json();
        const company = companies.find((c) => c.name === user?.name) || companies[0];
        if (company) {
          setCompanyId(company.id);
        }
      }
    } catch (error) {
      console.error("Company ID ni olishda xatolik:", error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const [branchesRes, studentsRes, teachersRes, groupsRes, paymentsRes] =
        await Promise.all([
          fetch(`${API_ENDPOINTS.BRANCHES}?companyId=${companyId}`),
          fetch(`${API_BASE}/students`),
          fetch(`${API_BASE}/teachers`),
          fetch(`${API_BASE}/groups`),
          fetch(`${API_BASE}/payments`),
        ]);

      if (branchesRes.ok) {
        const branchesData = await branchesRes.json();
        setBranches(branchesData);

        const students = studentsRes.ok ? await studentsRes.json() : [];
        const teachers = teachersRes.ok ? await teachersRes.json() : [];
        const payments = paymentsRes.ok ? await paymentsRes.json() : [];

        const totalStudents = students.length;
        const totalTeachers = teachers.length;
        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats({
          totalBranches: branchesData.length,
          totalStudents: totalStudents,
          totalTeachers: totalTeachers,
          totalRevenue: totalRevenue,
          activeBranches: branchesData.filter((b) => b.status === "active").length,
        });

        // So'nggi faoliyat
        const activity = [
          {
            id: 1,
            type: "branch",
            message: `${branchesData.length} ta filial`,
            time: "Hozir",
            icon: "fa-code-branch",
          },
          {
            id: 2,
            type: "student",
            message: `${totalStudents} ta o'quvchi`,
            time: "Hozir",
            icon: "fa-user-graduate",
          },
          {
            id: 3,
            type: "teacher",
            message: `${totalTeachers} ta o'qituvchi`,
            time: "Hozir",
            icon: "fa-chalkboard-teacher",
          },
        ];
        setRecentActivity(activity);
      }
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSuccess = () => {
    fetchCompanyData();
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setShowBranchDetail(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleDelete = async (branchId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BRANCHES}/${branchId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCompanyData();
        alert("Filial muvaffaqiyatli o'chirildi");
      } else {
        const error = await response.json();
        alert(error.error || "Filialni o'chirishda xatolik");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 ml-0">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Xush kelibsiz, {user?.name || user?.username}!
            </h1>
            <p className="text-gray-600">Company boshqaruv paneliga xush kelibsiz</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Jami Filiallar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.totalBranches}</h2>
                </div>
                <i className="fas fa-code-branch text-3xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Faol Filiallar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.activeBranches}</h2>
                </div>
                <i className="fas fa-check-circle text-3xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">O'quvchilar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.totalStudents}</h2>
                </div>
                <i className="fas fa-user-graduate text-3xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">O'qituvchilar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.totalTeachers}</h2>
                </div>
                <i className="fas fa-chalkboard-teacher text-3xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Daromad</p>
                  <h2 className="text-2xl font-bold mt-2">
                    {(stats.totalRevenue / 1000000).toFixed(1)}M
                  </h2>
                  <p className="text-pink-100 text-xs mt-1">so'm</p>
                </div>
                <i className="fas fa-chart-line text-3xl opacity-80"></i>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filiallar Ro'yxati */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filiallar</h3>
                <button
                  onClick={() => setShowBranchModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg font-medium"
                >
                  <i className="fas fa-plus"></i>
                  Yangi Filial
                </button>
              </div>
              <div className="space-y-4">
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <div
                      key={branch.id}
                      onClick={() => handleBranchClick(branch)}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                              branch.status === "active"
                                ? "bg-gradient-to-br from-green-500 to-green-600"
                                : "bg-gradient-to-br from-gray-400 to-gray-500"
                            }`}
                          >
                            <i className="fas fa-code-branch text-white text-xl"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">{branch.name}</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">
                                <i className="fas fa-user-graduate mr-1 text-blue-500"></i>
                                {branch.studentsCount || 0} o'quvchi
                              </span>
                              <span className="text-sm text-gray-600">
                                <i className="fas fa-chalkboard-teacher mr-1 text-purple-500"></i>
                                {branch.teachersCount || 0} o'qituvchi
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              branch.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {branch.status === "active" ? "Faol" : "Nofaol"}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-code-branch text-4xl mb-2 opacity-50"></i>
                    <p>Hozircha filiallar mavjud emas</p>
                    <button
                      onClick={() => setShowBranchModal(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Birinchi Filialni Qo'shing
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* So'nggi Faoliyat */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">So'nggi Faoliyat</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-blue-50 hover:to-purple-50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <i className={`fas ${activity.icon} text-white`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Branch Qo'shish Modal */}
      <AddBranchModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        onSuccess={handleBranchSuccess}
        companyId={companyId}
      />

      {/* Branch Edit Modal */}
      <EditBranchModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBranch(null);
        }}
        onSuccess={handleBranchSuccess}
        branch={selectedBranch}
      />

      {/* Branch Detail Modal */}
      <BranchDetailModal
        isOpen={showBranchDetail}
        onClose={() => {
          setShowBranchDetail(false);
          setSelectedBranch(null);
        }}
        branch={selectedBranch}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
