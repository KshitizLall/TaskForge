import {
  Alert,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import qs from "qs";

const SignupPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    gender: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users",
        qs.stringify(formData),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      console.log("Success:", response.data);
      setSuccessMessage("Signup successful");
      setErrorMessage("");
    } catch (error) {
      console.error("Error:", error.response.data.error);
      setErrorMessage("Error signing up");
      setSuccessMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" gutterBottom>
        Sign Up
      </Typography>
      {successMessage && (
        <Alert
          severity="success"
          style={{ marginBottom: "10px" }}
          onClose={() => setSuccessMessage("")}
          open={Boolean(successMessage)}
        >
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          severity="error"
          style={{ marginBottom: "10px" }}
          onClose={() => setErrorMessage("")}
          open={Boolean(errorMessage)}
        >
          {errorMessage}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          sx={{ m: 2 }}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Sign Up
        </Button>
      </form>
      <Typography variant="body1" align="center" style={{ marginTop: "20px" }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </Typography>
    </Container>
  );
};

export default SignupPage;
