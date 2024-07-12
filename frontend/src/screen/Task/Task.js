// Task.jsx
import { Add as AddIcon } from "@mui/icons-material";
import {
  Button,
  Chip,
  Grid
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import TaskDialog from "../../component/Task/TaskDialog";
import TaskList from "../../component/Task/TaskList";
import TaskSkeleton from "../../component/Task/TaskSkeleton";

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
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("token");
  const { projectId } = useParams();

  const incrementTimeout = useRef({});
  const decrementTimeout = useRef({});

  useEffect(() => {
    fetchTasks();
    fetchProjects();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_LOCAL_HOST}/api/tasks${projectId ? `?projectId=${projectId}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
          { title, description, totalPoints, dailyPoints, projectId: selectedProjectId },
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
        { headers: { Authorization: `Bearer ${token}` } }
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
            { title: task.title, description: task.description, totalPoints: task.totalPoints, dailyPoints: task.dailyPoints + 1, projectId: task.project },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchTasks();
        } catch (error) {
          console.error("Error updating task:", error);
          toast.error("Error updating task");
        }
      }, 1000);
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
            { title: task.title, description: task.description, totalPoints: task.totalPoints, dailyPoints: task.dailyPoints - 1, projectId: task.project },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchTasks();
        } catch (error) {
          console.error("Error updating task:", error);
          toast.error("Error updating task");
        }
      }, 1000);
    }
  };

  if (isLoading) {
    return <TaskSkeleton />;
  }

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

      <TaskDialog
        open={open}
        handleClose={handleClose}
        handleCreate={handleCreate}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        totalPoints={totalPoints}
        setTotalPoints={setTotalPoints}
        dailyPoints={dailyPoints}
        setDailyPoints={setDailyPoints}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projects={projects}
        editingTask={editingTask}
        error={error}
      />

      <TaskList
        tasks={tasks}
        projects={projects}
        handleDecrementPoints={handleDecrementPoints}
        handleIncrementPoints={handleIncrementPoints}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};
