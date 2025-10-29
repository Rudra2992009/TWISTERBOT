/**
 * @fileoverview commodity.js
 * Twisterbot V Communication Layer. Handles all asynchronous AJAX interactions
 * with the Serverless Python Backend (Netlify Functions) for persistence.
 */

// Define the base path for Netlify Functions. 
// Netlify automatically routes requests from the browser to your deployed function.
// The file names (history.py, save_message.py) become the endpoint names.
const NETLIFY_FUNCTION_BASE_PATH = '/.netlify/functions';

/**
 * Sends a single chat message (user or AI response) to the Netlify function for saving.
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
        // Target: /.netlify/functions/save_message
        const response = await fetch(`${NETLIFY_FUNCTION_BASE_PATH}/save_message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Message saved successfully (201 Created)
            console.warn("Netlify Function: Persistence is simulated (file saving in Lambda is volatile).");
            return true;
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown API Error' }));
            console.error(`Twisterbot Backend Save Failed (${response.status}):`, errorData.error);
            return false;
        }
    } catch (error) {
        console.error("Twisterbot Network Error: Could not reach Netlify function.", error);
        return false;
    }
}


/**
 * Retrieves the full chat history from the Netlify function.
 * * @returns {Promise<Array<{sender: string, message: string, timestamp: string}>>} 
 * An array of message objects, or an empty array on failure/no history.
 */
export async function fetchTwisterbotHistory() {
    try {
        // Target: /.netlify/functions/history
        const response = await fetch(`${NETLIFY_FUNCTION_BASE_PATH}/history`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            const history = await response.json();
            return history;
        } else {
            console.error(`Twisterbot Backend Fetch Failed (${response.status}): Could not retrieve history.`);
            return [];
        }
    } catch (error) {
        console.error("Twisterbot Network Error: Could not reach Netlify function for history retrieval.", error);
        return [];
    }
}

// Ensure you replace the old commodity.js file content with this new code.
