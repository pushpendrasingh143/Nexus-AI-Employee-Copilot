import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import createAppTheme from "./theme";

const ThemeModeContext = createContext(null);

const getInitialMode = () => {
  const savedMode = localStorage.getItem("nexus_theme_mode");

  return savedMode === "dark" ? "dark" : "light";
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error(
      "useThemeMode must be used inside ThemeModeProvider"
    );
  }

  return context;
};

const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  const theme = useMemo(
    () => createAppTheme(mode),
    [mode]
  );

  useEffect(() => {
    localStorage.setItem("nexus_theme_mode", mode);

    document.documentElement.setAttribute(
      "data-theme",
      mode
    );

    document.body.classList.toggle(
      "dark-mode",
      mode === "dark"
    );
  }, [mode]);

  const toggleMode = () => {
    setMode((currentMode) =>
      currentMode === "dark" ? "light" : "dark"
    );
  };

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;