/**
 * useAddToDB — custom hook for POST operations.
 *
 * Design: wraps fetch() so callers get a consistent Promise interface.
 * Returns a Promise that resolves with the server response, allowing
 * callers to chain .then() for toast notifications and refreshTrigger increments.
 *
 * @param {string} apiUrl  - Full API endpoint URL
 * @param {object} data    - Payload to POST (JSON-serialised internally)
 * @returns {Promise}
 */
import { apiBaseUrl, postJson } from '../api';

const useAddToDB = (apiUrl, data) => {
    const endpoint = apiUrl.startsWith(apiBaseUrl) ? apiUrl.slice(apiBaseUrl.length) : apiUrl;
    return postJson(endpoint, data);
};

export default useAddToDB;