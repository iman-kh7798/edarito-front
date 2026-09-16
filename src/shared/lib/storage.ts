const ACCESS_KEY = "edarito_access_token";
const REFRESH_KEY = "edarito_refresh_token";

export const getToken = () => localStorage.getItem(ACCESS_KEY);
export const setToken = (t: string) => localStorage.setItem(ACCESS_KEY, t);

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setRefreshToken = (t: string) =>
  localStorage.setItem(REFRESH_KEY, t);

export const clearToken = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
