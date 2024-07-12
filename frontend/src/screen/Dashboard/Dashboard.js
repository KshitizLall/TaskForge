import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Skeleton,
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchOverview())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching dashboard overview:", error);
        toast.error("Failed to fetch dashboard data");
      });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (isLoading || status === "loading") {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}
      >
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="text" width={200} height={30} />
        <Grid container spacing={3}>
          {Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                <Skeleton variant="circular" width={40} height={40} />
                <CardContent>
                  <Skeleton variant="text" width={140} height={30} />
                  <Skeleton variant="text" width={60} height={40} />
                </CardContent>
              </Card>
            </Grid>
          ))}
          {Array.from(new Array(2)).map((_, index) => (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  border: "1px solid #BDBDBD",
                  boxShadow: "none",
                }}
              >
                <Skeleton variant="text" width={160} height={30} />
                <Skeleton variant="rectangular" height={300} />
              </Card>
            </Grid>
          ))}
          {Array.from(new Array(2)).map((_, index) => (
            <Grid item xs={12} sm={12} md={6} key={index}>
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
                <Skeleton variant="text" width={160} height={30} />
                <Skeleton variant="rectangular" height={300} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
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
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}
    >
      <Box component="main" sx={{ flexGrow: 1, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome Back,{" "}
          <span style={{ color: "#0037ff", fontWeight: "bold" }}>
            {firstName} {lastName}
          </span>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {role}
        </Typography>
      </Box>
      <Grid container spacing={3}>
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
            <Avatar sx={{ bgcolor: "#0037ff", mr: 2 }}>
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
            <Avatar sx={{ bgcolor: "#7600ff", mr: 2 }}>
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
            <Avatar sx={{ bgcolor: "#ffc478", mr: 2 }}>
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
            <Avatar sx={{ bgcolor: "#96ff99", mr: 2 }}>
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
        <Grid item xs={12} sm={12} md={6}>
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
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
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
                    <Typography
                      variant="subtitle1"
                      sx={{ textOverflow: "ellipsis" }}
                    >
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
  );
};

export default Dashboard;
