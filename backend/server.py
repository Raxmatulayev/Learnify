from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os, time

app = Flask(__name__)
CORS(app)  # CORS ni qo'shish
PORT = 5000

# Fayl manzillari
TEACHERS_FILE = "teachers.json"
STUDENTS_FILE = "students.json"
GROUPS_FILE = "groups.json"
PAYMENTS_FILE = "payments.json"
USERS_FILE = "users.json"
TASKS_FILE = "tasks.json"
COMPANIES_FILE = "companies.json"
BRANCHES_FILE = "branches.json"

# =====================
#  Yordamchi funksiyalar
# =====================
def read_json(file):
    if not os.path.exists(file):
        with open(file, "w", encoding="utf-8") as f:
            f.write("[]")
    with open(file, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(file, data):
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# =====================
#  TEACHERS CRUD
# =====================
@app.route("/teachers", methods=["GET"])
def get_teachers():
    try:
        return jsonify(read_json(TEACHERS_FILE))
    except:
        return jsonify({"error": "O'qituvchilarni o'qishda xatolik"}), 500

@app.route("/teachers", methods=["POST"])
def add_teacher():
    try:
        teachers = read_json(TEACHERS_FILE)
        new_teacher = {"id": int(time.time() * 1000), **request.json}
        teachers.append(new_teacher)
        write_json(TEACHERS_FILE, teachers)
        return jsonify(new_teacher), 201
    except:
        return jsonify({"error": "O'qituvchi qo'shishda xatolik"}), 500

@app.route("/teachers/<int:teacher_id>", methods=["PUT"])
def update_teacher(teacher_id):
    teachers = read_json(TEACHERS_FILE)
    for t in teachers:
        if t["id"] == teacher_id:
            t.update(request.json)
            write_json(TEACHERS_FILE, teachers)
            return jsonify(t)
    return jsonify({"error": "O'qituvchi topilmadi"}), 404

@app.route("/teachers/<int:teacher_id>", methods=["DELETE"])
def delete_teacher(teacher_id):
    teachers = read_json(TEACHERS_FILE)
    new_teachers = [t for t in teachers if t["id"] != teacher_id]
    if len(new_teachers) == len(teachers):
        return jsonify({"error": "O'qituvchi topilmadi"}), 404
    write_json(TEACHERS_FILE, new_teachers)
    return jsonify({"message": "✅ O'qituvchi o'chirildi"})

# =====================
#  STUDENTS CRUD
# =====================
@app.route("/students", methods=["GET"])
def get_students():
    try:
        return jsonify(read_json(STUDENTS_FILE))
    except:
        return jsonify({"error": "Studentlarni o'qishda xatolik"}), 500

@app.route("/students", methods=["POST"])
def add_student():
    students = read_json(STUDENTS_FILE)
    new_student = {"id": int(time.time() * 1000), **request.json}
    students.append(new_student)
    write_json(STUDENTS_FILE, students)
    return jsonify(new_student), 201

@app.route("/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    students = read_json(STUDENTS_FILE)
    for s in students:
        if s["id"] == student_id:
            s.update(request.json)
            write_json(STUDENTS_FILE, students)
            return jsonify(s)
    return jsonify({"error": "Student topilmadi"}), 404

@app.route("/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    students = read_json(STUDENTS_FILE)
    new_students = [s for s in students if s["id"] != student_id]
    if len(new_students) == len(students):
        return jsonify({"error": "Student topilmadi"}), 404
    write_json(STUDENTS_FILE, new_students)
    return jsonify({"message": "✅ Student o'chirildi"})

# =====================
#  GROUPS CRUD
# =====================
@app.route("/groups", methods=["GET"])
def get_groups():
    groups = read_json(GROUPS_FILE)
    teachers = read_json(TEACHERS_FILE)
    students = read_json(STUDENTS_FILE)

    full_groups = []
    for g in groups:
        teacher = next((t for t in teachers if t["id"] == g.get("teacherId")), None)
        group_students = [s for s in students if s.get("groupId") == g["id"]]
        full_groups.append({
            **g,
            "teacherName": teacher["name"] if teacher else "O'qituvchi topilmadi",
            "studentsCount": len(group_students),
            "students": [s["id"] for s in group_students]
        })
    return jsonify(full_groups)

@app.route("/groups/<int:group_id>", methods=["GET"])
def get_group(group_id):
    groups = read_json(GROUPS_FILE)
    group = next((g for g in groups if g["id"] == group_id), None)
    if not group:
        return jsonify({"error": "Guruh topilmadi"}), 404

    students = read_json(STUDENTS_FILE)
    teachers = read_json(TEACHERS_FILE)
    group_students = [s for s in students if s.get("groupId") == group_id]
    teacher = next((t for t in teachers if t["id"] == group.get("teacherId")), None)

    return jsonify({**group, "students": group_students, "teacher": teacher})

@app.route("/groups", methods=["POST"])
def add_group():
    groups = read_json(GROUPS_FILE)
    students = read_json(STUDENTS_FILE)

    data = request.json
    new_group = {
        "id": int(time.time() * 1000),
        "name": data.get("name"),
        "teacherId": int(data.get("teacherId")),
        "schedule": data.get("schedule"),
        "startTime": data.get("startTime"),
        "endTime": data.get("endTime"),
        "capacity": int(data.get("capacity", 20)),
        "status": data.get("status", "upcoming"),
        "students": data.get("studentIds", []),
        "studentsCount": len(data.get("studentIds", []))
    }

    for sid in data.get("studentIds", []):
        for s in students:
            if s["id"] == sid:
                s["groupId"] = new_group["id"]
                s["group"] = new_group["name"]
    write_json(STUDENTS_FILE, students)

    groups.append(new_group)
    write_json(GROUPS_FILE, groups)

    return jsonify(new_group), 201

@app.route("/groups/<int:group_id>", methods=["DELETE"])
def delete_group(group_id):
    groups = read_json(GROUPS_FILE)
    new_groups = [g for g in groups if g["id"] != group_id]
    if len(new_groups) == len(groups):
        return jsonify({"error": "Guruh topilmadi"}), 404
    write_json(GROUPS_FILE, new_groups)
    return jsonify({"message": "✅ Guruh o'chirildi"})


@app.route("/groups/<int:group_id>/add-student", methods=["PUT"])
def add_student_to_group(group_id):
    """
    Guruhga student qo'shish
    Frontend: `${API_ENDPOINTS.GROUPS}/${groupId}/add-student`
    """
    try:
        data = request.json or {}
        student_id = int(data.get("studentId"))

        groups = read_json(GROUPS_FILE)
        students = read_json(STUDENTS_FILE)

        group = next((g for g in groups if g["id"] == group_id), None)
        if not group:
            return jsonify({"error": "Guruh topilmadi"}), 404

        student = next((s for s in students if s["id"] == student_id), None)
        if not student:
            return jsonify({"error": "Student topilmadi"}), 404

        # students ro'yxati bo'lmasa, yaratib olamiz
        group.setdefault("students", [])
        group.setdefault("capacity", 0)

        if student_id in group["students"]:
            return jsonify({"error": "Student allaqachon ushbu guruhda"}), 400

        if len(group["students"]) >= int(group.get("capacity") or 0):
            return jsonify({"error": "Guruh to'ligan"}), 400

        # Guruhga qo'shish
        group["students"].append(student_id)
        group["studentsCount"] = len(group["students"])

        # Student ma'lumotlarini yangilash
        student["groupId"] = group_id
        student["group"] = group.get("name")

        write_json(GROUPS_FILE, groups)
        write_json(STUDENTS_FILE, students)

        return jsonify({
            "message": "✅ Student guruhga qo'shildi",
            "group": group
        })
    except Exception as e:
        return jsonify({"error": f"Studentni guruhga qo'shishda xatolik: {str(e)}"}), 500


@app.route("/groups/<int:group_id>/remove-student", methods=["PUT"])
def remove_student_from_group(group_id):
    """
    Guruhdan studentni o'chirish
    Frontend: `${API_ENDPOINTS.GROUPS}/${groupId}/remove-student`
    """
    try:
        data = request.json or {}
        student_id = int(data.get("studentId"))

        groups = read_json(GROUPS_FILE)
        students = read_json(STUDENTS_FILE)

        group = next((g for g in groups if g["id"] == group_id), None)
        if not group:
            return jsonify({"error": "Guruh topilmadi"}), 404

        student = next((s for s in students if s["id"] == student_id), None)
        if not student:
            return jsonify({"error": "Student topilmadi"}), 404

        group.setdefault("students", [])
        if student_id not in group["students"]:
            return jsonify({"error": "Student ushbu guruhda emas"}), 400

        # Guruhdan o'chirish
        group["students"] = [sid for sid in group["students"] if sid != student_id]
        group["studentsCount"] = len(group["students"])

        # Student ma'lumotlarini yangilash
        student["groupId"] = None
        student["group"] = None

        write_json(GROUPS_FILE, groups)
        write_json(STUDENTS_FILE, students)

        return jsonify({
            "message": "✅ Student guruhdan o'chirildi",
            "group": group
        })
    except Exception as e:
        return jsonify({"error": f"Studentni guruhdan o'chirishda xatolik: {str(e)}"}), 500

# =====================
#  PAYMENTS CRUD
# =====================
@app.route("/payments", methods=["GET"])
def get_payments():
    payments = read_json(PAYMENTS_FILE)
    students = read_json(STUDENTS_FILE)
    result = []
    for p in payments:
        student = next((s for s in students if s["id"] == p["studentId"]), None)
        result.append({
            **p,
            "studentName": f"{student.get('firstName','')} {student.get('lastName','')}" if student else "Noma'lum"
        })
    return jsonify(result)

@app.route("/payments", methods=["POST"])
def add_payment():
    payments = read_json(PAYMENTS_FILE)
    students = read_json(STUDENTS_FILE)

    data = request.json
    new_payment = {
        "id": int(time.time() * 1000),
        "studentId": int(data["studentId"]),
        "amount": float(data["amount"]),
        "paymentDate": data["paymentDate"],
        "paymentType": data.get("paymentType", "cash"),
        "description": data.get("description", ""),
        "createdAt": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    for s in students:
        if s["id"] == new_payment["studentId"]:
            s["balance"] = s.get("balance", 0) - new_payment["amount"]
            s["paymentStatus"] = "paid" if s["balance"] <= 0 else "unpaid"
    write_json(STUDENTS_FILE, students)

    payments.append(new_payment)
    write_json(PAYMENTS_FILE, payments)
    return jsonify(new_payment), 201

# =====================
#  AUTHENTICATION CRUD
# =====================
@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "Username va password kiritilishi shart"}), 400
        
        users = read_json(USERS_FILE)
        user = next((u for u in users if u.get("username") == username and u.get("password") == password), None)
        
        if not user:
            return jsonify({"error": "Noto'g'ri username yoki password"}), 401
        
        # Passwordni qaytarmaslik
        user_response = {**user}
        user_response.pop("password", None)
        
        return jsonify({
            "success": True,
            "user": user_response,
            "message": "Muvaffaqiyatli kirildi"
        }), 200
    except Exception as e:
        return jsonify({"error": f"Login xatolik: {str(e)}"}), 500

@app.route("/auth/register", methods=["POST"])
def register():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")
        role = data.get("role")
        name = data.get("name", "")
        
        if not username or not password or not role:
            return jsonify({"error": "Barcha maydonlar to'ldirilishi shart"}), 400
        
        if role not in ["admin", "company", "branch", "teacher", "student"]:
            return jsonify({"error": "Noto'g'ri role"}), 400
        
        users = read_json(USERS_FILE)
        
        # Username takrorlanmasligini tekshirish
        if any(u.get("username") == username for u in users):
            return jsonify({"error": "Bu username allaqachon mavjud"}), 400
        
        new_user = {
            "id": int(time.time() * 1000),
            "username": username,
            "password": password,
            "role": role,
            "name": name,
            "createdAt": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        users.append(new_user)
        write_json(USERS_FILE, users)
        
        # Passwordni qaytarmaslik
        user_response = {**new_user}
        user_response.pop("password", None)
        
        return jsonify({
            "success": True,
            "user": user_response,
            "message": "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi"
        }), 201
    except Exception as e:
        return jsonify({"error": f"Ro'yxatdan o'tish xatolik: {str(e)}"}), 500

@app.route("/users", methods=["GET"])
def get_users():
    try:
        users = read_json(USERS_FILE)
        # Passwordlarni olib tashlash
        safe_users = [{k: v for k, v in u.items() if k != "password"} for u in users]
        return jsonify(safe_users)
    except:
        return jsonify({"error": "Foydalanuvchilarni o'qishda xatolik"}), 500

# =====================
#  STUDENT va TEACHER LOGIN (Telefon va Ism bilan)
# =====================
@app.route("/auth/login/student", methods=["POST"])
def login_student():
    """Student login - telefon raqami va ism bilan"""
    try:
        data = request.json
        phone = data.get("phone", "").strip()
        name = data.get("name", "").strip()
        
        if not phone or not name:
            return jsonify({"error": "Telefon raqami va ism kiritilishi shart"}), 400
        
        students = read_json(STUDENTS_FILE)
        student = next((s for s in students if s.get("phone") == phone and s.get("name") == name), None)
        
        if not student:
            return jsonify({"error": "Noto'g'ri telefon raqami yoki ism"}), 401
        
        # Student ma'lumotlarini user formatiga o'tkazish
        user_response = {
            "id": student.get("id"),
            "name": student.get("name"),
            "phone": student.get("phone"),
            "role": "student",
            "groupId": student.get("groupId"),
            "group": student.get("group"),
            "status": student.get("status")
        }
        
        return jsonify({
            "success": True,
            "user": user_response,
            "message": "Muvaffaqiyatli kirildi"
        }), 200
    except Exception as e:
        return jsonify({"error": f"Login xatolik: {str(e)}"}), 500

@app.route("/auth/login/teacher", methods=["POST"])
def login_teacher():
    """Teacher login - telefon raqami va ism bilan"""
    try:
        data = request.json
        phone = data.get("phone", "").strip()
        name = data.get("name", "").strip()
        
        if not phone or not name:
            return jsonify({"error": "Telefon raqami va ism kiritilishi shart"}), 400
        
        teachers = read_json(TEACHERS_FILE)
        teacher = next((t for t in teachers if t.get("phone") == phone and t.get("name") == name), None)
        
        if not teacher:
            return jsonify({"error": "Noto'g'ri telefon raqami yoki ism"}), 401
        
        # Teacher ma'lumotlarini user formatiga o'tkazish
        user_response = {
            "id": teacher.get("id"),
            "name": teacher.get("name"),
            "phone": teacher.get("phone"),
            "role": "teacher",
            "subject": teacher.get("subject"),
            "status": teacher.get("status")
        }
        
        return jsonify({
            "success": True,
            "user": user_response,
            "message": "Muvaffaqiyatli kirildi"
        }), 200
    except Exception as e:
        return jsonify({"error": f"Login xatolik: {str(e)}"}), 500

# =====================
#  TASKS CRUD (Vazifalar)
# =====================
@app.route("/tasks", methods=["GET"])
def get_tasks():
    """Barcha vazifalarni olish"""
    try:
        tasks = read_json(TASKS_FILE)
        groups = read_json(GROUPS_FILE)
        teachers = read_json(TEACHERS_FILE)
        
        # Guruh va o'qituvchi ma'lumotlarini qo'shish
        full_tasks = []
        for task in tasks:
            group = next((g for g in groups if g["id"] == task.get("groupId")), None)
            teacher = next((t for t in teachers if t["id"] == task.get("teacherId")), None)
            
            full_tasks.append({
                **task,
                "groupName": group.get("name") if group else "Noma'lum",
                "teacherName": teacher.get("name") if teacher else "Noma'lum"
            })
        
        return jsonify(full_tasks)
    except Exception as e:
        return jsonify({"error": f"Vazifalarni olishda xatolik: {str(e)}"}), 500

@app.route("/tasks/group/<int:group_id>", methods=["GET"])
def get_tasks_by_group(group_id):
    """Guruh bo'yicha vazifalarni olish"""
    try:
        tasks = read_json(TASKS_FILE)
        group_tasks = [t for t in tasks if t.get("groupId") == group_id]
        return jsonify(group_tasks)
    except Exception as e:
        return jsonify({"error": f"Vazifalarni olishda xatolik: {str(e)}"}), 500

@app.route("/tasks", methods=["POST"])
def add_task():
    """Yangi vazifa qo'shish"""
    try:
        data = request.json
        tasks = read_json(TASKS_FILE)
        groups = read_json(GROUPS_FILE)
        teachers = read_json(TEACHERS_FILE)
        
        # Guruh va o'qituvchi mavjudligini tekshirish
        group = next((g for g in groups if g["id"] == data.get("groupId")), None)
        if not group:
            return jsonify({"error": "Guruh topilmadi"}), 404
        
        teacher = next((t for t in teachers if t["id"] == data.get("teacherId")), None)
        if not teacher:
            return jsonify({"error": "O'qituvchi topilmadi"}), 404
        
        # O'qituvchi ushbu guruhga tegishli ekanligini tekshirish
        if group.get("teacherId") != data.get("teacherId"):
            return jsonify({"error": "O'qituvchi ushbu guruhga tegishli emas"}), 403
        
        new_task = {
            "id": int(time.time() * 1000),
            "groupId": int(data.get("groupId")),
            "teacherId": int(data.get("teacherId")),
            "title": data.get("title"),
            "description": data.get("description", ""),
            "dueDate": data.get("dueDate"),
            "status": data.get("status", "pending"),
            "createdAt": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        tasks.append(new_task)
        write_json(TASKS_FILE, tasks)
        
        return jsonify(new_task), 201
    except Exception as e:
        return jsonify({"error": f"Vazifa qo'shishda xatolik: {str(e)}"}), 500

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    """Vazifani yangilash"""
    try:
        tasks = read_json(TASKS_FILE)
        task = next((t for t in tasks if t["id"] == task_id), None)
        
        if not task:
            return jsonify({"error": "Vazifa topilmadi"}), 404
        
        task.update(request.json)
        write_json(TASKS_FILE, tasks)
        
        return jsonify(task)
    except Exception as e:
        return jsonify({"error": f"Vazifani yangilashda xatolik: {str(e)}"}), 500

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    """Vazifani o'chirish"""
    try:
        tasks = read_json(TASKS_FILE)
        new_tasks = [t for t in tasks if t["id"] != task_id]
        
        if len(new_tasks) == len(tasks):
            return jsonify({"error": "Vazifa topilmadi"}), 404
        
        write_json(TASKS_FILE, new_tasks)
        return jsonify({"message": "✅ Vazifa o'chirildi"})
    except Exception as e:
        return jsonify({"error": f"Vazifani o'chirishda xatolik: {str(e)}"}), 500

# =====================
#  COMPANIES CRUD
# =====================
@app.route("/companies", methods=["GET"])
def get_companies():
    """Barcha companylarni olish"""
    try:
        companies = read_json(COMPANIES_FILE)
        return jsonify(companies)
    except Exception as e:
        return jsonify({"error": f"Companylarni olishda xatolik: {str(e)}"}), 500

@app.route("/companies", methods=["POST"])
def add_company():
    """Yangi company qo'shish (user yaratilmaydi - admin keyinchalik yaratadi)"""
    try:
        data = request.json
        companies = read_json(COMPANIES_FILE)
        
        new_company = {
            "id": int(time.time() * 1000),
            "name": data.get("name"),
            "address": data.get("address", ""),
            "phone": data.get("phone", ""),
            "email": data.get("email", ""),
            "status": data.get("status", "active"),
            "createdAt": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        companies.append(new_company)
        write_json(COMPANIES_FILE, companies)
        
        return jsonify(new_company), 201
    except Exception as e:
        return jsonify({"error": f"Company qo'shishda xatolik: {str(e)}"}), 500

@app.route("/companies/<int:company_id>", methods=["PUT"])
def update_company(company_id):
    """Companyni yangilash"""
    try:
        companies = read_json(COMPANIES_FILE)
        company = next((c for c in companies if c["id"] == company_id), None)
        
        if not company:
            return jsonify({"error": "Company topilmadi"}), 404
        
        company.update(request.json)
        write_json(COMPANIES_FILE, companies)
        
        return jsonify(company)
    except Exception as e:
        return jsonify({"error": f"Companyni yangilashda xatolik: {str(e)}"}), 500

@app.route("/companies/<int:company_id>", methods=["DELETE"])
def delete_company(company_id):
    """Companyni o'chirish"""
    try:
        companies = read_json(COMPANIES_FILE)
        new_companies = [c for c in companies if c["id"] != company_id]
        
        if len(new_companies) == len(companies):
            return jsonify({"error": "Company topilmadi"}), 404
        
        write_json(COMPANIES_FILE, new_companies)
        return jsonify({"message": "✅ Company o'chirildi"})
    except Exception as e:
        return jsonify({"error": f"Companyni o'chirishda xatolik: {str(e)}"}), 500

# =====================
#  BRANCHES CRUD
# =====================
@app.route("/branches", methods=["GET"])
def get_branches():
    """Barcha branchlarni olish"""
    try:
        branches = read_json(BRANCHES_FILE)
        company_id = request.args.get("companyId")
        
        if company_id:
            branches = [b for b in branches if b.get("companyId") == int(company_id)]
        
        # Har bir branch uchun statistikani qo'shish
        students = read_json(STUDENTS_FILE)
        teachers = read_json(TEACHERS_FILE)
        groups = read_json(GROUPS_FILE)
        
        full_branches = []
        for branch in branches:
            # Branch statistikasini hisoblash (demo - keyinchalik branchId bo'yicha)
            branch_students = len(students)  # Keyinchalik branchId bo'yicha filter qilish
            branch_teachers = len(teachers)  # Keyinchalik branchId bo'yicha filter qilish
            branch_groups = len(groups)  # Keyinchalik branchId bo'yicha filter qilish
            
            full_branches.append({
                **branch,
                "studentsCount": branch_students,
                "teachersCount": branch_teachers,
                "groupsCount": branch_groups
            })
        
        return jsonify(full_branches)
    except Exception as e:
        return jsonify({"error": f"Branchlarni olishda xatolik: {str(e)}"}), 500

@app.route("/branches", methods=["POST"])
def add_branch():
    """Yangi branch qo'shish va avtomatik user yaratish"""
    try:
        data = request.json
        branches = read_json(BRANCHES_FILE)
        companies = read_json(COMPANIES_FILE)
        users = read_json(USERS_FILE)
        
        # Company mavjudligini tekshirish
        company = next((c for c in companies if c["id"] == data.get("companyId")), None)
        if not company:
            return jsonify({"error": "Company topilmadi"}), 404
        
        # Username va password tekshirish
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "Username va password kiritilishi shart"}), 400
        
        # Username takrorlanmasligini tekshirish
        if any(u.get("username") == username for u in users):
            return jsonify({"error": "Bu username allaqachon mavjud"}), 400
        
        new_branch = {
            "id": int(time.time() * 1000),
            "companyId": int(data.get("companyId")),
            "name": data.get("name"),
            "address": data.get("address", ""),
            "phone": data.get("phone", ""),
            "email": data.get("email", ""),
            "status": data.get("status", "active"),
            "createdAt": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        branches.append(new_branch)
        write_json(BRANCHES_FILE, branches)
        
        # Avtomatik user yaratish
        new_user = {
            "id": int(time.time() * 1000) + 1,
            "username": username,
            "password": password,
            "role": "branch",
            "name": new_branch["name"],
            "companyId": new_branch["companyId"],
            "branchId": new_branch["id"],
            "createdAt": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        users.append(new_user)
        write_json(USERS_FILE, users)
        
        return jsonify({
            **new_branch,
            "user": {
                "username": username,
                "role": "branch"
            }
        }), 201
    except Exception as e:
        return jsonify({"error": f"Branch qo'shishda xatolik: {str(e)}"}), 500

@app.route("/branches/<int:branch_id>", methods=["PUT"])
def update_branch(branch_id):
    """Branchni yangilash"""
    try:
        branches = read_json(BRANCHES_FILE)
        branch = next((b for b in branches if b["id"] == branch_id), None)
        
        if not branch:
            return jsonify({"error": "Branch topilmadi"}), 404
        
        branch.update(request.json)
        write_json(BRANCHES_FILE, branches)
        
        return jsonify(branch)
    except Exception as e:
        return jsonify({"error": f"Branchni yangilashda xatolik: {str(e)}"}), 500

@app.route("/branches/<int:branch_id>", methods=["DELETE"])
def delete_branch(branch_id):
    """Branchni o'chirish"""
    try:
        branches = read_json(BRANCHES_FILE)
        new_branches = [b for b in branches if b["id"] != branch_id]
        
        if len(new_branches) == len(branches):
            return jsonify({"error": "Branch topilmadi"}), 404
        
        write_json(BRANCHES_FILE, new_branches)
        return jsonify({"message": "✅ Branch o'chirildi"})
    except Exception as e:
        return jsonify({"error": f"Branchni o'chirishda xatolik: {str(e)}"}), 500

@app.route("/branches/<int:branch_id>/stats", methods=["GET"])
def get_branch_stats(branch_id):
    """Branch statistikasini olish"""
    try:
        students = read_json(STUDENTS_FILE)
        teachers = read_json(TEACHERS_FILE)
        groups = read_json(GROUPS_FILE)
        payments = read_json(PAYMENTS_FILE)
        
        # Keyinchalik branchId bo'yicha filter qilish
        # Hozircha demo ma'lumotlar
        stats = {
            "students": len(students),
            "teachers": len(teachers),
            "groups": len(groups),
            "totalRevenue": sum(p.get("amount", 0) for p in payments),
            "activeStudents": len([s for s in students if s.get("status") == "active"])
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": f"Statistikani olishda xatolik: {str(e)}"}), 500

# =====================
#  Qo'shimcha endpointlar
# =====================

@app.route("/", methods=["GET"])
def health_check():
    """Test endpoint - backend ishlayotganini tekshirish uchun"""
    return jsonify({
        "message": "Backend server (Flask) ishlamoqda!",
        "endpoints": {
            "login": "/auth/login",
            "student_login": "/auth/login/student",
            "teacher_login": "/auth/login/teacher",
            "register": "/auth/register",
            "users": "/users",
            "students": "/students",
            "teachers": "/teachers",
            "groups": "/groups",
            "payments": "/payments",
            "tasks": "/tasks",
            "companies": "/companies",
            "branches": "/branches"
        }
    })


@app.errorhandler(404)
def handle_404(err):
    return jsonify({
        "error": "Endpoint topilmadi",
        "message": "Iltimos, to'g'ri endpoint dan foydalaning"
    }), 404


# =====================
#  Serverni ishga tushirish
# =====================
if __name__ == "__main__":
    app.run(port=PORT, debug=True)
