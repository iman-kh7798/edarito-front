import axios from "axios";
import { baseUrl, timeout } from "../configs";
import { clearToken, getToken } from "../lib/storage";

export const api = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
});

export function setupAxios() {
  api.defaults.headers.Accept = "application/json";

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (r) => r,
    (err) => {
      if (err?.response?.status === 401) {
        clearToken();
      }
      return Promise.reject(err);
    }
  );
}
