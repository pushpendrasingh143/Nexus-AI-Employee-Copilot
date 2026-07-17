import { createTheme } from "@mui/material/styles";

const createAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: "#4F46E5",
      },

      secondary: {
        main: "#06B6D4",
      },

      background: {
        default: mode === "dark" ? "#0F172A" : "#F8FAFC",
        paper: mode === "dark" ? "#1E293B" : "#FFFFFF",
      },

      text: {
        primary: mode === "dark" ? "#F8FAFC" : "#0F172A",
        secondary: mode === "dark" ? "#CBD5E1" : "#64748B",
      },

      divider: mode === "dark" ? "#334155" : "#E2E8F0",
    },

    shape: {
      borderRadius: 12,
    },

    typography: {
      fontFamily: "'Inter', sans-serif",

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 600,
      },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor:
              mode === "dark" ? "#0F172A" : "#F8FAFC",

            color:
              mode === "dark" ? "#F8FAFC" : "#0F172A",

            transition:
              "background-color 0.25s ease, color 0.25s ease",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

export default createAppTheme;