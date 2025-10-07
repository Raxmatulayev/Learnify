import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

// Dashboard uchun skeleton loader komponenti
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>

      {/* Stats Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl p-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="bg-gray-300 bg-opacity-50 p-3 rounded-xl">
                <div className="w-8 h-8 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="h-7 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            {i === 1 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-gray-300 h-2 rounded-full w-1/2"></div>
              </div>
            )}
            {i === 2 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="bg-gray-200 h-6 rounded w-16"></div>
                <div className="bg-gray-200 h-6 rounded w-16"></div>
                <div className="bg-gray-200 h-6 rounded w-16"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity and Quick Actions skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full mt-1"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-xl text-center">
                <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const dashboardData = {
          stats: {
            students: 245,
            teachers: 18,
            groups: 24,
            paymentRate: 85,
            revenue: 12500000,
            attendance: 92
          },
          recentActivity: [
            { id: 1, name: "Ali Valiyev", action: "Yangi ro'yxatdan o'tdi", time: "5 min oldin", type: "success" },
            { id: 2, name: "Dilnoza Xolmatova", action: "To'lov qildi", time: "12 min oldin", type: "payment" },
            { id: 3, name: "Sardor Qodirov", action: "Guruh almashtirdi", time: "1 soat oldin", type: "warning" },
            { id: 4, name: "Madina Yusupova", action: "Darsga qatnashmadi", time: "2 soat oldin", type: "error" },
            { id: 5, name: "Javohir Toshmatov", action: "Mashg'ulot qo'shildi", time: "3 soat oldin", type: "info" }
          ]
        };
        
        setStats(dashboardData.stats);
        setRecentActivity(dashboardData.recentActivity);
      } catch (error) {
        console.error('Ma\'lumotlarni yuklashda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-user-plus text-green-500';
      case 'payment':
        return 'fas fa-credit-card text-blue-500';
      case 'warning':
        return 'fas fa-exchange-alt text-yellow-500';
      case 'error':
        return 'fas fa-user-times text-red-500';
      case 'info':
        return 'fas fa-calendar-plus text-purple-500';
      default:
        return 'fas fa-info-circle text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">
            <DashboardSkeleton />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">O'quv markazi boshqaruvi va monitoringi</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* O'quvchilar */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">O'quvchilar</p>
                  <h2 className="text-3xl font-bold mb-2">{stats?.students}</h2>
                  <div className="flex items-center text-blue-100 text-sm">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>12% o'sish</span>
                  </div>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                  <i className="fas fa-users text-2xl"></i>
                </div>
              </div>
            </div>

            {/* O'qituvchilar */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">O'qituvchilar</p>
                  <h2 className="text-3xl font-bold mb-2">{stats?.teachers}</h2>
                  <div className="flex items-center text-green-100 text-sm">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>2 yangi</span>
                  </div>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                  <i className="fas fa-chalkboard-teacher text-2xl"></i>
                </div>
              </div>
            </div>

            {/* Guruhlar */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Guruhlar</p>
                  <h2 className="text-3xl font-bold mb-2">{stats?.groups}</h2>
                  <div className="flex items-center text-purple-100 text-sm">
                    <i className="fas fa-circle mr-1 text-xs"></i>
                    <span>8 ta faol</span>
                  </div>
                </div>
                <div className="bg-purple-400 bg-opacity-30 p-3 rounded-xl">
                  <i className="fas fa-layer-group text-2xl"></i>
                </div>
              </div>
            </div>

            {/* To'lovlar */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">To'lovlar</p>
                  <h2 className="text-3xl font-bold mb-2">{stats?.paymentRate}%</h2>
                  <div className="flex items-center text-orange-100 text-sm">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>5% yaxshilandi</span>
                  </div>
                </div>
                <div className="bg-orange-400 bg-opacity-30 p-3 rounded-xl">
                  <i className="fas fa-credit-card text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Daromad */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Oylik Daromad</h3>
                <i className="fas fa-chart-line text-blue-500"></i>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stats?.revenue ? new Intl.NumberFormat('uz-UZ').format(stats.revenue) : '0'} UZS
              </div>
              <div className="flex items-center text-green-500 text-sm mt-2">
                <i className="fas fa-arrow-up mr-1"></i>
                <span>18% o'tgan oydan ko'p</span>
              </div>
            </div>

            {/* Davomat */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">O'rtacha Davomat</h3>
                <i className="fas fa-calendar-check text-green-500"></i>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.attendance}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats?.attendance}%` }}
                ></div>
              </div>
            </div>

            {/* Kurslar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Faol Kurslar</h3>
                <i className="fas fa-book-open text-purple-500"></i>
              </div>
              <div className="text-2xl font-bold text-gray-800">6</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Frontend</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Backend</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Design</span>
              </div>
            </div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* So'nggi Faoliyat */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">So'nggi Faoliyat</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Barchasini ko'rish
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                    <div className="flex-shrink-0">
                      <i className={`${getActivityIcon(activity.type)} text-lg mt-1`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.action}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tezkor Amallar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Tezkor Amallar</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl text-center transition duration-200 transform hover:scale-105">
                  <i className="fas fa-user-plus text-2xl mb-2"></i>
                  <p className="font-medium">Yangi O'quvchi</p>
                </button>
                <button className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-xl text-center transition duration-200 transform hover:scale-105">
                  <i className="fas fa-chalkboard-teacher text-2xl mb-2"></i>
                  <p className="font-medium">Yangi O'qituvchi</p>
                </button>
                <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-xl text-center transition duration-200 transform hover:scale-105">
                  <i className="fas fa-layer-group text-2xl mb-2"></i>
                  <p className="font-medium">Yangi Guruh</p>
                </button>
                <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-xl text-center transition duration-200 transform hover:scale-105">
                  <i className="fas fa-file-invoice-dollar text-2xl mb-2"></i>
                  <p className="font-medium">To'lov Qabuli</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}