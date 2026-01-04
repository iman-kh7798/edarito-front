import axios from "axios";
import { baseUrl, timeout } from "../configs";
import { clearToken, getToken, setToken } from "../lib/storage";
import { refreshApi } from "@/features/auth/refresh/api/refresh";

export const api = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
});

// TODO: refresh token

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
      if (err?.response?.status === 401) {
        try {
          const data = await refreshApi();
          setToken(data.data.access_token);
        } catch (err) {
          console.log(err);
          clearToken();
        }
      }
      return Promise.reject(err);
    }
  );
}
