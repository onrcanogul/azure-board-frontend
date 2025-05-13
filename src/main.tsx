import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { PbiProvider } from "./context/PbiContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <PbiProvider>
        <App />
      </PbiProvider>
    </HashRouter>
  </StrictMode>
);
