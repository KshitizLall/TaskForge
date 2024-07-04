import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  List as ListIcon,
  PendingActions as PendingActionsIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Pie, Bar, Line } from "react-chartjs-2";
import { fetchOverview } from "../../Redux/slice/userSlice";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { overview, status, firstName, lastName, role, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchOverview())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching dashboard overview:", error);
        toast.error("Failed to fetch dashboard data");
      });
  }, [dispatch]);

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  if (!overview) {
    return <Typography variant="h6">No data available</Typography>;
  }

  const pieData = {
    labels: ["Not Started", "On Progress", "Completed"],
    datasets: [
      {
        label: "Tasks Status",
        data: [
          overview.taskSummary.notStarted,
          overview.taskSummary.onProgress,
          overview.taskSummary.completed,
        ],
        backgroundColor: ["#f44336", "#ff9800", "#4caf50"],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: Object.keys(overview.tasksPerProject),
    datasets: [
      {
        label: "Tasks under this Project",
        data: Object.values(overview.tasksPerProject),
        backgroundColor: "#2196f3",
      },
    ],
  };

  const lineData = {
    labels: overview.recentActivities.map(
      (activity) => activity.updatedAt.split("T")[0]
    ),
    datasets: [
      {
        label: "Average Completion Time",
        data: overview.recentActivities.map(
          (activity) => overview.avgCompletionTime
        ),
        borderColor: "#ff9800",
        fill: false,
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "default";
      case "On Progress":
        return "warning";
      case "Completed":
        return "success";
      default:
        return "default";
    }
  };

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
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <Avatar sx={{ bgcolor: "#2196f3", mr: 2 }}>
                <AssignmentIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="h4">{overview.totalProjects}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <Avatar sx={{ bgcolor: "#964CFF", mr: 2 }}>
                <ListIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h6">Total Tasks</Typography>
                <Typography variant="h4">{overview.totalTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
                <PendingActionsIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h6">Tasks in Progress</Typography>
                <Typography variant="h4">
                  {overview.taskSummary.onProgress}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <Avatar sx={{ bgcolor: "#4caf50", mr: 2 }}>
                <CheckCircleIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h6">Tasks Completed</Typography>
                <Typography variant="h4">
                  {overview.totalCompletedTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Overall Task Progress
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Tasks per Project
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
                height: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Average Completion Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={lineData}
                  options={{ maintainAspectRatio: false }}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
                height: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                {overview.recentActivities.map((activity) => (
                  <Box
                    key={activity.taskId}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <HistoryIcon sx={{ mr: 2 }} />
                      <Typography variant="subtitle1">
                        {activity.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{ mr: 1 }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {new Date(activity.updatedAt).toLocaleString()}
                      </Typography>
                      <Chip
                        label={activity.status}
                        color={getStatusColor(activity.status)}
                        size="small"
                        sx={{ borderRadius: 1, mr: 1 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
