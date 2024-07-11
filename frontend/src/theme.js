import { createTheme } from "@mui/material/styles";

export const themeOptions = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0037ff",
    },
    secondary: {
      main: "#7600ff",
    },
    warning: {
      main: "#ffc478",
    },
    error: {
      main: "#ff1200",
    },
    success: {
      main: "#96ff99",
    },
    info: {
      main: "#96deff",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    fontSize: 12,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: "#0037ff",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#0026cc",
          },
        },
        outlinedPrimary: {
          borderColor: "#0037ff",
          color: "#0037ff",
          "&:hover": {
            backgroundColor: "rgba(0, 55, 255, 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          fontSize: "0.875rem",
          backgroundColor: "#333333",
        },
        arrow: {
          color: "#333333",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: "1rem",
        },
      },
    },
  },
});
