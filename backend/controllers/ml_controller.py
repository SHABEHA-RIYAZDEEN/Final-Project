import os
import logging
from flask import jsonify, request
from MLmodel.ml_train import execute as execute_training
from MLmodel.ml_train import adjust_image as prepare_image
from joblib import load as load_model
import pickle
import cv2
import numpy as np
from PIL import Image
import uuid

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_STORAGE = 'MLmodel/dataset'
RECOGNITION_MODEL = 'MLmodel/face_emotion_model.joblib'
LABEL_ENCODER = 'MLmodel/label_encoder.pickle'
HAARCASCADE_PATH = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'

def upload_photo(student_id):
    logger.info(f"Uploading photo for student {student_id}")
    if 'file' not in request.files:
        logger.error("No file part")
        return jsonify({"error": "No file part"}), 400

    photo = request.files['file']

    if not photo or photo.filename == '':
        logger.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    try:
        # Ensure the directory exists or create it
        directory_path = os.path.join(DATA_STORAGE, str(student_id))
        os.makedirs(directory_path, exist_ok=True)

        # Limit files in the directory
        existing_files = os.listdir(directory_path)
        if len(existing_files) >= 10:
            # Remove files if there are 10 or more
            for existing_file in existing_files:
                os.remove(os.path.join(directory_path, existing_file))

        # Generate a unique filename using UUID
        unique_name = f"{uuid.uuid4()}.jpg"

        # Open and save the image
        photo_image = Image.open(photo.stream)
        file_path = os.path.join(directory_path, unique_name)
        photo_image.save(file_path, format='JPEG')

        logger.info(f"File uploaded successfully for student {student_id}")
        return jsonify({"message": "File uploaded successfully", "filename": unique_name}), 201
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        return jsonify({"error": "Could not process the uploaded file: " + str(e)}), 500

def perform_training():
    logger.info("Performing model training")
    try:
        count = int(request.json.get('count'))    
        execute_training(count)
        logger.info("Model trained successfully")
        return jsonify({"message": "Model trained successfully"}), 200
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        return jsonify({"error": str(e)}), 500

def retrieve_model_and_decoder():
    logger.info("Retrieving model and decoder")
    trained_model = None
    decoder = None
    try:
        trained_model = load_model(RECOGNITION_MODEL)
        with open(LABEL_ENCODER, 'rb') as file:
            decoder = pickle.load(file)
    except Exception as e:
        logger.error(f"Error loading model or encoder: {str(e)}")
    return trained_model, decoder

def make_prediction():
    logger.info("Making prediction")
    try:
        recognition_model, label_decoder = retrieve_model_and_decoder()

        if not recognition_model or not label_decoder:
            logger.error("Model or encoder not found")
            return jsonify({"error": "Model or encoder not found"}), 500

        photo = request.files['file']
        image = cv2.imdecode(np.frombuffer(photo.read(), np.uint8), cv2.IMREAD_COLOR)

        face_detector = cv2.CascadeClassifier(HAARCASCADE_PATH)
        image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        detected_faces = face_detector.detectMultiScale(image_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        identities = []
        for (x, y, width, height) in detected_faces:
            face_region = image[y:y+height, x:x+width]
            prepared_img = prepare_image(face_region)
            predicted_label = recognition_model.predict(prepared_img.flatten().reshape(1, -1))
            if predicted_label.size > 0:
                identity = label_decoder.inverse_transform(predicted_label)[0]
                identities.append(identity)

        if len(identities) == 0:
            logger.info("No valid emotion detected")
            return jsonify({"message": "No valid emotion detected"}), 200

        logger.info("Prediction made successfully")
        return jsonify({"emotion": identities}), 200

    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500