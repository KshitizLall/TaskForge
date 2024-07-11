import {
  Add as AddIcon,
  Edit as EditIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const Task = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const token = Cookies.get("token");
  const { projectId } = useParams();

  const incrementTimeout = useRef({});
  const decrementTimeout = useRef({});

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks${
          projectId ? `?projectId=${projectId}` : ""
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedTasks = response.data.map((task) => ({
        ...task,
        status: getTaskStatus(task),
      }));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_LOCAL_HOST}/api/projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(response.data);
      if (projectId) {
        setSelectedProjectId(projectId);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects");
    }
  };

  const getTaskStatus = (task) => {
    if (task.dailyPoints === 0) {
      return "Not Started";
    } else if (task.dailyPoints > 0 && task.dailyPoints < task.totalPoints) {
      return "In Progress";
    } else if (task.dailyPoints >= task.totalPoints) {
      return "Completed";
    }
    return "";
  };

  const getChipColor = (status) => {
    switch (status) {
      case "Not Started":
        return "default";
      case "In Progress":
        return "warning";
      case "Completed":
        return "success";
      default:
        return "default";
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setTotalPoints(0);
    setDailyPoints(0);
    setSelectedProjectId(projectId || "");
    setError(null);
    setEditingTask(null);
  };

  const handleCreate = async () => {
    try {
      if (editingTask) {
        await axios.patch(
          `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks/${editingTask._id}`,
          {
            title,
            description,
            totalPoints,
            dailyPoints,
            projectId: selectedProjectId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks`,
          { title, description, projectId: selectedProjectId, totalPoints },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task created successfully");
      }
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error("Error creating/updating task:", error);
      setError("Failed to create/update task. Please try again.");
      toast.error("Error creating/updating task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setTotalPoints(task.totalPoints);
    setDailyPoints(task.dailyPoints);
    setSelectedProjectId(task.project);
    setOpen(true);
  };

  const handleIncrementPoints = (taskId) => {
    const task = tasks.find((task) => task._id === taskId);
    if (task) {
      const updatedTasks = tasks.map((t) =>
        t._id === taskId ? { ...t, dailyPoints: t.dailyPoints + 1 } : t
      );
      setTasks(updatedTasks);

      if (incrementTimeout.current[taskId]) {
        clearTimeout(incrementTimeout.current[taskId]);
      }

      incrementTimeout.current[taskId] = setTimeout(async () => {
        try {
          await axios.patch(
            `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks/${taskId}`,
            {
              title: task.title,
              description: task.description,
              totalPoints: task.totalPoints,
              dailyPoints: task.dailyPoints + 1,
              projectId: task.project,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchTasks();
        } catch (error) {
          console.error("Error updating task:", error);
          toast.error("Error updating task");
        }
      }, 300);
    }
  };

  const handleDecrementPoints = (taskId) => {
    const task = tasks.find((task) => task._id === taskId);
    if (task && task.dailyPoints > 0) {
      const updatedTasks = tasks.map((t) =>
        t._id === taskId ? { ...t, dailyPoints: t.dailyPoints - 1 } : t
      );
      setTasks(updatedTasks);

      if (decrementTimeout.current[taskId]) {
        clearTimeout(decrementTimeout.current[taskId]);
      }

      decrementTimeout.current[taskId] = setTimeout(async () => {
        try {
          await axios.patch(
            `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks/${taskId}`,
            {
              title: task.title,
              description: task.description,
              totalPoints: task.totalPoints,
              dailyPoints: task.dailyPoints - 1,
              projectId: task.project,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchTasks();
        } catch (error) {
          console.error("Error updating task:", error);
          toast.error("Error updating task");
        }
      }, 300);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<AddIcon />}
          >
            Create Task
          </Button>
        </Grid>
        <Grid item>
          <Chip
            label={`Total Tasks: ${tasks.length}`}
            color="secondary"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingTask ? "Edit Task" : "Create New Task"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the task details.</DialogContentText>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Total Points"
            type="number"
            fullWidth
            value={totalPoints}
            onChange={(e) => setTotalPoints(Number(e.target.value))}
          />
          {editingTask && (
            <TextField
              margin="dense"
              label="Daily Points"
              type="number"
              fullWidth
              value={dailyPoints}
              onChange={(e) => setDailyPoints(Number(e.target.value))}
            />
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" variant="contained">
            {editingTask ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id} sx={{ mb: 5 }}>
            <Box
              sx={{
                background: "#001D87",
                color: "#FFFFFF",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                fontWeight: 600,
                p: 1,
              }}
            >
              Project:{" "}
              {projects.find((p) => p._id === task.project)?.title || "N/A"}
            </Box>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 60,
                  height: 60,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={(task.dailyPoints / task.totalPoints) * 100}
                  size={60}
                  thickness={4}
                  sx={{
                    color: "#08D504",
                    backgroundColor: "grey.200",
                    borderRadius: "50%",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                  >
                    {`${Math.round(
                      (task.dailyPoints / task.totalPoints) * 100
                    )}%`}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    flexGrow: 1,
                    pr: 9,
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {task.description}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={task.status}
                    color={getChipColor(task.status)}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "space-between", p: 2, pt: 0 }}
              >
                <Box display="flex" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => handleDecrementPoints(task._id)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {task.dailyPoints} / {task.totalPoints}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleIncrementPoints(task._id)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleEdit(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(task._id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
