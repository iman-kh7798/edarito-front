import { api, LOGIN_URL } from "@/shared/api";

export type LoginDTO = { email: string; password: string };
export type LoginResponse = { access_token: string };

export async function loginApi(dto: LoginDTO) {
  return api.post<LoginResponse>(LOGIN_URL, dto);
}
