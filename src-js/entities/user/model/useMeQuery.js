import { useQuery } from "@tanstack/react-query";

import { getToken } from "@/shared/lib/storage";

import { getMeApi, userKeys } from "../api/me";

export function useMeQuery() {
  const token = getToken();

  return useQuery({
    queryKey: userKeys.me,
    queryFn: getMeApi,
    enabled: !!token, // فقط وقتی توکن داریم
    staleTime: 60_000, // 1 دقیقه
    retry: 0,
  });
}
