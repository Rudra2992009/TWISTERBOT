# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

# --- Configuration ---
app = Flask(__name__)

# IMPORTANT: Enable CORS (Cross-Origin Resource Sharing)
# This allows your client-side JS (e.g., running on http://localhost:4000 or a static domain)
# to make requests to this API (running on http://localhost:5000).
# In production, set 'origins' to your specific static site domain for security.
CORS(app, resources={r"/api/twisterbot/*": {"origins": "*"}}) 

# Define where to store the chat history (in the same directory)
HISTORY_FILE = 'twisterbot_v_history.jsonl' # JSON Lines format for appendability

# --- Endpoint: Save Message (POST) ---
@app.route('/api/twisterbot/save_message', methods=['POST'])
def save_message():
    """ 
    Receives a message object (sender, message) from the JavaScript frontend 
    and appends it to the history file.
    """
    data = request.get_json(silent=True)
    if not data or not all(k in data for k in ['sender', 'message']):
        return jsonify({"error": "Invalid request payload. Requires 'sender' and 'message'."}), 400

    # Sanitize and prepare history entry
    history_entry = {
        'sender': data['sender'],
        'message': data['message'],
        'timestamp': data.get('timestamp', datetime.utcnow().isoformat()),
        'app': 'Twisterbot V'
    }

    try:
        # Append the new entry to the JSON Lines file
        with open(HISTORY_FILE, 'a', encoding='utf-8') as f:
            f.write(json.dumps(history_entry) + '\n')
        
        return jsonify({"status": "success", "saved": True}), 201

    except IOError as e:
        app.logger.error(f"Twisterbot V History Save Failed: {e}")
        return jsonify({"error": "Server persistence layer failure."}), 500

# --- Endpoint: Fetch History (GET) ---
@app.route('/api/twisterbot/history', methods=['GET'])
def get_history():
    """ Retrieves the full chat history from the file. """
    try:
        if not os.path.exists(HISTORY_FILE):
            return jsonify([]), 200

        history = []
        # Read the file line by line
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                # Parse each line as a JSON object
                history.append(json.loads(line))
        
        return jsonify(history), 200
    except Exception as e:
        app.logger.error(f"Twisterbot V History Fetch Failed: {e}")
        return jsonify({"error": "Could not retrieve history."}), 500

# --- Server Execution ---
if __name__ == '__main__':
    # Initial setup: ensure the history file exists
    if not os.path.exists(HISTORY_FILE):
        try:
            open(HISTORY_FILE, 'w', encoding='utf-8').close()
        except IOError as e:
            print(f"CRITICAL ERROR: Could not create history file {HISTORY_FILE}. {e}")
            exit(1)
        
    print("-----------------------------------------------------")
    print("🚀 Twisterbot V API Running...")
    print("Backend URL: http://127.0.0.1:5000")
    print("History File:", HISTORY_FILE)
    print("-----------------------------------------------------")
    # Run the server on port 5000 (standard for Flask development)
    app.run(debug=True, port=5000)
