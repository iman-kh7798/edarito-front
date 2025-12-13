import { BrowserRouter } from "react-router";
import { QueryProvider } from "./providers";
import "./styles/global.css";
import { AppRouter } from "./routers";
import { setupAxios } from "@/shared/lib";

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
