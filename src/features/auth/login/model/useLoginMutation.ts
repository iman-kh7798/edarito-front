import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { mapUserDto, userKeys } from "@/entities/user";
import { setRefreshToken, setToken } from "@/shared/lib";

import { loginApi } from "../api/login";

export function useLoginMutation() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      setToken(response.data.access);
      setRefreshToken(response.data.refresh);
      // Seed the cache with what login just returned instead of refetching.
      qc.setQueryData(userKeys.me, {
        ...response,
        data: mapUserDto(response.data.user),
      });
      navigate("/", { replace: true });
    },
  });
}
