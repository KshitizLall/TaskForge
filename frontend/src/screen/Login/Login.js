import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Container,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/slice/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      Cookies.remove("token"); // Clear the token cookie
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        formData
      );
      toast.success("Login successful");
      const expires = formData.rememberMe ? 7 : 1;
      Cookies.set("token", response.data.token, { expires });

      // Dispatch user data to the Redux store
      const { first_name, last_name, role, gender } = response.data.user;
      dispatch(
        setUser({ firstName: first_name, lastName: last_name, role, gender })
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Invalid username or password");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/register");
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Typography variant="h6">☺️</Typography>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Task Forge
        </Typography>
        <Typography variant="h6">Your task management solution</Typography>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              border: `0.5px solid ${theme.palette.primary.main}`,
              p: 5,
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Box textAlign="center" mb={2}>
              <Typography variant="h4" component="h1">
                Login
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                    }
                    label="Remember Me for 7 days"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleSignupRedirect}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
