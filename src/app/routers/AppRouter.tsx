import { Route, Routes } from "react-router";

import { Dashboard } from "@/pages/dashboard";
import { Home } from "@/pages/home";
import { Login } from "@/pages/login";

import { ProtectedRoute } from "../providers/";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
