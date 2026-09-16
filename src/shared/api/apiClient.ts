import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { baseUrl, timeout } from "../configs";
import {
  clearToken,
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from "../lib/storage";

import { REFRESH_URL } from "./routes";

// SimpleJWT rotates the refresh token on every use (ROTATE_REFRESH_TOKENS,
// see ../edarito-backend config/settings/base.py) and blacklists the old
// one, so a successful refresh must persist both tokens it returns.
type RefreshResponse = { access: string; refresh: string };
type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: baseUrl,
  timeout,
});

const refreshClient = axios.create({
  baseURL: baseUrl,
  timeout,
});

let refreshRequest: Promise<AxiosResponse<RefreshResponse>> | null = null;

function requestFreshToken() {
  refreshRequest ??= refreshClient
    .post<RefreshResponse>(REFRESH_URL, { refresh: getRefreshToken() })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

export function setupAxios() {
  api.defaults.headers.Accept = "application/json";

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetriableRequestConfig
        | undefined;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url === REFRESH_URL ||
        !getRefreshToken()
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { data } = await requestFreshToken();
        setToken(data.access);
        setRefreshToken(data.refresh);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearToken();
        return Promise.reject(refreshError);
      }
    }
  );
}
