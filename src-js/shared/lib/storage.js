// TODO: change this to your needs
const KEY = "access_token";

/**
 * Retrieves the access token from localStorage.
 * @returns {string|null} The stored token or null if not found.
 */
export const getToken = () => localStorage.getItem(KEY);

/**
 * Stores the access token in localStorage.
 * @param {string} t - The token to store.
 */
export const setToken = (t) => localStorage.setItem(KEY, t);

/**
 * Removes the access token from localStorage.
 */
export const clearToken = () => localStorage.removeItem(KEY);
