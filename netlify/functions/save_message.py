# TWISTERBOT/netlify/functions/save_message.py
import json
import os
from datetime import datetime

# Get the history file path from the environment, defaulting to the static filename
HISTORY_FILE = os.environ.get('HISTORY_FILE_PATH', 'twisterbot_v_history.jsonl') 

def handler(event, context):
    """
    Netlify function handler for saving a chat message (POST request).
    
    NOTE: File-based persistence in a serverless environment is VOLATILE.
    This function simulates a successful save. For production, replace this
    logic with a call to a dedicated database (e.g., FaunaDB, DynamoDB).
    """
    
    if event['httpMethod'] != 'POST':
        return {'statusCode': 405, 'body': json.dumps({'error': 'Method Not Allowed'})}
    
    try:
        data = json.loads(event['body'])
        
        if not all(k in data for k in ['sender', 'message']):
            return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid payload. Requires sender and message.'})}

        history_entry = {
            'sender': data['sender'],
            'message': data['message'],
            'timestamp': data.get('timestamp', datetime.utcnow().isoformat()),
            'app': 'Twisterbot V (Netlify)'
        }

        print(f"Simulated save (requires DB for persistence): {history_entry['sender']} - {history_entry['message']}")
        
        return {
            'statusCode': 201,
            'body': json.dumps({'status': 'success', 'saved': True, 'warning': 'Persistence is simulated.'}),
            'headers': { 'Access-Control-Allow-Origin': '*' }
        }

    except Exception as e:
        print("Error saving message:", e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Serverless function error: {str(e)}'}),
            'headers': { 'Access-Control-Allow-Origin': '*' }
        }
