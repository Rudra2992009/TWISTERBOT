# TWISTERBOT/netlify/functions/history.py
import json
import os

# Get the history file path from the environment, defaulting to the static filename
HISTORY_FILE = os.environ.get('HISTORY_FILE_PATH', 'twisterbot_v_history.jsonl') 

def handler(event, context):
    """
    Netlify function handler for fetching chat history (GET request).
    This reads the static file committed in the repository.
    """
    history = []
    
    try:
        # Check if the static history file exists
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                for line in f:
                    history.append(json.loads(line))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  # Crucial for CORS
            },
            'body': json.dumps(history)
        }
    except Exception as e:
        print("Error fetching history:", e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Could not retrieve history: {str(e)}'}),
            'headers': { 'Access-Control-Allow-Origin': '*' }
        }
