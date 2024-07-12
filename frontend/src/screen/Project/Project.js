import {
  Add as AddIcon,
} from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProjectCard from "../../component/Card/ProjectCard";
import CircularProgressWithLabel from "../../component/CircularProgress/CircularProgressWithLabel";

export const Project = () => {
  const [open, setOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
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
    setCurrentProjectId(projectId);
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
          <Box
            display="flex"
            flexWrap="wrap"
            gap="16px"
            justifyContent="center"
          >
            {tasks.map((task) => (
              <CircularProgressWithLabel
                key={task._id}
                value={(task.dailyPoints / task.totalPoints) * 100}
                title={task.title}
                color="#0037ff"
              />
            ))}
          </Box>
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
            <ProjectCard
              project={project}
              handleOpenTasks={handleOpenTasks}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
