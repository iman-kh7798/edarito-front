// Real endpoints from ../edarito-backend (see docs/backend-api-reference.md).
export const LOGIN_URL = "/auth/login/";
export const REFRESH_URL = "/auth/refresh/";
export const LOGOUT_URL = "/auth/logout/";
export const INFO_URL = "/auth/me/";

// The backend has no self-service password-recovery endpoints yet (only an
// authenticated change-password and an admin-only reset). These paths are a
// proposed contract, not something the backend implements today — see
// docs/backend-needs.md. Calls against them will 404 until that's built.
export const PASSWORD_RESET_REQUEST_URL = "/auth/password/reset/request/";
export const PASSWORD_RESET_VERIFY_URL = "/auth/password/reset/verify/";
export const PASSWORD_RESET_CONFIRM_URL = "/auth/password/reset/confirm/";
