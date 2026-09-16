import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { userKeys } from "@/entities/user";
import { clearToken, getRefreshToken } from "@/shared/lib";

import { logoutApi } from "../api/logout";

export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return () => {
    const refresh = getRefreshToken();
    // Best-effort: blacklist server-side, but don't block clearing the
    // client session on it (the refresh token is discarded either way).
    if (refresh) logoutApi(refresh).catch(() => undefined);

    clearToken();
    qc.removeQueries({ queryKey: userKeys.me }); // empty me
    qc.clear(); // empty whole cache
    navigate("/login");
  };
}
