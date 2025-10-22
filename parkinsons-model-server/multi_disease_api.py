import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. SETUP ---
app = Flask(__name__)
# Enable CORS for communication between Next.js (port 3000) and Flask (port 5000)
CORS(app) 

# --- 2. LOAD ALL MODELS AND SCALERS ---
MODELS = {}
SCALERS = {}

# Define all required file pairs
FILES_TO_LOAD = {
    'parkinsons': ('parkinsons_model.pkl', 'parkinsons_scaler.pkl'),
    'diabetes': ('diabetes_model.pkl', 'diabetes_scaler.pkl'),
    'heart': ('heart_model.pkl', 'heart_scaler.pkl'),
}

def load_assets():
    """Loads all models and scalers into global dictionaries."""
    all_loaded = True
    print("--- Loading ML Assets ---")
    for name, (model_file, scaler_file) in FILES_TO_LOAD.items():
        try:
            with open(model_file, 'rb') as f:
                MODELS[name] = pickle.load(f)
            with open(scaler_file, 'rb') as f:
                SCALERS[name] = pickle.load(f)
            print(f"✅ {name.capitalize()} Model and Scaler loaded successfully.")
        except FileNotFoundError:
            print(f"❌ ERROR: Missing files for {name.capitalize()}: {model_file} or {scaler_file} not found.")
            all_loaded = False
        except Exception as e:
            print(f"❌ ERROR loading {name.capitalize()} assets: {e}")
            all_loaded = False
            
    print("-------------------------")
    return all_loaded

load_assets()


# --- 3. FEATURE MAPPINGS (Critical for consistent data input) ---

# Features for Parkinson's (22 total)
PARKINSONS_KEY_MAP = {
    'mdvpFo': 'MDVP:Fo(Hz)', 'mdvpFhi': 'MDVP:Fhi(Hz)', 'mdvpFlo': 'MDVP:Flo(Hz)', 
    'mdvpJitterPercent': 'MDVP:Jitter(%)', 'mdvpJitterAbs': 'MDVP:Jitter(Abs)', 
    'mdvpRAP': 'MDVP:RAP', 'mdvpPPQ': 'MDVP:PPQ', 'jitterDDP': 'Jitter:DDP',
    'shimmer': 'MDVP:Shimmer', 'shimmerDB': 'MDVP:Shimmer(dB)', 'shimmerAPQ3': 'Shimmer:APQ3',
    'shimmerAPQ5': 'Shimmer:APQ5', 'shimmerAPQ': 'MDVP:APQ', 'shimmerDDA': 'Shimmer:DDA',
    'nhr': 'NHR', 'hnr': 'HNR', 'rpde': 'RPDE', 'dfa': 'DFA', 
    'spread1': 'spread1', 'spread2': 'spread2', 'd2': 'D2', 'ppe': 'PPE'
}

# Features for Diabetes (8 total)
DIABETES_KEY_MAP = {
    'pregnancies': 'Pregnancies', 'glucose': 'Glucose', 'bloodPressure': 'BloodPressure',
    'skinThickness': 'SkinThickness', 'insulin': 'Insulin', 'bmi': 'BMI',
    'diabetesPedigree': 'DiabetesPedigreeFunction', 'age': 'Age'
}

# Features for Heart Disease (11 total)
HEART_KEY_MAP = {
    'age': 'age', 'sex': 'sex', 'chestPainType': 'chest pain type', 
    'restingBP': 'resting bp s', 'cholesterol': 'cholesterol', 'fastingBS': 'fasting blood sugar', 
    'restingECG': 'resting ecg', 'maxHR': 'max heart rate', 'exerciseAngina': 'exercise angina', 
    'oldpeak': 'oldpeak', 'stSlope': 'ST slope'
}


# --- 4. PREDICTION LOGIC (A single function for modularity) ---

def make_prediction(model_key, data):
    """General function to validate input, scale, and predict."""
    model = MODELS.get(model_key)
    scaler = SCALERS.get(model_key)
    key_map = globals()[f'{model_key.upper()}_KEY_MAP'] # Get the right key map

    if not model or not scaler:
        return {'error': f'{model_key.capitalize()} model/scaler not loaded'}, 500

    # 1. Extract and order the feature values using the defined key map
    feature_values = []
    for fe_key in key_map:
        value = data.get(fe_key)
        if value is None:
            return {'error': f'Missing feature: {fe_key}'}, 400
        # Ensure the value is converted to a float (or int for non-float fields if necessary, 
        # but float handles all cases)
        feature_values.append(float(value)) 
        
    # 2. Convert to NumPy array (1 row, N columns)
    input_data_as_numpy_array = np.asarray(feature_values).reshape(1, -1)
    
    # 3. Standardize the input data
    std_data = scaler.transform(input_data_as_numpy_array)
    
    # 4. Make the prediction (returns 0 or 1)
    prediction = model.predict(std_data)
    
    return {'prediction': int(prediction[0])}, 200


# --- 5. ENDPOINTS ---

@app.route('/predict/<disease_name>', methods=['POST'])
def predict_disease(disease_name):
    """Dynamic endpoint to handle predictions for all diseases."""
    disease_name = disease_name.lower()
    
    if disease_name not in FILES_TO_LOAD:
        return jsonify({'error': f'Unknown disease: {disease_name}'}), 404

    try:
        data = request.get_json(force=True)
        
        # Use the generic prediction function
        result, status_code = make_prediction(disease_name, data)
        
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({'error': f'Internal Server Error: {str(e)}'}), 500


# --- 6. RUN THE APP (REMOVED FOR PRODUCTION) ---

# Call load_assets here so the models/scalers are loaded
# when the Gunicorn server imports the app object.
if not load_assets():
    # If loading fails, you might want to log an error or raise an exception
    import sys
    sys.exit("Error loading one or more ML assets. Cannot start the server.")
    
# The app object (app = Flask(__name__)) is now ready for Gunicorn. 
# The deployment service will handle running the app using Gunicorn.