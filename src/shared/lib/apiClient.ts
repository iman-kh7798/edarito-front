import axios from "axios";
import { baseUrl, timeout } from "../configs";

export const api = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
});

export function setupAxios() {
  api.defaults.headers.Accept = "application/json";
  // axios.interceptors.request.use(
  //   (config: { headers: { Authorization: string } }) => {
  //     const auth = getAuth();
  //     if (auth) {
  //       config.headers.Authorization = `${auth}`;
  //     }
  //     return config;
  //   },
  //   (err: any) => Promise.reject(err)
  // );
}
