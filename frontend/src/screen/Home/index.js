import React from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Grid container spacing={3}>
        {/* Task Creation Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom>
              Create Task
            </Typography>
            {/* Your task creation components (e.g., form inputs) go here */}
          </Paper>
        </Grid>
        {/* Graphs and Visual Representations Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom>
              Graphs and Visualizations
            </Typography>
            {/* Your graphs and visual representation components go here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
