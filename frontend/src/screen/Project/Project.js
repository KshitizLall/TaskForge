import {
  Add as AddIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const Project = () => {
  const [open, setOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  useEffect(() => {
    fetchProjects();
  }, [token, userId]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_LOCAL_HOST}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects");
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks?projectId=${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setError(null);
    setEditingProject(null);
  };

  const handleTaskClose = () => {
    setTaskOpen(false);
    setTasks([]);
  };

  const handleCreate = async () => {
    if (editingProject) {
      // UPDATE PROJECT
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API_LOCAL_HOST}/api/projects/${editingProject._id}`,
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Project updated successfully");
        setProjects(
          projects.map((project) =>
            project._id === editingProject._id ? response.data : project
          )
        );
        handleClose();
      } catch (error) {
        toast.error("Error updating project");
        setError("Failed to update project. Please try again.");
      }
    } else {
      // CREATE NEW PROJECT
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_LOCAL_HOST}/api/projects`,
          { title, description, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Project created successfully");
        setProjects([...projects, response.data.project]);
        handleClose();
      } catch (error) {
        toast.error("Error creating project");
        setError("Failed to create project. Please try again.");
      }
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_LOCAL_HOST}/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(projects.filter((project) => project._id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Error deleting project");
      console.error("Error deleting project:", error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setOpen(true);
  };

  const handleOpenTasks = async (projectId) => {
    await fetchTasks(projectId);
    setTaskOpen(true);
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create Project
          </Button>
        </Grid>
        <Grid item>
          <Chip
            label={`Total Projects: ${projects.length}`}
            color="secondary"
            variant="outlined"
          />
        </Grid>
      </Grid>
      {/* CREATE OR EDIT PROJECT */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingProject ? "Edit Project" : "Create New Project"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the project.
          </DialogContentText>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Project Description"
            type="text"
            fullWidth
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" variant="contained">
            {editingProject ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* VIEW TASK UNDER PROJECTS */}
      <Dialog
        open={taskOpen}
        onClose={handleTaskClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="body1"
            sx={{
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
            }}
          >
            Project <ArrowForwardIcon /> Tasks
          </Typography>
        </DialogTitle>
        <DialogContent>
          {tasks.map((task) => (
            <Box key={task._id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{task.title}</Typography>
              <LinearProgress
                variant="determinate"
                value={(task.dailyPoints / task.totalPoints) * 100}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} mt={1}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
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
              Project: {project.title}
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
              <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
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
                  Description: {project.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created at: {new Date(project.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "space-between", p: 2, pt: 0 }}
              >
                <Box>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleOpenTasks(project._id)}
                    startIcon={<AssignmentIcon />}
                  >
                    View Tasks
                  </Button>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(project)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(project._id)}
                  >
                    <DeleteIcon />
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
