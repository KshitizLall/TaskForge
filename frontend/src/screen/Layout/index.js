import * as React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import Dashboard from "../Home";

function Layout() {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Dashboard />
        {/* Your main content goes here */}
      </Container>
    </React.Fragment>
  );
}

export default Layout;
