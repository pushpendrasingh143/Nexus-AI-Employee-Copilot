import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import ThemeModeProvider from "./theme/ThemeModeProvider";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeModeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#111827",
              color: "#FFFFFF",
            },
          }}
        />

        <App />
      </BrowserRouter>
    </ThemeModeProvider>
  </StrictMode>
);