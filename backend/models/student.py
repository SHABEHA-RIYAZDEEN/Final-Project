from mongoengine import Document, StringField, DateField

class Student(Document):
    name = StringField(required=True)
    date_of_birth = DateField(required=True)
    grade = StringField(required=True)
    address = StringField(required=True)
    contact_number = StringField(required=True)
