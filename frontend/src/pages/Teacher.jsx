import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_BASE, API_ENDPOINTS } from "../config/api";

// Vazifa Qo'shish Modal
function AddTaskModal({ isOpen, onClose, onSuccess, groups, teacherId }) {
  const [formData, setFormData] = useState({
    groupId: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        groupId: "",
        title: "",
        description: "",
        dueDate: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          groupId: parseInt(formData.groupId),
          teacherId: teacherId,
          status: "pending",
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Vazifa qo'shishda xatolik");
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
        <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-pink-600">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Yangi Vazifa Qo'shish</h3>
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
                Guruh *
              </label>
              <select
                required
                value={formData.groupId}
                onChange={(e) =>
                  setFormData({ ...formData, groupId: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                <option value="">Guruh tanlang</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vazifa Nomi *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Masalan: React komponentlari"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tugash Sanasi *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Izoh
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Vazifa haqida qisqacha ma'lumot"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              ></textarea>
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
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 font-medium shadow-lg"
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

// Barcha O'quvchilar Modal
function AllStudentsModal({ isOpen, onClose, students, groups }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-pink-600">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Barcha O'quvchilar</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ism</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefon</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guruh</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Holati</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const group = groups.find((g) => g.id === student.groupId);
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                          {student.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{student.phone}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {group ? group.name : "Guruh yo'q"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {student.status === "active" ? "Faol" : "Nofaol"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-user-graduate text-4xl mb-2 opacity-50"></i>
              <p>Hozircha o'quvchilar mavjud emas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Teacher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGroups: 0,
    upcomingClasses: 0,
    completedClasses: 0,
  });
  const [groups, setGroups] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAllStudentsModal, setShowAllStudentsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchTeacherData();
    }
  }, [user?.id]);

  const fetchTeacherData = async () => {
    try {
      const [groupsRes, studentsRes, tasksRes] = await Promise.all([
        fetch(`${API_BASE}/groups`),
        fetch(`${API_BASE}/students`),
        fetch(`${API_ENDPOINTS.TASKS}`),
      ]);

      if (groupsRes.ok && studentsRes.ok) {
        const allGroups = await groupsRes.json();
        const allStudentsData = await studentsRes.json();
        const allTasks = tasksRes.ok ? await tasksRes.json() : [];

        // O'qituvchining guruhlarini topish (teacherId bo'yicha)
        const teacherGroups = allGroups.filter(
          (group) => group.teacherId === user.id
        );

        // Har bir guruh uchun o'quvchilar sonini hisoblash
        const groupsWithStudents = teacherGroups.map((group) => {
          const groupStudents = allStudentsData.filter(
            (s) => s.groupId === group.id
          );
          return {
            ...group,
            studentsCount: groupStudents.length,
            students: groupStudents,
          };
        });

        setGroups(groupsWithStudents);
        setAllStudents(allStudentsData);

        // O'qituvchining vazifalarini topish
        const teacherTasks = allTasks.filter(
          (task) => task.teacherId === user.id
        );
        setTasks(teacherTasks);

        // Statistikani hisoblash
        const totalStudents = groupsWithStudents.reduce(
          (sum, g) => sum + g.studentsCount,
          0
        );

        setStats({
          totalStudents: totalStudents,
          totalGroups: groupsWithStudents.length,
          upcomingClasses: groupsWithStudents.length,
          completedClasses: teacherTasks.filter((t) => t.status === "completed")
            .length,
        });

        // Dars jadvali - guruhlar bo'yicha
        const scheduleData = groupsWithStudents.flatMap((group) => {
          if (group.schedule && group.startTime && group.endTime) {
            const days = group.schedule.split(" ");
            return days.map((day, index) => ({
              id: `${group.id}-${index}`,
              day: day,
              time: `${group.startTime} - ${group.endTime}`,
              subject: group.name,
              room: "A-201",
            }));
          }
          return [];
        });
        setSchedule(scheduleData);

        // So'nggi faoliyat
        const activity = [
          {
            id: 1,
            type: "class",
            message: `${groupsWithStudents.length} ta guruh`,
            time: "Hozir",
            icon: "fa-layer-group",
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
            type: "task",
            message: `${teacherTasks.length} ta vazifa`,
            time: "Hozir",
            icon: "fa-clipboard-check",
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

  const handleTaskSuccess = () => {
    fetchTeacherData();
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setShowTaskModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <Sidebar />
        <div className="flex-1 md:ml-64 ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Sidebar />
      <div className="flex-1 md:ml-64 ml-0 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Xush kelibsiz, {user?.name || user?.username}!
            </h2>
            <p className="text-gray-600">O'qituvchi boshqaruv paneliga xush kelibsiz</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">O'quvchilar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.totalStudents}</h2>
                </div>
                <i className="fas fa-user-graduate text-3xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Guruhlar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.totalGroups}</h2>
                </div>
                <i className="fas fa-layer-group text-3xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Yaqin Darslar</p>
                  <h2 className="text-3xl font-bold mt-2">{stats.upcomingClasses}</h2>
                </div>
                <i className="fas fa-calendar-alt text-3xl opacity-80"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Vazifalar</p>
                  <h2 className="text-3xl font-bold mt-2">{tasks.length}</h2>
                </div>
                <i className="fas fa-clipboard-list text-3xl opacity-80"></i>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Guruhlar */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Mening Guruhlarim</h3>
                <button
                  onClick={() => setShowAllStudentsModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg font-medium"
                >
                  <i className="fas fa-user-graduate"></i>
                  Barcha O'quvchilar
                </button>
              </div>
              <div className="space-y-4">
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <div
                      key={group.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <i className="fas fa-layer-group text-white text-xl"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">{group.name}</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">
                                <i className="fas fa-user-graduate mr-1 text-purple-500"></i>
                                {group.studentsCount} o'quvchi
                              </span>
                              {group.schedule && (
                                <span className="text-sm text-gray-600">
                                  <i className="fas fa-calendar mr-1 text-blue-500"></i>
                                  {group.schedule}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleGroupClick(group)}
                            className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                          >
                            Vazifa Qo'shish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-layer-group text-4xl mb-2 opacity-50"></i>
                    <p>Hozircha guruhlar mavjud emas</p>
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
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg hover:from-purple-50 hover:to-pink-50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-md">
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

          {/* Vazifalar */}
          {tasks.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Mening Vazifalarim</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            <i className="fas fa-layer-group mr-1"></i>
                            {task.groupName || "Noma'lum"}
                          </span>
                          <span className="text-xs text-gray-500">
                            <i className="fas fa-calendar mr-1"></i>
                            {task.dueDate}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {task.status === "completed" ? "Yakunlangan" : "Kutilmoqda"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dars Jadvali */}
          {schedule.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Dars Jadvali</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kun</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vaqt</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fan</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Xona</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.day}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.time}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.subject}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Vazifa Qo'shish Modal */}
      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedGroup(null);
        }}
        onSuccess={handleTaskSuccess}
        groups={groups}
        teacherId={user?.id}
      />

      {/* Barcha O'quvchilar Modal */}
      <AllStudentsModal
        isOpen={showAllStudentsModal}
        onClose={() => setShowAllStudentsModal(false)}
        students={allStudents}
        groups={groups}
      />
    </div>
  );
}
