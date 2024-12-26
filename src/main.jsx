import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./reset.css";
import "./variables.css";
import "./main.css";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </StrictMode>
);
