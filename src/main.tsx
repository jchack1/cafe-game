import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/indie-flower";
import { LevelProvider } from "./context/LevelContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LevelProvider>
      <App />
    </LevelProvider>
  </StrictMode>,
);
