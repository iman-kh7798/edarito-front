import { api } from "@/shared/api/apiClient";
import type { User } from "../model/types";
import { INFO_URL } from "@/shared/api/routes";

export const userKeys = {
  me: ["user", "me"] as const,
};

export async function getMeApi() {
  return api.get<User>(INFO_URL);
}
