import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.ts";
import PersistAuth from "./components/Auth/PersistAuth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PersistAuth>
          <App />
        </PersistAuth>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
