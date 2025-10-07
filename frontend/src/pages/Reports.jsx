import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";

// Skeleton loader komponenti
function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
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

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Expenses skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [expenses, setExpenses] = useState({
    rent: 0,
    tax: 0,
    utilities: 0,
    other: 0
  });

  // Oylik ma'lumotlar
  const [monthlyData, setMonthlyData] = useState({
    studentPayments: 0,
    teacherSalaries: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0
  });

  // Oylik daromadlar tarixi
  const [revenueHistory, setRevenueHistory] = useState([]);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulyatsiya qilingan ma'lumotlar
        const simulatedData = {
          studentPayments: 24500000,
          teacherSalaries: 1800000,
          totalRevenue: 24500000,
          expenses: {
            rent: 5000000,
            tax: 1500000,
            utilities: 800000,
            other: 1200000
          }
        };

        // Xarajatlarni hisoblash
        const totalExpenses = 
          simulatedData.teacherSalaries + 
          simulatedData.expenses.rent + 
          simulatedData.expenses.tax + 
          simulatedData.expenses.utilities + 
          simulatedData.expenses.other;

        const netProfit = simulatedData.totalRevenue - totalExpenses;

        setMonthlyData({
          studentPayments: simulatedData.studentPayments,
          teacherSalaries: simulatedData.teacherSalaries,
          totalRevenue: simulatedData.totalRevenue,
          totalExpenses: totalExpenses,
          netProfit: netProfit
        });

        setExpenses(simulatedData.expenses);

        // Oylik daromadlar tarixi
        const history = [
          { month: '2024-01', revenue: 22000000, profit: 3200000 },
          { month: '2024-02', revenue: 23500000, profit: 3800000 },
          { month: '2024-03', revenue: 24500000, profit: 4200000 },
          { month: '2024-04', revenue: 22800000, profit: 3500000 },
          { month: '2024-05', revenue: 26000000, profit: 4800000 },
          { month: '2024-06', revenue: 24500000, profit: 4200000 },
        ];
        setRevenueHistory(history);

      } catch (error) {
        console.error("Hisobot ma'lumotlarini yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [selectedMonth]);

  // Xarajatlarni yangilash
  const handleExpenseChange = (category, value) => {
    const numericValue = parseFloat(value) || 0;
    setExpenses(prev => ({
      ...prev,
      [category]: numericValue
    }));
  };

  // Sof foydani hisoblash
  useEffect(() => {
    const totalExpenses = 
      monthlyData.teacherSalaries + 
      expenses.rent + 
      expenses.tax + 
      expenses.utilities + 
      expenses.other;

    const netProfit = monthlyData.totalRevenue - totalExpenses;

    setMonthlyData(prev => ({
      ...prev,
      totalExpenses: totalExpenses,
      netProfit: netProfit
    }));
  }, [expenses, monthlyData.teacherSalaries, monthlyData.totalRevenue]);

  // Excel ga eksport qilish
  const exportToExcel = () => {
    const reportData = [
      ["Moliya Hisoboti", selectedMonth],
      [""],
      ["Daromadlar", "Summa (so'm)"],
      ["O'quvchilardan tushum", monthlyData.studentPayments.toLocaleString()],
      ["Jami Daromad", monthlyData.totalRevenue.toLocaleString()],
      [""],
      ["Xarajatlar", "Summa (so'm)"],
      ["O'qituvchilar maoshi", monthlyData.teacherSalaries.toLocaleString()],
      ["Arenda", expenses.rent.toLocaleString()],
      ["Soliq", expenses.tax.toLocaleString()],
      ["Kommunal", expenses.utilities.toLocaleString()],
      ["Boshqa xarajatlar", expenses.other.toLocaleString()],
      ["Jami Xarajatlar", monthlyData.totalExpenses.toLocaleString()],
      [""],
      ["Sof Foyda", monthlyData.netProfit.toLocaleString()]
    ];

    const ws = XLSX.utils.aoa_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hisobot");
    XLSX.writeFile(wb, `moliya-hisoboti-${selectedMonth}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <ReportsSkeleton />
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Moliya Hisobotlari</h1>
              <p className="text-gray-600">Oylik daromad, xarajatlar va sof foyda tahlili</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <input
                type="month"
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
              <button 
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition transform hover:scale-105"
              >
                <i className="fas fa-file-excel"></i>
                Excel ga Export
              </button>
            </div>
          </div>

          {/* Asosiy Statistika */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Jami Daromad</p>
                  <h2 className="text-3xl font-bold">{monthlyData.totalRevenue.toLocaleString()} so'm</h2>
                </div>
                <i className="fas fa-money-bill-wave text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Jami Xarajatlar</p>
                  <h2 className="text-3xl font-bold">{monthlyData.totalExpenses.toLocaleString()} so'm</h2>
                </div>
                <i className="fas fa-receipt text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Sof Foyda</p>
                  <h2 className="text-3xl font-bold">{monthlyData.netProfit.toLocaleString()} so'm</h2>
                </div>
                <i className="fas fa-chart-line text-2xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Foyda Darajasi</p>
                  <h2 className="text-3xl font-bold">
                    {monthlyData.totalRevenue > 0 
                      ? ((monthlyData.netProfit / monthlyData.totalRevenue) * 100).toFixed(1) 
                      : 0}%
                  </h2>
                </div>
                <i className="fas fa-percentage text-2xl opacity-80"></i>
              </div>
            </div>
          </div>

          {/* Charts va Diagrammalar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Daromad va Xarajatlar Taqsimoti */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-6">Daromad va Xarajatlar Taqsimoti</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">O'quvchilardan daromad</span>
                    <span className="text-sm font-bold">{monthlyData.studentPayments.toLocaleString()} so'm</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">O'qituvchilar maoshi</span>
                    <span className="text-sm font-bold">{monthlyData.teacherSalaries.toLocaleString()} so'm</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: `${(monthlyData.teacherSalaries / monthlyData.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Boshqa xarajatlar</span>
                    <span className="text-sm font-bold">
                      {(expenses.rent + expenses.tax + expenses.utilities + expenses.other).toLocaleString()} so'm
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full"
                      style={{ width: `${((expenses.rent + expenses.tax + expenses.utilities + expenses.other) / monthlyData.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Oylik Daromad Tarixi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-6">Oylik Daromad Tarixi</h3>
              <div className="space-y-4">
                {revenueHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        {new Date(item.month + '-01').toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-500">Sof foyda: {item.profit.toLocaleString()} so'm</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{item.revenue.toLocaleString()} so'm</p>
                      <p className={`text-sm ${item.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {((item.profit / item.revenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Xarajatlarni Boshqarish */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Xarajatlar Formasi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-6">Xarajatlarni Kiritish</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arenda
                  </label>
                  <input
                    type="number"
                    value={expenses.rent}
                    onChange={(e) => handleExpenseChange('rent', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Arenda miqdorini kiriting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soliq
                  </label>
                  <input
                    type="number"
                    value={expenses.tax}
                    onChange={(e) => handleExpenseChange('tax', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Soliq miqdorini kiriting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kommunal Xizmatlar
                  </label>
                  <input
                    type="number"
                    value={expenses.utilities}
                    onChange={(e) => handleExpenseChange('utilities', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kommunal to'lov miqdorini kiriting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boshqa Xarajatlar
                  </label>
                  <input
                    type="number"
                    value={expenses.other}
                    onChange={(e) => handleExpenseChange('other', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Boshqa xarajatlar miqdorini kiriting"
                  />
                </div>
              </div>
            </div>

            {/* Xarajatlar Ko'rinishi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-6">Xarajatlar Tafsiloti</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">O'qituvchilar Maoshi</p>
                    <p className="text-sm text-blue-600">Asosiy xarajat</p>
                  </div>
                  <span className="font-bold text-blue-800">{monthlyData.teacherSalaries.toLocaleString()} so'm</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">Arenda</p>
                    <p className="text-sm text-purple-600">Binoga</p>
                  </div>
                  <span className="font-bold text-purple-800">{expenses.rent.toLocaleString()} so'm</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-800">Soliq</p>
                    <p className="text-sm text-orange-600">Davlat solig'i</p>
                  </div>
                  <span className="font-bold text-orange-800">{expenses.tax.toLocaleString()} so'm</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Kommunal</p>
                    <p className="text-sm text-green-600">Elektr, suv, gaz</p>
                  </div>
                  <span className="font-bold text-green-800">{expenses.utilities.toLocaleString()} so'm</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Boshqa Xarajatlar</p>
                    <p className="text-sm text-gray-600">Qo'shimcha</p>
                  </div>
                  <span className="font-bold text-gray-800">{expenses.other.toLocaleString()} so'm</span>
                </div>

                {/* Sof Foyda */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white mt-4">
                  <div>
                    <p className="font-medium">Sof Foyda</p>
                    <p className="text-sm opacity-90">Daromad - Xarajatlar</p>
                  </div>
                  <span className="font-bold text-2xl">{monthlyData.netProfit.toLocaleString()} so'm</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}