import cv2
import numpy as np
import os
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from tensorflow.keras.models import Model
from sklearn.metrics import classification_report, confusion_matrix
from joblib import dump
import pickle
from scipy import ndimage

# Load VGG16 model for feature extraction
base_model = VGG16(weights='imagenet', include_top=False)
model = Model(inputs=base_model.input, outputs=base_model.get_layer('block5_pool').output)

# Image preprocessing and feature extraction
def adjust_image(image):
    image = cv2.resize(image, (224, 224))  # Resize image to match VGG16 input
    image_array = img_to_array(image)
    image_array = preprocess_input(image_array)
    image_array = np.expand_dims(image_array, axis=0)
    features = model.predict(image_array)
    return features.flatten()

# Generate embeddings
def generate_embeddings(images_directory,count):
    vector_embeddings = []
    categories = []
    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    for folder_name in os.listdir(images_directory):
        if not folder_name.startswith('.'):
            folder_path = os.path.join(images_directory, folder_name)
            image_files = os.listdir(folder_path)[:count]  # Process only first 50 images per folder
            for image_file in image_files:
                image = cv2.imread(os.path.join(folder_path, image_file))

                # Skip the step of converting to grayscale if images are already grayscale
                # gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

                detected_faces = face_detector.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
                for (x, y, w, h) in detected_faces:
                    face_image = image[y:y+h, x:x+w]
                    adjusted_image = adjust_image(face_image)
                    vector_embeddings.append(adjusted_image)
                    categories.append(folder_name)
                    # Rotate images for augmentation
                    for angle in [90, 180, 270]:
                        rotated_image = ndimage.rotate(face_image, angle)
                        adjusted_rotated_image = adjust_image(rotated_image)
                        vector_embeddings.append(adjusted_rotated_image)
                        categories.append(folder_name)
    return vector_embeddings, categories

# SVM training
def model_training(X_train, y_train):
    classifier = SVC(C=1.0, kernel='linear', probability=True)
    classifier.fit(X_train, y_train)
    return classifier

def execute(image_count=10):
    images_path = 'MLmodel/dataset' 
    embeddings, categories = generate_embeddings(images_path,image_count)

    # Data split
    X_train, X_temp, y_train, y_temp = train_test_split(embeddings, categories, test_size=0.2, random_state=42)
    X_validate, X_test, y_validate, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

    # Encode labels
    label_encoder = LabelEncoder()
    y_train_encoded = label_encoder.fit_transform(y_train)
    y_validate_encoded = label_encoder.transform(y_validate)
    y_test_encoded = label_encoder.transform(y_test)

    # Model training
    classifier = model_training(X_train, y_train_encoded)

    # Model evaluation
    validation_predictions = classifier.predict(X_validate)
    print("Validation Metrics:")
    print(classification_report(y_validate_encoded, validation_predictions))
    print("Validation Confusion Matrix:")
    print(confusion_matrix(y_validate_encoded, validation_predictions))

    # Test evaluation
    test_predictions = classifier.predict(X_test)
    print("Test Metrics:")
    print(classification_report(y_test_encoded, test_predictions))
    print("Test Confusion Matrix:")
    print(confusion_matrix(y_test_encoded, test_predictions))

    # Save the model and encoder
    dump(classifier, 'MLmodel/face_emotion_model.joblib')
    with open('MLmodel/label_encoder.pickle', 'wb') as f:
        pickle.dump(label_encoder, f)


