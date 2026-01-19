import { Navigate, Outlet } from "react-router";

import { useMeQuery } from "@/entities/user";

export function ProtectedRoute() {
  const { data: me, isLoading, isError } = useMeQuery();

  //TODO: add loader here
  if (isLoading) return null;
  if (isError || !me?.data) return <Navigate to="/login" replace />;
  return <Outlet />;
}
