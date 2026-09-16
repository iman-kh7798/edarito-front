import { api, LOGOUT_URL } from "@/shared/api";

export function logoutApi(refresh: string) {
  return api.post(LOGOUT_URL, { refresh });
}
