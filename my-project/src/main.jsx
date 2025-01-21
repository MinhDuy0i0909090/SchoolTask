import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AntDProvider from "./ant-config.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AntDProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </AntDProvider>
    </QueryClientProvider>
  </StrictMode>
);
