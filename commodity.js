/**
 * @fileoverview commodity.js
 * Twisterbot V Communication Layer. Handles all asynchronous AJAX interactions
 * with the Python Flask Backend API (app.py) for persistence and data retrieval.
 */

// Define the base URL for the Python API. 
// This must match the Flask server's address and the base path defined in app.py.
const API_BASE_URL = 'http://localhost:5000/api/twisterbot';

/**
 * Sends a single chat message (user or AI response) to the Python backend for saving.
 * * @param {object} messageData - Object containing message details.
 * @param {string} messageData.sender - The source of the message ('user' or 'ai').
 * @param {string} messageData.message - The message text content.
 * @returns {Promise<boolean>} Resolves to true on successful save, false otherwise.
 */
export async function saveTwisterbotMessage({ sender, message }) {
    if (!sender || !message) {
        console.error("Twisterbot Commodity Error: Sender and message are required for saving.");
        return false;
    }
    
    const payload = {
        sender: sender,
        message: message,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/save_message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Message saved successfully (201 Created)
            return true;
        } else {
            // Handle HTTP errors (e.g., 400 Bad Request, 500 Server Error)
            const errorData = await response.json().catch(() => ({ error: 'Unknown API Error' }));
            console.error(`Twisterbot Backend Save Failed (${response.status}):`, errorData.error);
            return false;
        }
    } catch (error) {
        // Handle network errors (e.g., Python server is not running)
        console.error("Twisterbot Network Error: Could not connect to Python backend. Is app.py running on port 5000?", error);
        return false;
    }
}


/**
 * Retrieves the entire chat history from the Python backend.
 * * @returns {Promise<Array<{sender: string, message: string, timestamp: string}>>} 
 * An array of message objects, or an empty array on failure/no history.
 */
export async function fetchTwisterbotHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Parse the JSON array of history objects
            const history = await response.json();
            return history;
        } else {
            console.error(`Twisterbot Backend Fetch Failed (${response.status}): Could not retrieve history.`);
            return [];
        }
    } catch (error) {
        console.error("Twisterbot Network Error: Could not connect to Python backend for history retrieval.", error);
        return [];
    }
}

// --- Future Communication Layers (Examples) ---
// If you decided to add user authentication or a server-side LLM, 
// you would add new functions here:

/*
export async function authenticateUser(credentials) {
    // Logic to POST login credentials to a /login endpoint in app.py
}

// Example for WebSockets if real-time streaming was needed
export function setupWebSocket(onMessageReceived) {
    const ws = new WebSocket('ws://localhost:5000/ws/chat');
    ws.onmessage = onMessageReceived;
    return ws;
}
*/
