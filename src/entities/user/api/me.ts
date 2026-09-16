import { api, INFO_URL } from "@/shared/api";

import { mapUserDto, type UserDTO } from "./userDto";

export const userKeys = {
  me: ["user", "me"] as const,
};

export async function getMeApi() {
  const response = await api.get<UserDTO>(INFO_URL);
  return { ...response, data: mapUserDto(response.data) };
}
