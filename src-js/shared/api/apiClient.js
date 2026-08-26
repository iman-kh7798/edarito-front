import axios from "axios";

import { baseUrl, timeout } from "../configs";
import { clearToken, getToken, setToken } from "../lib/storage";

/**
 * Axios instance configured with base URL and timeout.
 * @type {import('axios').AxiosInstance}
 */
export const api = axios.create({
  baseURL: baseUrl,
  timeout,
});

const REFRESH_URL = "/auth/refresh";

const refreshClient = axios.create({
  baseURL: baseUrl,
  timeout,
});

let refreshRequest = null;

function requestFreshToken() {
  refreshRequest ??= refreshClient.get(REFRESH_URL).finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

/**
 * Sets up Axios interceptors for request and response handling.
 * Adds authorization header to requests and handles token refresh on 401 errors.
 */
export function setupAxios() {
  api.defaults.headers.Accept = "application/json";

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (r) => r,
    async (err) => {
      const originalRequest = err.config;

      if (
        err?.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url === REFRESH_URL
      ) {
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      try {
        const { data } = await requestFreshToken();
        setToken(data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearToken();
        return Promise.reject(refreshError);
      }
    }
  );
}
