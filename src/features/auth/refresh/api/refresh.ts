import axios from "axios";

import { REFRESH_URL } from "@/shared/api";
import { baseUrl, timeout } from "@/shared/configs";
import { getRefreshToken } from "@/shared/lib";

export type RefreshResponse = { access: string; refresh: string };

export async function refreshApi() {
  return axios.post<RefreshResponse>(
    REFRESH_URL,
    { refresh: getRefreshToken() },
    { baseURL: baseUrl, timeout }
  );
}
