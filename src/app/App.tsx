import { BrowserRouter } from "react-router";
import { QueryProvider } from "./providers";
import "@/shared/styles/globals.css";
import { AppRouter } from "./routers";
import { setupAxios } from "@/shared/lib";
import { MainLayout } from "./layouts/main-layout";

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
