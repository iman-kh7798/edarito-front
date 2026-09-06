import { BrowserRouter } from "react-router";

import { setupAxios } from "@/shared/api";

import { MainLayout } from "./layouts/main-layout";
import { QueryProvider } from "./providers";
import { AppRouter } from "./routers";

import "@/shared/styles";

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
