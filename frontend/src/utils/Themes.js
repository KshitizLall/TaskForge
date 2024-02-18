import { createTheme } from "@mui/material/styles";

const themeOptions = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3b2e9e",
    },
    secondary: {
      main: "#3e56ad",
    },
    success: {
      main: "#73ff7a",
      dark: "#58dc61",
    },
    info: {
      main: "#52a6d4",
    },
    text: {
      hint: "#2a1973",
    },
  },
  typography: {
    fontFamily: "Convergence",
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
    typography: {
      fontFamily: "Nunito",
      h1: {
        fontFamily: "Convergence",
        fontSize: "6rem",
      },
    },
  },
});

export default themeOptions;
