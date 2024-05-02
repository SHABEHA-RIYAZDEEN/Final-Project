# emotion_record_routes.py
from flask import Blueprint, request
from controllers.emotion_record_controller import create_emotion_record, get_emotion_record, update_emotion_record, delete_emotion_record,get_all_emotion_records

emotion_record_bp = Blueprint('emotion_record_blueprint', __name__)

@emotion_record_bp.route('/emotion_records', methods=['POST'])
def create():
    data = request.get_json()
    return create_emotion_record(data['student_id'], data['date'], data['emotional_status'])

@emotion_record_bp.route('/emotion_records/all', methods=['GET'])
def get_all():
    return get_all_emotion_records()

@emotion_record_bp.route('/emotion_records/<record_id>', methods=['GET'])
def read(record_id):
    return get_emotion_record(record_id)

@emotion_record_bp.route('/emotion_records/<record_id>', methods=['PUT'])
def update(record_id):
    emotional_status = request.get_json().get('emotional_status')
    return update_emotion_record(record_id, emotional_status)

@emotion_record_bp.route('/emotion_records/<record_id>', methods=['DELETE'])
def delete(record_id):
    return delete_emotion_record(record_id)
