import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./reset.css";
import "./variables.css";
import "./main.css";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";
import { PopupProvider } from "./contexts/PopupContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PopupProvider>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </PopupProvider>
  </StrictMode>
);
