import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../api/login";
import { setToken } from "@/shared/lib/storage";
import { userKeys } from "@/entities/user/api/me";

export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      setToken(data.data.access_token);

      // بعد از لاگین، me رو دوباره می‌گیریم
      await qc.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}
