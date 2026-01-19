import { api } from "@/shared/api/apiClient";
import { INFO_URL } from "@/shared/api/routes";

import type { User } from "../model/types";

export const userKeys = {
  me: ["user", "me"] as const,
};

export async function getMeApi() {
  return api.get<User>(INFO_URL);
}
