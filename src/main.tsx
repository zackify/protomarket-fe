import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmi";
import { AppContextProvider } from "./contexts/AppContext";
import App from "./components/App";
import "./main.css";
import "./assets/fonts/fonts.css";
const queryClient = new QueryClient();

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
