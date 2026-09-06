import { api, INFO_URL } from "@/shared/api";

import type { User } from "../model/types";

export const userKeys = {
  me: ["user", "me"] as const,
};

export async function getMeApi() {
  return api.get<User>(INFO_URL);
}
