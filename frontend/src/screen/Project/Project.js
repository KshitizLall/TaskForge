import React, { useState, useEffect } from "react";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";

export const Project = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const token = Cookies.get("token");
  const userId = Cookies.get("userId"); // Assuming user ID is stored in cookies

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId, // Pass user ID as a query parameter
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [token, userId]);

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

  const handleCreate = async () => {
    if (editingProject) {
      // Update project
      try {
        const response = await axios.patch(
          `http://localhost:3001/api/projects/${editingProject._id}`,
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
      // Create new project
      try {
        const response = await axios.post(
          "http://localhost:3001/api/projects",
          { title, description, userId }, // Include user ID in the request body
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
      await axios.delete(`http://localhost:3001/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button onClick={handleClickOpen}>
            <AddIcon />
            Create
          </Button>
        </Grid>
        <Grid item>
          <Chip label={`Total Projects: ${projects.length}`} color="primary" />
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} sx={{ p: 5, m: 4 }}>
        <DialogTitle>
          {editingProject ? "Edit Project" : "Create New Project"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Please enter the details of the project.
          </DialogContentText>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TextField
            autoFocus
            margin="dense"
            id="project-name"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="project-description"
            label="Project Description"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
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

      <Grid container spacing={2} mt={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                border: "1px solid #BDBDBD",
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    height: "7.5em",
                    lineHeight: "1.5em",
                    overflowY: "auto",
                  }}
                >
                  {project.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created at: {new Date(project.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Open
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(project._id)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(project)}
                >
                  <EditIcon sx={{ color: "#000000" }} />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
