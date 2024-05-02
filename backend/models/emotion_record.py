from mongoengine import Document, ReferenceField, DateTimeField, StringField
from models.student import Student

class EmotionRecord(Document):
    student = ReferenceField(Student, required=True)
    date = DateTimeField(required=True)
    emotional_status = StringField(required=True, choices=('happy', 'disgust','sad', 'angry','fear','surprise','neutral'), default='neutral')
