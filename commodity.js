// ... (start of file)
// Define the base path for Netlify Functions. 
const NETLIFY_FUNCTION_BASE_PATH = '/.netlify/functions';

export async function saveTwisterbotMessage({ sender, message }) {
    // ...
    // Target: /.netlify/functions/save_message
    const response = await fetch(`${NETLIFY_FUNCTION_BASE_PATH}/save_message`, {
    // ...
}

export async function fetchTwisterbotHistory() {
    // ...
    // Target: /.netlify/functions/history
    const response = await fetch(`${NETLIFY_FUNCTION_BASE_PATH}/history`, {
    // ...
}
