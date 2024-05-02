# emotion_record_controller.py
from models.emotion_record import EmotionRecord
from models.student import Student
from mongoengine import DoesNotExist, ValidationError
from flask import jsonify

def create_emotion_record(student_id, date, emotional_status):
    try:
        student = Student.objects.get(id=student_id)
        emotion_record = EmotionRecord(
            student=student,
            date=date,
            emotional_status=emotional_status
        )
        emotion_record.save()
        return jsonify(emotion_record), 201
    except DoesNotExist:
        return jsonify({"error": "Student not found"}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    
def get_all_emotion_records():
    try:
        # Retrieve all emotion records from the database
        records = EmotionRecord.objects.all()

        # Convert emotion records to JSON format
        records_json = jsonify(records)

        # Return the JSON response
        return records_json, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_emotion_record(record_id):
    try:
        record = EmotionRecord.objects.get(id=record_id)
        return jsonify(record), 200
    except DoesNotExist:
        return jsonify({"error": "Record not found"}), 404

def update_emotion_record(record_id, emotional_status):
    try:
        record = EmotionRecord.objects.get(id=record_id)
        record.update(emotional_status=emotional_status)
        return jsonify({"message": "Record updated successfully"}), 200
    except DoesNotExist:
        return jsonify({"error": "Record not found"}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

def delete_emotion_record(record_id):
    try:
        record = EmotionRecord.objects.get(id=record_id)
        record.delete()
        return jsonify({"message": "Record deleted successfully"}), 200
    except DoesNotExist:
        return jsonify({"error": "Record not found"}), 404
