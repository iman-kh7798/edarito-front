// src/features/auth/logout/model/useLogout.ts
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { userKeys } from "@/entities/user";
import { clearToken } from "@/shared/lib/storage";

export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return () => {
    clearToken();
    qc.removeQueries({ queryKey: userKeys.me }); // empty me
    qc.clear(); // empty whole cache
    navigate("/login");
  };
}
