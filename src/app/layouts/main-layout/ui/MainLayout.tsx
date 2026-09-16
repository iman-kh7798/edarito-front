import { Outlet } from "react-router";

import { Sidebar } from "@/widgets/sidebar";

export const MainLayout = () => {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <main className="min-h-dvh md:ms-20">
        <Outlet />
      </main>
    </div>
  );
};
