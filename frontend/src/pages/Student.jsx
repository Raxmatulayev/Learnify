import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_BASE, API_ENDPOINTS } from "../config/api";

export default function Student() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    completedTasks: 0,
    upcomingClasses: 0,
    averageScore: 0
  });
  const [myGroups, setMyGroups] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const [groupsRes, studentsRes, tasksRes] = await Promise.all([
        fetch(`${API_BASE}/groups`),
        fetch(`${API_BASE}/students`),
        fetch(`${API_ENDPOINTS.TASKS}`),
      ]);

      if (groupsRes.ok && studentsRes.ok) {
        const allGroups = await groupsRes.json();
        const allStudents = await studentsRes.json();
        const allTasks = tasksRes.ok ? await tasksRes.json() : [];

        // O'quvchining ma'lumotlarini topish
        const student = allStudents.find((s) => s.id === user.id);
        if (!student) {
          setLoading(false);
          return;
        }

        // O'quvchining guruhlarini topish
        const studentGroups = allGroups.filter(
          (group) => group.id === student.groupId
        );

        // Har bir guruh uchun vazifalarni topish
        const studentTasks = allTasks.filter(
          (task) => task.groupId === student.groupId
        );

        // Progress hisoblash (bajarilgan vazifalar / jami vazifalar)
        const completedTasks = studentTasks.filter(
          (t) => t.status === "completed"
        ).length;
        const progress =
          studentTasks.length > 0
            ? Math.round((completedTasks / studentTasks.length) * 100)
            : 0;

        const groupsWithProgress = studentGroups.map((group) => ({
          ...group,
          progress: progress,
        }));

        setMyGroups(groupsWithProgress);
        setTasks(studentTasks);

        // Statistikani hisoblash
        setStats({
          totalClasses: studentGroups.length,
          completedTasks: completedTasks,
          upcomingClasses: studentGroups.length,
          averageScore: 4.5, // Keyinchalik backend dan keladi
        });

        // Dars jadvali - guruhlar bo'yicha
        const scheduleData = studentGroups.flatMap((group) => {
          if (group.schedule && group.startTime && group.endTime) {
            const days = group.schedule.split(" ");
            return days.map((day, index) => ({
              id: `${group.id}-${index}`,
              day: day,
              time: `${group.startTime} - ${group.endTime}`,
              subject: group.name,
              teacher: group.teacherName || "Noma'lum",
            }));
          }
          return [];
        });
        setSchedule(scheduleData);

        // So'nggi faoliyat
        const activity = [
          {
            id: 1,
            type: "task",
            message: `${completedTasks} ta vazifa bajarildi`,
            time: "Hozir",
            icon: "fa-check-circle",
          },
          {
            id: 2,
            type: "class",
            message: `${studentGroups.length} ta guruh`,
            time: "Hozir",
            icon: "fa-calendar-check",
          },
          {
            id: 3,
            type: "score",
            message: `${studentTasks.length} ta vazifa`,
            time: "Hozir",
            icon: "fa-star",
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Yakunlangan";
      case "in-progress":
        return "Jarayonda";
      case "pending":
        return "Kutilmoqda";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
        <Sidebar />
        <div className="flex-1 md:ml-64 ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <Sidebar />
      <div className="flex-1 md:ml-64 ml-0 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Mobile Hero Section - Rasmdagi ko'rinish */}
          <div className="mb-8 md:mb-12 bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl p-6 md:p-8 md:hidden">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              O'QING VA O'RGANING
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                O'Z USULINGIZ BILAN
              </span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
              Bizning keng qamrovli o'quv platformamiz orqali o'z bilimingizni oshiring, vazifalarni bajaring va natijalarni kuzating. Har bir o'quvchi uchun individual yondashuv.
            </p>
            <button className="w-full bg-black text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Darslarni Ko'rish
            </button>
          </div>

          {/* Desktop Welcome Section */}
          <div className="mb-8 hidden md:block">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              Xush kelibsiz, {user?.name || user?.username}!
            </h2>
            <p className="text-gray-600">O'quvchi boshqaruv paneliga xush kelibsiz</p>
          </div>

        {/* Stats Grid - Mobile uchun vertikal, Desktop uchun gorizontal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Mobile Stats - Rasmdagi ko'rinish */}
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg md:hidden">
            <h2 className="text-5xl font-bold text-gray-900 mb-2">{stats.totalClasses}+</h2>
            <p className="text-gray-600 text-sm">Guruhlar</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg md:hidden">
            <h2 className="text-5xl font-bold text-gray-900 mb-2">{stats.completedTasks}+</h2>
            <p className="text-gray-600 text-sm">Bajarilgan Vazifalar</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg md:hidden">
            <h2 className="text-5xl font-bold text-gray-900 mb-2">{stats.upcomingClasses}+</h2>
            <p className="text-gray-600 text-sm">Yaqin Darslar</p>
          </div>

          {/* Desktop Stats */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform hidden md:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Guruhlar</p>
                <h2 className="text-3xl font-bold mt-2">{stats.totalClasses}</h2>
              </div>
              <i className="fas fa-layer-group text-3xl opacity-80"></i>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform hidden md:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Bajarilgan Vazifalar</p>
                <h2 className="text-3xl font-bold mt-2">{stats.completedTasks}</h2>
              </div>
              <i className="fas fa-check-circle text-3xl opacity-80"></i>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform hidden md:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Yaqin Darslar</p>
                <h2 className="text-3xl font-bold mt-2">{stats.upcomingClasses}</h2>
              </div>
              <i className="fas fa-calendar-alt text-3xl opacity-80"></i>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform hidden md:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">O'rtacha Baho</p>
                <h2 className="text-3xl font-bold mt-2">{stats.averageScore}</h2>
              </div>
              <i className="fas fa-star text-3xl opacity-80"></i>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Mening Guruhlarim */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Mening Guruhlarim</h3>
            </div>
            <div className="space-y-4">
              {myGroups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center shadow-lg">
                      <i className="fas fa-layer-group text-white text-xl"></i>
                    </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{group.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">
                            <i className="fas fa-clock mr-1"></i>
                            {group.nextClass}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Progress</span>
                            <span className="text-xs font-medium text-gray-800">{group.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full transition-all"
                              style={{ width: `${group.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
                      Batafsil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* So'nggi Faoliyat */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">So'nggi Faoliyat</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg hover:from-orange-50 hover:to-yellow-50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
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

        {/* Vazifalar va Jadval */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          {/* Vazifalar */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Vazifalar</h3>
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description || "Tavsif yo'q"}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            <i className="fas fa-layer-group mr-1"></i>
                            {task.groupName}
                          </span>
                          <span className="text-xs text-gray-500">
                            <i className="fas fa-calendar mr-1"></i>
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-clipboard-list text-4xl mb-2 opacity-50"></i>
                  <p>Hozircha vazifalar mavjud emas</p>
                </div>
              )}
            </div>
          </div>

          {/* Dars Jadvali */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Dars Jadvali</h3>
            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.subject}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{item.day}</p>
                      <p className="text-xs text-gray-600">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Quick Actions */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Tezkor Amallar</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-orange-100 flex flex-col items-center justify-center">
                <i className="fas fa-book text-2xl mb-2"></i>
                <p className="text-sm font-medium">Darslar</p>
              </button>
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-blue-100 flex flex-col items-center justify-center">
                <i className="fas fa-tasks text-2xl mb-2"></i>
                <p className="text-sm font-medium">Vazifalar</p>
              </button>
              <button className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-green-100 flex flex-col items-center justify-center">
                <i className="fas fa-chart-line text-2xl mb-2"></i>
                <p className="text-sm font-medium">Natijalar</p>
              </button>
              <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 border border-purple-100 flex flex-col items-center justify-center">
                <i className="fas fa-calendar-alt text-2xl mb-2"></i>
                <p className="text-sm font-medium">Jadval</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
