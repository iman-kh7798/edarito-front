import { useMeQuery } from "@/entities/user";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const { data: me, isLoading, isError } = useMeQuery();

  //TODO: add loader here
  if (isLoading) return null;
  if (isError || !me?.data) return <Navigate to="/login" replace />;
  return <Outlet />;
}
