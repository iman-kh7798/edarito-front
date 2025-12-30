// src/features/auth/logout/model/useLogout.ts
import { useQueryClient } from "@tanstack/react-query";
import { clearToken } from "@/shared/lib/storage";
import { userKeys } from "@/entities/user/api/me";
import { useNavigate } from "react-router";

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
