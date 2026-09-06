import {
  api,
  PASSWORD_RESET_CONFIRM_URL,
  PASSWORD_RESET_REQUEST_URL,
  PASSWORD_RESET_VERIFY_URL,
} from "@/shared/api";

export type RequestResetCodeDTO = { username: string };
export type RequestResetCodeResponse = { retryAfterSeconds: number };

export type VerifyResetCodeDTO = { username: string; code: string };
export type VerifyResetCodeResponse = { resetToken: string };

export type ResetPasswordDTO = { resetToken: string; password: string };

export function requestResetCodeApi(dto: RequestResetCodeDTO) {
  return api.post<RequestResetCodeResponse>(PASSWORD_RESET_REQUEST_URL, dto);
}

export function verifyResetCodeApi(dto: VerifyResetCodeDTO) {
  return api.post<VerifyResetCodeResponse>(PASSWORD_RESET_VERIFY_URL, dto);
}

export function resetPasswordApi(dto: ResetPasswordDTO) {
  return api.post(PASSWORD_RESET_CONFIRM_URL, dto);
}
