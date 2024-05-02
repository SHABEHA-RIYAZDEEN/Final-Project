from flask import jsonify, request
from models.student import Student

def create_student():
    data = request.json
    student = Student(**data)
    student.save()
    return jsonify({"message": "Student saved successfully", "id": str(student.id)}), 200

def get_all_students():
    students = Student.objects.all()  # Retrieve all students from the database
    if students:
        students_data = []
        for student in students:
            student_dict = {
                'id': str(student.id),  # Convert MongoDB ObjectId to string
                'name': student.name,
                'date_of_birth': student.date_of_birth.isoformat() if student.date_of_birth else None,  # Ensure date is in ISO format
                'grade': student.grade,
                'address': student.address,
                'contact_number': student.contact_number,
            }
            students_data.append(student_dict)
        return jsonify(students_data), 200
    else:
        return jsonify({"message": "No students found"}), 404
    

    
def get_student(id):
    student = Student.objects(id=id).first()
    if student:
        return jsonify(student)
    else:
        return jsonify({"error": "Student not found"}), 404

def update_student(id):
    data = request.json
    student = Student.objects(id=id).first()
    if student:
        student.update(**data)
        return jsonify(student)
    else:
        return jsonify({"message": "Student updated successfully"}), 200

def delete_student(id):
    student = Student.objects(id=id).first()
    if student:
        student.delete()
        return jsonify({"message": "Student deleted successfully"})
    else:
        return jsonify({"error": "Student not found"}), 404
