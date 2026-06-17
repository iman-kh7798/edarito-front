import axios from "axios";

import { REFRESH_URL } from "@/shared/api/routes";
import { baseUrl, timeout } from "@/shared/configs";

export type RefreshResponse = { access_token: string };

export async function refreshApi() {
  return axios.get<RefreshResponse>(REFRESH_URL, {
    baseURL: baseUrl,
    timeout,
  });
}
