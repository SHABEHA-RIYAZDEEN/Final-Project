from flask import Blueprint
from controllers.student_controller import create_student, get_student, update_student, delete_student,get_all_students

student_blueprint = Blueprint('student_blueprint', __name__)

# Create routes with the blueprint
student_blueprint.route('/create', methods=['POST'])(create_student)
student_blueprint.route('/get/<id>', methods=['GET'])(get_student)
student_blueprint.route('/update/<id>', methods=['PUT'])(update_student)
student_blueprint.route('/delete/<id>', methods=['DELETE'])(delete_student)
student_blueprint.route('/all', methods=['GET'])(get_all_students) 