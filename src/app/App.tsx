import { BrowserRouter } from "react-router";

import { setupAxios } from "@/shared/lib";

import { MainLayout } from "./layouts/main-layout";
import { QueryProvider } from "./providers";
import { AppRouter } from "./routers";

import "@/shared/styles/globals.css";

setupAxios();
function App() {
  return (
    <QueryProvider>
      <MainLayout>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </MainLayout>
    </QueryProvider>
  );
}

export default App;
