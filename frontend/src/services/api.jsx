// services/api.js
const API_BASE_URL = 'http://localhost:3001/api'; // Backend URL

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentsAPI = {
  // Barcha o'quvchilarni olish
  getStudents: async (filters = {}) => {
    await delay(1000); // Loadingni ko'rsatish uchun
    
    try {
      const response = await fetch(`${API_BASE_URL}/students?${new URLSearchParams(filters)}`);
      
      if (!response.ok) {
        throw new Error('Ma\'lumotlarni olishda xatolik');
      }
      
      return await response.json();
    } catch (error) {
      // Agar backend ishlamasa, demo ma'lumot qaytaramiz
      console.warn('Backendga ulanishda xatolik, demo ma\'lumot ishlatilmoqda:', error);
      
      await delay(500);
      return {
        students: [
          { id: 1, name: "Ali Valiyev", group: "Frontend 101", phone: "+998901234567", status: "active", payment: "paid", joinDate: "2024-01-15" },
          { id: 2, name: "Dilnoza Xolmatova", group: "Backend 202", phone: "+998901234568", status: "active", payment: "pending", joinDate: "2024-01-10" },
          { id: 3, name: "Sardor Qodirov", group: "Design 101", phone: "+998901234569", status: "inactive", payment: "paid", joinDate: "2024-01-05" },
          { id: 4, name: "Madina Yusupova", group: "Frontend 101", phone: "+998901234570", status: "active", payment: "paid", joinDate: "2024-01-20" },
          { id: 5, name: "Javohir Toshmatov", group: "Backend 202", phone: "+998901234571", status: "active", payment: "overdue", joinDate: "2024-01-18" },
        ],
        total: 245,
        stats: {
          total: 245,
          active: 218,
          pendingPayment: 27,
          newThisMonth: 12
        }
      };
    }
  },

  // O'quvchi qo'shish
  addStudent: async (studentData) => {
    await delay(800);
    
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        throw new Error('O\'quvchi qo\'shishda xatolik');
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Backendga ulanishda xatolik:', error);
      await delay(300);
      return { success: true, id: Date.now() };
    }
  },

  // O'quvchini o'chirish
  deleteStudent: async (id) => {
    await delay(600);
    
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('O\'quvchini o\'chirishda xatolik');
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Backendga ulanishda xatolik:', error);
      await delay(300);
      return { success: true };
    }
  }
};