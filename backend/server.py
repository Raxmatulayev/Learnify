from flask import Flask, jsonify, request
import json, os, time

app = Flask(__name__)
PORT = 5000

# Fayl manzillari
TEACHERS_FILE = "teachers.json"
STUDENTS_FILE = "students.json"
GROUPS_FILE = "groups.json"
PAYMENTS_FILE = "payments.json"

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
#  Serverni ishga tushirish
# =====================
if __name__ == "__main__":
    app.run(port=PORT, debug=True)
