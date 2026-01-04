import { api } from "@/shared/api/apiClient";
import { REFRESH_URL } from "@/shared/api/routes";

export type RefreshResponse = { access_token: string };

export async function refreshApi() {
  return api.get<RefreshResponse>(REFRESH_URL);
}
