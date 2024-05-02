from flask import Blueprint
from controllers.ml_controller import upload_photo, perform_training, make_prediction

ml_blueprint = Blueprint('ml_blueprint', __name__)

# Create routes with the blueprint
ml_blueprint.route('/upload/<student_id>', methods=['POST'])(upload_photo)
ml_blueprint.route('/train', methods=['POST'])(perform_training)
ml_blueprint.route('/predict', methods=['POST'])(make_prediction)
