import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/dashboard/overview",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOverview(response.data);
      } catch (error) {
        console.error("Error fetching dashboard overview:", error);
        toast.error("Failed to fetch dashboard data");
      }
    };

    fetchOverview();
  }, [token]);

  if (!overview) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#f0f4c3" }}>
              <CardContent>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="h3">{overview.totalProjects}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#b2ebf2" }}>
              <CardContent>
                <Typography variant="h6">Total Tasks</Typography>
                <Typography variant="h3">{overview.totalTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#ffe0b2" }}>
              <CardContent>
                <Typography variant="h6">Average Completion Time</Typography>
                <Typography variant="h5">
                  {Math.round(
                    overview.avgCompletionTime / (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#dcedc8" }}>
              <CardContent>
                <Typography variant="h6">Task Summary</Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Not Started"
                      secondary={overview.taskSummary.notStarted}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="On Progress"
                      secondary={overview.taskSummary.onProgress}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Completed"
                      secondary={overview.taskSummary.completed}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#f8bbd0" }}>
              <CardContent>
                <Typography variant="h6">Upcoming Deadlines</Typography>
                <List>
                  {overview.upcomingDeadlines.map((deadline) => (
                    <ListItem key={deadline.taskId}>
                      <ListItemText
                        primary={deadline.title}
                        secondary={`Due: ${new Date(
                          deadline.deadline
                        ).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ bgcolor: "#c5cae9" }}>
              <CardContent>
                <Typography variant="h6">Recent Activities</Typography>
                <List>
                  {overview.recentActivities.map((activity) => (
                    <ListItem key={activity.taskId}>
                      <ListItemText
                        primary={activity.title}
                        secondary={`Status: ${
                          activity.status
                        } - Updated: ${new Date(
                          activity.updatedAt
                        ).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
