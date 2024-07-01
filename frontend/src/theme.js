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
  },
  typography: {
    fontFamily: "Poppins",
    fontSize: 12,
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
});
