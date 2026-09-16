import { type UserDTO } from "@/entities/user";
import { api, LOGIN_URL } from "@/shared/api";

export type LoginDTO = { username: string; password: string };
export type LoginResponse = { access: string; refresh: string; user: UserDTO };

export async function loginApi(dto: LoginDTO) {
  return api.post<LoginResponse>(LOGIN_URL, dto);
}
