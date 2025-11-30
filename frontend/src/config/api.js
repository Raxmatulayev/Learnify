// Markaziy API konfiguratsiya
export const API_BASE = "http://localhost:5000";

// API endpointlar
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE}/auth/login`,
  STUDENT_LOGIN: `${API_BASE}/auth/login/student`,
  TEACHER_LOGIN: `${API_BASE}/auth/login/teacher`,
  REGISTER: `${API_BASE}/auth/register`,
  USERS: `${API_BASE}/users`,
  
  // CRUD
  STUDENTS: `${API_BASE}/students`,
  TEACHERS: `${API_BASE}/teachers`,
  GROUPS: `${API_BASE}/groups`,
  PAYMENTS: `${API_BASE}/payments`,
  TASKS: `${API_BASE}/tasks`,
  COMPANIES: `${API_BASE}/companies`,
  BRANCHES: `${API_BASE}/branches`,
};




