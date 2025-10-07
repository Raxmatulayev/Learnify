import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

// Skeleton loader komponenti
function PaymentsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-48 animate-pulse"></div>
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

      {/* Filter va chart skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Jadval skeleton */}
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

// Backend ulanmagan holatda ko'rsatiladigan komponent
function NoConnectionView({ onRetry }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">To'lovlar</h1>
          <p className="text-gray-600">Barcha to'lovlar tarixi va statistikasi</p>
        </div>
        <button 
          className="bg-gray-400 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 mt-4 md:mt-0 cursor-not-allowed opacity-50"
          disabled
        >
          <i className="fas fa-plus"></i>
          Yangi To'lov
        </button>
      </div>

      {/* Xato xabari */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <i className="fas fa-unlink text-red-500 text-5xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Serverga ulanmadi</h3>
        <p className="text-red-600 mb-6">
          To'lovlar ma'lumotlarini ko'rish uchun backend serverga ulaning
        </p>
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
        >
          <i className="fas fa-redo"></i>
          Qayta Urinish
        </button>
      </div>

      {/* Stats Grid (faqat dizayn) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 opacity-30">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Jami Daromad</p>
              <h2 className="text-3xl font-bold">0 so'm</h2>
            </div>
            <i className="fas fa-wallet text-2xl opacity-80"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">To'lovlar Soni</p>
              <h2 className="text-3xl font-bold">0</h2>
            </div>
            <i className="fas fa-receipt text-2xl opacity-80"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">O'rtacha To'lov</p>
              <h2 className="text-3xl font-bold">0 so'm</h2>
            </div>
            <i className="fas fa-chart-line text-2xl opacity-80"></i>
          </div>
        </div>
      </div>

      {/* Charts va Diagrammalar (faqat dizayn) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 opacity-30">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Oylik Daromad</h3>
            <span className="text-gray-500">2024 yil</span>
          </div>
          <div className="space-y-4">
            {['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun'].map((month) => (
              <div key={month} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-gray-600 capitalize">
                  {month}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div className="bg-gray-300 h-4 rounded-full w-0"></div>
                  </div>
                </div>
                <div className="w-20 text-right font-semibold text-gray-400">
                  0M
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-6">To'lov Usullari</h3>
          <div className="space-y-4">
            {['click', 'payme', 'cash', 'transfer'].map((method) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="font-medium text-gray-400 capitalize">
                    {method === 'click' ? 'Click' :
                     method === 'payme' ? 'Payme' :
                     method === 'cash' ? 'Naqd' : 'Bank'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">0</span>
                  <span className="text-gray-400 text-sm">(0%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter va Search (faqat dizayn) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6 opacity-30">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="O'quvchi ismi yoki invoice bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
              disabled
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-400"
            disabled
          >
            <option>Barcha to'lov usullari</option>
          </select>

          <input
            type="month"
            className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-400"
            disabled
          />
        </div>
      </div>

      {/* To'lovlar Jadvali (faqat dizayn) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border opacity-30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">To'lovlar Tarixi</h3>
          <span className="text-gray-500">0 ta to'lov</span>
        </div>

        <div className="text-center py-12 text-gray-400">
          <i className="fas fa-database text-4xl mb-4"></i>
          <p>Ma'lumotlar mavjud emas</p>
        </div>
      </div>
    </div>
  );
}

// To'lov qo'shish modal komponenti
function AddPaymentModal({ isOpen, onClose, onPaymentAdded, students, connectionError }) {
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    paymentType: "cash",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amount) {
      alert("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    if (connectionError) {
      alert("Serverga ulanmagan. To'lov qo'shish imkoni mavjud emas.");
      return;
    }

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
        onPaymentAdded();
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
      alert("Serverga ulanmadi. Iltimos, backend serverni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {connectionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Serverga ulanmagan. To'lov qo'shish imkoni mavjud emas.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              O'quvchi <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={connectionError}
            >
              <option value="">O'quvchini tanlang</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To'lov Miqdori (so'm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="To'lov miqdorini kiriting"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={connectionError}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To'lov Sanasi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={connectionError}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To'lov Usuli
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={connectionError}
            >
              <option value="cash">Naqd</option>
              <option value="click">Click</option>
              <option value="payme">Payme</option>
              <option value="transfer">Bank o'tkazmasi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Izoh
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Qo'shimcha izoh..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={connectionError}
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
              disabled={loading || connectionError}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saqlanmoqda..." : "To'lovni Qo'shish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Student ma'lumotlari modal komponenti
function StudentDetailsModal({ isOpen, onClose, student, payments, connectionError }) {
  if (!isOpen || !student) return null;

  const studentPayments = payments.filter(p => p.studentId === student.id);
  const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const lastPayment = studentPayments.length > 0 
    ? studentPayments[studentPayments.length - 1] 
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">O'quvchi Ma'lumotlari</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {connectionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Serverga ulanmagan. Ma'lumotlar yangilanmaydi.
            </div>
          )}

          {/* Asosiy ma'lumotlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Ism Familiya</label>
                <p className="text-lg font-semibold">{student.firstName} {student.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Telefon</label>
                <p className="text-lg">{student.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Guruh</label>
                <p className="text-lg">{student.group || "Guruh belgilanmagan"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Balans</label>
                <p className={`text-2xl font-bold ${
                  (student.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {student.balance ? student.balance.toLocaleString() : 0} so'm
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Jami To'langan</label>
                <p className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} so'm</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Oxirgi To'lov</label>
                <p className="text-lg">
                  {lastPayment 
                    ? `${new Date(lastPayment.paymentDate).toLocaleDateString('uz-UZ')} - ${lastPayment.amount.toLocaleString()} so'm`
                    : "To'lov mavjud emas"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* To'lovlar tarixi */}
          <div>
            <h4 className="text-lg font-semibold mb-4">To'lovlar Tarixi</h4>
            {studentPayments.length > 0 ? (
              <div className="space-y-3">
                {studentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{payment.amount.toLocaleString()} so'm</p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString('uz-UZ')} • 
                        {payment.paymentType === 'cash' ? ' Naqd' :
                         payment.paymentType === 'click' ? ' Click' :
                         payment.paymentType === 'payme' ? ' Payme' : ' Bank'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">#{payment.id}</p>
                      {payment.description && (
                        <p className="text-xs text-gray-400">{payment.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-receipt text-4xl mb-2 opacity-50"></i>
                <p>Hozircha to'lov mavjud emas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      // API dan ma'lumotlarni olish
      const [paymentsRes, studentsRes] = await Promise.all([
        fetch(`${API_BASE}/payments`),
        fetch(`${API_BASE}/students`)
      ]);

      if (!paymentsRes.ok || !studentsRes.ok) {
        throw new Error("Ma'lumotlarni olishda xatolik");
      }

      const paymentsData = await paymentsRes.json();
      const studentsData = await studentsRes.json();

      setPayments(paymentsData);
      setStudents(studentsData);
      setFilteredPayments(paymentsData);
      
    } catch (error) {
      console.error("To'lovlar ma'lumotlarini yuklashda xatolik:", error);
      setConnectionError(true);
      // Backend ulanmasa, bo'sh ma'lumotlar
      setPayments([]);
      setStudents([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.invoiceId && payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(payment => payment.paymentDate.includes(dateFilter));
    }

    // Payment method filter
    if (paymentMethodFilter !== "all") {
      filtered = filtered.filter(payment => payment.paymentType === paymentMethodFilter);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, dateFilter, paymentMethodFilter, payments]);

  const getPaymentMethodBadge = (method) => {
    const styles = {
      click: "bg-blue-100 text-blue-800 border border-blue-200",
      payme: "bg-purple-100 text-purple-800 border border-purple-200",
      cash: "bg-gray-100 text-gray-800 border border-gray-200",
      transfer: "bg-green-100 text-green-800 border border-green-200"
    };
    
    const methodText = {
      click: "Click",
      payme: "Payme",
      cash: "Naqd",
      transfer: "Bank"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[method]}`}>
        {methodText[method]}
      </span>
    );
  };

  // Statistika ma'lumotlari
  const stats = {
    totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
    totalPayments: payments.length,
    averagePayment: payments.length > 0 ? Math.round(payments.reduce((sum, payment) => sum + payment.amount, 0) / payments.length) : 0
  };

  const monthlyStats = {
    yanvar: 4500000,
    fevral: 5200000,
    mart: 4800000,
    aprel: 6100000,
    may: 5800000,
    iyun: 6500000
  };

  const paymentMethods = {
    click: payments.filter(p => p.paymentType === 'click').length,
    payme: payments.filter(p => p.paymentType === 'payme').length,
    cash: payments.filter(p => p.paymentType === 'cash').length,
    transfer: payments.filter(p => p.paymentType === 'transfer').length
  };

  const handleStudentClick = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setShowStudentDetails(true);
    }
  };

  const handlePaymentAdded = () => {
    fetchPaymentsData(); // Yangi to'lov qo'shilgandan so'ng ma'lumotlarni yangilash
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <PaymentsSkeleton />
          </main>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <NoConnectionView onRetry={fetchPaymentsData} />
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">To'lovlar</h1>
              <p className="text-gray-600">Barcha to'lovlar tarixi va statistikasi</p>
            </div>
            <button 
              onClick={() => setShowAddPayment(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition transform hover:scale-105 mt-4 md:mt-0"
            >
              <i className="fas fa-plus"></i>
              Yangi To'lov
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Jami Daromad</p>
                  <h2 className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} so'm</h2>
                </div>
                <i className="fas fa-wallet text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">To'lovlar Soni</p>
                  <h2 className="text-3xl font-bold">{stats.totalPayments}</h2>
                </div>
                <i className="fas fa-receipt text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">O'rtacha To'lov</p>
                  <h2 className="text-3xl font-bold">{stats.averagePayment.toLocaleString()} so'm</h2>
                </div>
                <i className="fas fa-chart-line text-2xl opacity-80"></i>
              </div>
            </div>
          </div>

          {/* Charts va Diagrammalar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Oylik daromad diagrammasi */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Oylik Daromad</h3>
                <span className="text-gray-500">2024 yil</span>
              </div>
              <div className="space-y-4">
                {Object.entries(monthlyStats).map(([month, amount]) => (
                  <div key={month} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-gray-600 capitalize">
                      {month}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full"
                          style={{ width: `${(amount / 7000000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-20 text-right font-semibold">
                      {(amount / 1000000).toFixed(1)}M
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* To'lov usullari diagrammasi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-6">To'lov Usullari</h3>
              <div className="space-y-4">
                {Object.entries(paymentMethods).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        method === 'click' ? 'bg-blue-500' :
                        method === 'payme' ? 'bg-purple-500' :
                        method === 'cash' ? 'bg-gray-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium capitalize">
                        {method === 'click' ? 'Click' :
                         method === 'payme' ? 'Payme' :
                         method === 'cash' ? 'Naqd' : 'Bank'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{count}</span>
                      <span className="text-gray-500 text-sm">
                        ({payments.length > 0 ? Math.round((count / payments.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
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
                  placeholder="O'quvchi ismi yoki invoice bo'yicha qidirish..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                <option value="all">Barcha to'lov usullari</option>
                <option value="click">Click</option>
                <option value="payme">Payme</option>
                <option value="cash">Naqd</option>
                <option value="transfer">Bank</option>
              </select>

              <input
                type="month"
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* To'lovlar Jadvali */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                To'lovlar Tarixi
                {paymentMethodFilter !== 'all' && ` - ${
                  paymentMethodFilter === 'click' ? 'Click' :
                  paymentMethodFilter === 'payme' ? 'Payme' :
                  paymentMethodFilter === 'cash' ? 'Naqd' : 'Bank'
                }`}
              </h3>
              <span className="text-gray-500">{filteredPayments.length} ta to'lov</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 font-medium text-gray-500">Invoice ID</th>
                    <th className="text-left py-4 font-medium text-gray-500">O'quvchi</th>
                    <th className="text-left py-4 font-medium text-gray-500">Miqdor</th>
                    <th className="text-left py-4 font-medium text-gray-500">To'lov Sanasi</th>
                    <th className="text-left py-4 font-medium text-gray-500">To'lov Usuli</th>
                    <th className="text-left py-4 font-medium text-gray-500">Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr 
                      key={payment.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStudentClick(payment.studentId)}
                    >
                      <td className="py-4">
                        <span className="font-mono text-blue-600 font-medium">
                          {payment.invoiceId || `#${payment.id}`}
                        </span>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-800">{payment.studentName}</p>
                          <p className="text-sm text-gray-500">ID: {payment.studentId}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-gray-800">
                          {payment.amount.toLocaleString()} so'm
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-600">
                          {new Date(payment.paymentDate).toLocaleDateString('uz-UZ')}
                        </span>
                      </td>
                      <td className="py-4">
                        {getPaymentMethodBadge(payment.paymentType)}
                      </td>
                      <td className="py-4">
                        <span className="text-gray-500 text-sm">
                          {payment.description || "Izoh mavjud emas"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">Hech qanday to'lov topilmadi</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal oynalar */}
      <AddPaymentModal 
        isOpen={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        onPaymentAdded={handlePaymentAdded}
        students={students}
        connectionError={connectionError}
      />

      <StudentDetailsModal 
        isOpen={showStudentDetails}
        onClose={() => setShowStudentDetails(false)}
        student={selectedStudent}
        payments={payments}
        connectionError={connectionError}
      />
    </div>
  );
}