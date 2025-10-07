import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 5000;

// Fayl manzillari
const TEACHERS_FILE = path.join(__dirname, "teachers.json");
const STUDENTS_FILE = path.join(__dirname, "students.json");
const GROUPS_FILE = path.join(__dirname, "groups.json");
const PAYMENTS_FILE = path.join(__dirname, "payments.json");


app.use(cors());
app.use(express.json());

/* =====================
   Yordamchi funksiyalar
===================== */
function readJSON(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
  }
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

/* =====================
   TEACHERS CRUD
===================== */
app.get("/teachers", (req, res) => {
  try {
    const teachers = readJSON(TEACHERS_FILE);
    res.json(teachers);
  } catch {
    res.status(500).json({ error: "O'qituvchilarni o'qishda xatolik" });
  }
});

app.post("/teachers", (req, res) => {
  try {
    const teachers = readJSON(TEACHERS_FILE);
    const newTeacher = { id: Date.now(), ...req.body };
    teachers.push(newTeacher);
    writeJSON(TEACHERS_FILE, teachers);
    res.status(201).json(newTeacher);
  } catch {
    res.status(500).json({ error: "O'qituvchi qo'shishda xatolik" });
  }
});

app.put("/teachers/:id", (req, res) => {
  try {
    const teachers = readJSON(TEACHERS_FILE);
    const id = parseInt(req.params.id);
    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: "O'qituvchi topilmadi" });

    teachers[index] = { ...teachers[index], ...req.body };
    writeJSON(TEACHERS_FILE, teachers);
    res.json(teachers[index]);
  } catch {
    res.status(500).json({ error: "O'qituvchini yangilashda xatolik" });
  }
});

app.delete("/teachers/:id", (req, res) => {
  try {
    const teachers = readJSON(TEACHERS_FILE);
    const id = parseInt(req.params.id);
    const newTeachers = teachers.filter((t) => t.id !== id);
    if (teachers.length === newTeachers.length)
      return res.status(404).json({ error: "O'qituvchi topilmadi" });

    writeJSON(TEACHERS_FILE, newTeachers);
    res.json({ message: "✅ O'qituvchi o'chirildi" });
  } catch {
    res.status(500).json({ error: "O'qituvchini o'chirishda xatolik" });
  }
});

/* =====================
   STUDENTS CRUD
===================== */
app.get("/students", (req, res) => {
  try {
    const students = readJSON(STUDENTS_FILE);
    res.json(students);
  } catch {
    res.status(500).json({ error: "Studentlarni o'qishda xatolik" });
  }
});

app.post("/students", (req, res) => {
  try {
    const students = readJSON(STUDENTS_FILE);
    const newStudent = { id: Date.now(), ...req.body };
    students.push(newStudent);
    writeJSON(STUDENTS_FILE, students);
    res.status(201).json(newStudent);
  } catch {
    res.status(500).json({ error: "Student qo'shishda xatolik" });
  }
});

// Studentni guruhga qo'shish
app.put("/students/:id/group", (req, res) => {
  try {
    const { groupId, groupName } = req.body;
    const students = readJSON(STUDENTS_FILE);
    const id = parseInt(req.params.id);
    const index = students.findIndex((s) => s.id === id);
    
    if (index === -1) return res.status(404).json({ error: "Student topilmadi" });

    students[index] = { 
      ...students[index], 
      groupId: groupId,
      group: groupName 
    };
    
    writeJSON(STUDENTS_FILE, students);
    res.json(students[index]);
  } catch {
    res.status(500).json({ error: "Studentni guruhga qo'shishda xatolik" });
  }
});

app.put("/students/:id", (req, res) => {
  try {
    const students = readJSON(STUDENTS_FILE);
    const id = parseInt(req.params.id);
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ error: "Student topilmadi" });

    students[index] = { ...students[index], ...req.body };
    writeJSON(STUDENTS_FILE, students);
    res.json(students[index]);
  } catch {
    res.status(500).json({ error: "Studentni yangilashda xatolik" });
  }
});

app.delete("/students/:id", (req, res) => {
  try {
    const students = readJSON(STUDENTS_FILE);
    const id = parseInt(req.params.id);
    const newStudents = students.filter((s) => s.id !== id);
    if (students.length === newStudents.length)
      return res.status(404).json({ error: "Student topilmadi" });

    writeJSON(STUDENTS_FILE, newStudents);
    res.json({ message: "✅ Student o'chirildi" });
  } catch {
    res.status(500).json({ error: "Studentni o'chirishda xatolik" });
  }
});

