import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography
} from "@mui/material";

const TaskDialog = ({
  open,
  handleClose,
  handleCreate,
  title,
  setTitle,
  description,
  setDescription,
  totalPoints,
  setTotalPoints,
  dailyPoints,
  setDailyPoints,
  selectedProjectId,
  setSelectedProjectId,
  projects,
  editingTask,
  error
}) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>
      {editingTask ? "Edit Task" : "Create New Task"}
      <DialogContentText>Please enter the task details.</DialogContentText>
      {error && <Typography color="error">{error}</Typography>}
    </DialogTitle>
    <DialogContent>
      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel shrink>Project</InputLabel>
        <Select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          label="Project"
        >
          {projects.map((project) => (
            <MenuItem key={project._id} value={project._id}>
              {project.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        autoFocus
        margin="dense"
        label="Task Name"
        type="text"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
      />
      <TextField
        margin="dense"
        label="Task Description"
        type="text"
        fullWidth
        multiline
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
      />
      <TextField
        margin="dense"
        label="Total Points"
        type="number"
        fullWidth
        value={totalPoints}
        onChange={(e) => setTotalPoints(Number(e.target.value))}
        variant="outlined"
      />
      {editingTask && (
        <TextField
          margin="dense"
          label="Daily Points"
          type="number"
          fullWidth
          value={dailyPoints}
          onChange={(e) => setDailyPoints(Number(e.target.value))}
          variant="outlined"
        />
      )}
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
);

export default TaskDialog;
