import { Route, Routes } from "react-router";

import { Dashboard } from "@/pages/dashboard";
import { Home } from "@/pages/home";
import { Login } from "@/pages/login";

import { MainLayout } from "../layouts/main-layout";
import { ProtectedRoute } from "../providers/";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
