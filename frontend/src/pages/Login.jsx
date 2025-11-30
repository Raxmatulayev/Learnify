import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

export default function Login() {
  const [loginType, setLoginType] = useState("default"); // default, student, teacher
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      let loginData;

      // Login turi bo'yicha endpoint tanlash
      if (loginType === "student") {
        // Student login - telefon va ism bilan
        if (!formData.phone || !formData.name) {
          setError("Telefon raqami va ism kiritilishi shart");
          setLoading(false);
          return;
        }
        loginData = {
          phone: formData.phone,
          name: formData.name,
        };
        response = await fetch(API_ENDPOINTS.STUDENT_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });
      } else if (loginType === "teacher") {
        // Teacher login - telefon va ism bilan
        if (!formData.phone || !formData.name) {
          setError("Telefon raqami va ism kiritilishi shart");
          setLoading(false);
          return;
        }
        loginData = {
          phone: formData.phone,
          name: formData.name,
        };
        response = await fetch(API_ENDPOINTS.TEACHER_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });
      } else {
        // Default login - username va password bilan
        if (!formData.username || !formData.password) {
          setError("Username va password kiritilishi shart");
          setLoading(false);
          return;
        }
        loginData = {
          username: formData.username,
          password: formData.password,
        };
        response = await fetch(API_ENDPOINTS.LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });
      }

      // Response statusni tekshirish
      if (!response.ok) {
        let errorMessage = "Login qilishda xatolik yuz berdi";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server xatolik: ${response.status} ${response.statusText}`;
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const role = data.user.role;

        // AuthContext orqali login qilish
        login(data.user);

        // Role bo'yicha to'g'ri sahifaga yo'naltirish
        switch (role) {
          case "company":
            navigate("/company");
            break;
          case "branch":
            navigate("/dashboard");
            break;
          case "admin":
            navigate("/dashboard");
            break;
          case "teacher":
            navigate("/teacher");
            break;
          case "student":
            navigate("/student");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        setError(data.error || "Login qilishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Login xatolik:", error);
      setError("Serverga ulanib bo'lmadi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      phone: "",
      name: "",
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <i className="fas fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Learnify ERP</h1>
          <p className="text-gray-600">Tizimga kirish</p>
        </div>

        {/* Login Type Selector */}
        <div className="mb-6 flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setLoginType("default");
              resetForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === "default"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Admin/Branch
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType("teacher");
              resetForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === "teacher"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            O'qituvchi
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType("student");
              resetForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === "student"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            O'quvchi
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {loginType === "default" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Username kiriting"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Password kiriting"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Raqami
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+998901234567"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ism va Familiya
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ism va familiya kiriting"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">
            {loginType === "default" ? "Test foydalanuvchilar:" : "Maslahat:"}
          </p>
          {loginType === "default" ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Admin</p>
                <p className="text-gray-600">admin / admin123</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Company</p>
                <p className="text-gray-600">company / company123</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Branch</p>
                <p className="text-gray-600">branch / branch123</p>
              </div>
            </div>
          ) : loginType === "teacher" ? (
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
              <p className="font-semibold mb-1">O'qituvchi login:</p>
              <p>Telefon raqami va ism bilan kirish</p>
              <p className="mt-1 text-blue-600">Masalan: +998901238372 / Qobiljon Karimov</p>
            </div>
          ) : (
            <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800">
              <p className="font-semibold mb-1">O'quvchi login:</p>
              <p>Telefon raqami va ism bilan kirish</p>
              <p className="mt-1 text-green-600">Masalan: +998901112233 / Ali Valiyev</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
