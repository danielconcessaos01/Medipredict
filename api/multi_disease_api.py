import pickle
import numpy as np
import os  # Required for path manipulation, though less used now
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. SETUP ---
app = Flask(__name__)
# Enable CORS for communication between your Next.js frontend and this API
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

# ❌ REMOVED: ASSETS_DIR = 'assets'

# --- 3. FEATURE MAPPING (Kept from previous revision) ---
# Define the exact, ordered list of JSON keys expected from the Next.js frontend 
DISEASE_JSON_KEYS = {
    'heart': [
        'age', 'sex', 'chestPainType', 'restingBP', 'cholesterol', 
        'fastingBS', 'restingECG', 'maxHR', 'exerciseAngina', 'oldpeak', 
        'slope' # Maps to 'ST slope'
    ],
    'parkinsons': [
        'mdvpFo', 'mdvpFhi', 'mdvpFlo', 'mdvpJitterPercent', 'mdvpJitterAbs', 
        'mdvpRAP', 'mdvpPPQ', 'jitterDDP', 'shimmer', 'shimmerDB', 
        'shimmerAPQ3', 'shimmerAPQ5', 'shimmerAPQ', 'shimmerDDA', 
        'nhr', 'hnr', 'rpde', 'dfa', 'spread1', 'spread2', 'd2', 'ppe'
    ],
    'diabetes': [
        'pregnancies', 'glucose', 'bloodPressure', 'skinThickness', 
        'insulin', 'bmi', 'diabetesPedigreeFunction', 'age'
    ]
}

def load_assets():
    """Loads all models and scalers into global dictionaries. Looks in the current directory."""
    all_loaded = True
    print("--- Loading ML Assets ---")
    for name, (model_file, scaler_file) in FILES_TO_LOAD.items():
        try:
            # ✅ FIX: Use the file names directly, assuming they are in the current directory
            model_path = model_file 
            scaler_path = scaler_file
            
            with open(model_path, 'rb') as f:
                MODELS[name] = pickle.load(f)
            with open(scaler_path, 'rb') as f:
                SCALERS[name] = pickle.load(f)
            print(f"✅ {name.capitalize()} Model and Scaler loaded successfully.")
        except FileNotFoundError:
            # Important: The files must be in the same folder as this script.
            print(f"❌ ERROR: Missing files for {name.capitalize()}: {model_file} or {scaler_file}")
            all_loaded = False
        except Exception as e:
            print(f"❌ ERROR loading {name.capitalize()} assets: {e}")
            all_loaded = False
            
    return all_loaded

# --- 4. HELPER FUNCTIONS ---

def get_model_and_scaler(disease_name):
    """Retrieves the model and scaler for the given disease."""
    model = MODELS.get(disease_name)
    scaler = SCALERS.get(disease_name)
    
    if not model or not scaler:
        # Attempt to reload assets if they are missing (robustness in serverless)
        if not load_assets():
             return None, None
        model = MODELS.get(disease_name)
        scaler = SCALERS.get(disease_name)
        if not model or not scaler:
             return None, None
             
    return model, scaler

def make_prediction(disease_name, input_data):
    """Generic function to scale input, predict, and return the result."""
    model, scaler = get_model_and_scaler(disease_name)
    
    if not model or not scaler:
        return {'error': f'Models for {disease_name.capitalize()} are not available on the server.'}, 500

    try:
        json_keys = DISEASE_JSON_KEYS[disease_name]
    except KeyError:
         return {'error': f'Internal Server Error: No key mapping found for {disease_name.capitalize()}.'}, 500


    feature_values = []

    # 1. Extract values from the JSON input in the correct order
    for json_key in json_keys:
        value = input_data.get(json_key)
        if value is None:
            # Report the missing key using the name expected by the frontend
            return {'error': f'Missing feature: {json_key}'}, 400
        
        try:
            # Ensure the value is converted to a float. Added error handling for non-numeric input.
            feature_values.append(float(value)) 
        except ValueError:
            return {'error': f'Invalid value for feature {json_key}. Expected a number.'}, 400
        
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
        # Vercel's serverless runtime ensures data loading before first request
        data = request.get_json(force=True)
        
        # Use the generic prediction function
        result, status_code = make_prediction(disease_name, data)
        
        return jsonify(result), status_code
        
    except Exception as e:
        # Catch unexpected errors during request handling
        return jsonify({'error': f'An internal server error occurred: {str(e)}'}), 500

# --- 6. INITIALIZATION FOR VERCEL ---
# Call load_assets here so the models/scalers are loaded 
# when the Vercel serverless function imports the 'app' object.
load_assets()