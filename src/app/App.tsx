import { BrowserRouter } from "react-router";

import { setupAxios } from "@/shared/api";

import { QueryProvider } from "./providers";
import { AppRouter } from "./routers";

import "@/shared/styles";

setupAxios();
function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
