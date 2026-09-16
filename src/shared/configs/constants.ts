// Proxied to the Django backend by vite.config.ts in dev; same relative
// path works in prod when both are served behind one reverse proxy.
export const baseUrl = "/api";
export const timeout = 30000;
