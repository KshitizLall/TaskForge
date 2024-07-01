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
import { useSelector } from "react-redux";
import { toast } from "sonner";
import "./Dashboard.css";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const token = Cookies.get("token");
  const { firstName, lastName, role } = useSelector((state) => state.user);

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
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Welcome Back,&nbsp;
              <span className="dashboard_name_highlighter">
                {firstName} {lastName}
              </span>
            </Typography>
            <Typography variant="subtitle" gutterBottom>
              {role}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={3} sx={{ mt: 1 }}></Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