/* =====================
   GROUPS CRUD
===================== */
app.get("/groups", (req, res) => {
  try {
    const groups = readJSON(GROUPS_FILE);
    const teachers = readJSON(TEACHERS_FILE);
    const students = readJSON(STUDENTS_FILE);

    const fullGroups = groups.map((g) => {
      const teacher = teachers.find((t) => t.id === g.teacherId);
      const groupStudents = students.filter((s) => s.groupId === g.id);

      return {
        ...g,
        teacherName: teacher ? teacher.name : "O'qituvchi topilmadi",
        teacher: teacher || null,
        studentsCount: groupStudents.length,
        students: groupStudents.map(s => s.id)
      };
    });

    res.json(fullGroups);
  } catch {
    res.status(500).json({ error: "Guruhlarni o'qishda xatolik" });
  }
});

app.get("/groups/:id", (req, res) => {
  try {
    const groups = readJSON(GROUPS_FILE);
    const students = readJSON(STUDENTS_FILE);
    const teachers = readJSON(TEACHERS_FILE);

    const groupId = parseInt(req.params.id);
    const group = groups.find(g => g.id === groupId);

    if (!group) return res.status(404).json({ error: "Guruh topilmadi" });

    const groupStudents = students.filter(s => s.groupId === groupId);
    const teacher = teachers.find(t => t.id === group.teacherId);

    res.json({
      ...group,
      students: groupStudents,
      teacher: teacher || null
    });
  } catch {
    res.status(500).json({ error: "Guruh tafsilotlarini olishda xatolik" });
  }
});

// ✅ Birlashtirilgan POST - yangi guruh yaratish
app.post("/groups", (req, res) => {
  try {
    const groups = readJSON(GROUPS_FILE);
    const students = readJSON(STUDENTS_FILE);

    const { name, teacherId, startDate, schedule, startTime, endTime, capacity, status, studentIds } = req.body;

    const newGroup = {
      id: Date.now(),
      name,
      teacherId: parseInt(teacherId),
      startDate,
      schedule,
      startTime,
      endTime,
      capacity: parseInt(capacity) || 20,
      status: status || "upcoming",
      students: studentIds || [],
      studentsCount: studentIds ? studentIds.length : 0
    };

    // Studentlarni ham yangilash
    if (studentIds && studentIds.length > 0) {
      studentIds.forEach((sid) => {
        const index = students.findIndex((s) => s.id === sid);
        if (index !== -1) {
          students[index].groupId = newGroup.id;
          students[index].group = name;
        }
      });
      writeJSON(STUDENTS_FILE, students);
    }

    groups.push(newGroup);
    writeJSON(GROUPS_FILE, groups);

    res.status(201).json(newGroup);
  } catch (err) {
    console.error("❌ Guruh yaratishda xatolik:", err);
    res.status(500).json({ error: "Guruh yaratishda xatolik" });
  }
});

app.put("/groups/:id", (req, res) => {
  try {
    const groups = readJSON(GROUPS_FILE);
    const id = parseInt(req.params.id);
    const index = groups.findIndex((g) => g.id === id);
    if (index === -1) return res.status(404).json({ error: "Guruh topilmadi" });

    groups[index] = { ...groups[index], ...req.body };
    writeJSON(GROUPS_FILE, groups);
    res.json(groups[index]);
  } catch {
    res.status(500).json({ error: "Guruhni yangilashda xatolik" });
  }
});

// Guruhdan studentni o'chirish
app.put("/groups/:id/remove-student", (req, res) => {
  try {
    const { studentId } = req.body;
    const groups = readJSON(GROUPS_FILE);
    const students = readJSON(STUDENTS_FILE);
    
    const groupId = parseInt(req.params.id);
    const groupIndex = groups.findIndex((g) => g.id === groupId);
    if (groupIndex === -1) return res.status(404).json({ error: "Guruh topilmadi" });

    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) return res.status(404).json({ error: "Student topilmadi" });

    // Studentni guruhdan o'chirish
    groups[groupIndex].students = groups[groupIndex].students.filter(id => id !== studentId);
    groups[groupIndex].studentsCount = groups[groupIndex].students.length;

    // Student ma'lumotlarini yangilash
    students[studentIndex].groupId = null;
    students[studentIndex].group = null;

    writeJSON(GROUPS_FILE, groups);
    writeJSON(STUDENTS_FILE, students);

    res.json({ 
      message: "✅ Student guruhdan o'chirildi",
      group: groups[groupIndex]
    });
  } catch {
    res.status(500).json({ error: "Studentni guruhdan o'chirishda xatolik" });
  }
});

