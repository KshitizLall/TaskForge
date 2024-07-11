import { ThemeProvider } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import MiniDrawer from "./component/Drawer/MiniDrawer";
import Login from "./screen/Login/Login";
import Register from "./screen/Register/Register";
import { themeOptions } from "./theme";
import store from "./Redux/store";
import { Provider } from "react-redux";

function App() {
  const token = Cookies.get("token");

  return (
    <>
      <ThemeProvider theme={themeOptions}>
        <Provider store={store}>
          <Router>
            <Toaster position="top-right" richColors />
            <Routes>
              <Route
                path="/"
                element={
                  token ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/register" />
                  )
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={token ? <MiniDrawer /> : <Navigate to="/login" />}
              />
            </Routes>
          </Router>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
