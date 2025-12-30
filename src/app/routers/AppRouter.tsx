import { Route, Routes } from "react-router";
import { ProtectedRoute } from "../providers/";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<>Home</>} />
        <Route path="/dashboard" element={<>Dashboard</>} />
      </Route>
      <Route path="/login" element={<>Login</>} />
    </Routes>
  );
};