app.put("/groups/:id/add-student", (req, res) => {
  try {
    const { studentId } = req.body;
    const groups = readJSON(GROUPS_FILE);
    const students = readJSON(STUDENTS_FILE);
    
    const groupId = parseInt(req.params.id);
    const groupIndex = groups.findIndex((g) => g.id === groupId);
    if (groupIndex === -1) return res.status(404).json({ error: "Guruh topilmadi" });

    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) return res.status(404).json({ error: "Student topilmadi" });

    if (groups[groupIndex].students.includes(studentId)) {
      return res.status(400).json({ error: "Student allaqachon ushbu guruhda" });
    }

    if (groups[groupIndex].students.length >= groups[groupIndex].capacity) {
      return res.status(400).json({ error: "Guruh to'ligan" });
    }

    groups[groupIndex].students.push(studentId);
    groups[groupIndex].studentsCount = groups[groupIndex].students.length;

    students[studentIndex].groupId = groupId;
    students[studentIndex].group = groups[groupIndex].name;

    writeJSON(GROUPS_FILE, groups);
    writeJSON(STUDENTS_FILE, students);

    res.json({ 
      message: "✅ Student guruhga qo'shildi",
      group: groups[groupIndex]
    });
  } catch {
    res.status(500).json({ error: "Studentni guruhga qo'shishda xatolik" });
  }
});
/* =====================
   PAYMENTS CRUD
===================== */
app.get("/payments", (req, res) => {
  try {
    const payments = readJSON(PAYMENTS_FILE);
    const students = readJSON(STUDENTS_FILE);
    
    const paymentsWithStudent = payments.map(payment => {
      const student = students.find(s => s.id === payment.studentId);
      return {
        ...payment,
        studentName: student ? `${student.firstName} ${student.lastName}` : "Noma'lum"
      };
    });
    
    res.json(paymentsWithStudent);
  } catch (err) {
    console.error("❌ To'lovlarni o'qishda xatolik:", err);
    res.status(500).json({ error: "To'lovlarni o'qishda xatolik" });
  }
});

app.post("/payments", (req, res) => {
  try {
    const payments = readJSON(PAYMENTS_FILE);
    const students = readJSON(STUDENTS_FILE);
    
    const { studentId, amount, paymentDate, paymentType, description } = req.body;
    
    const newPayment = {
      id: Date.now(),
      studentId: parseInt(studentId),
      amount: parseFloat(amount),
      paymentDate,
      paymentType: paymentType || "cash",
      description: description || "",
      createdAt: new Date().toISOString()
    };
    
    // Student balansini yangilash
    const studentIndex = students.findIndex(s => s.id === newPayment.studentId);
    if (studentIndex !== -1) {
      students[studentIndex].balance = (students[studentIndex].balance || 0) - newPayment.amount;
      if (students[studentIndex].balance <= 0) {
        students[studentIndex].paymentStatus = "paid";
      }
      writeJSON(STUDENTS_FILE, students);
    }
    
    payments.push(newPayment);
    writeJSON(PAYMENTS_FILE, payments);
    
    res.status(201).json(newPayment);
  } catch (error) {
    console.error("❌ To'lov qo'shishda xatolik:", error);
    res.status(500).json({ error: "To'lov qo'shishda xatolik" });
  }
});



app.delete("/groups/:id", (req, res) => {
  try {
    const groups = readJSON(GROUPS_FILE);
    const id = parseInt(req.params.id);
    const newGroups = groups.filter((g) => g.id !== id);
    if (groups.length === newGroups.length)
      return res.status(404).json({ error: "Guruh topilmadi" });

    writeJSON(GROUPS_FILE, newGroups);
    res.json({ message: "✅ Guruh o'chirildi" });
  } catch {
    res.status(500).json({ error: "Guruhni o'chirishda xatolik" });
  }
});

/* =====================
   Serverni ishga tushirish
===================== */
app.listen(PORT, () =>
  console.log(`🚀 Backend http://localhost:${PORT} da ishlamoqda`)
);
