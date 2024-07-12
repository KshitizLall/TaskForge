import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Remove as RemoveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from 'framer-motion';

const getChipColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Pending":
      return "default";
    default:
      return "default";
  }
};

const TaskCard = ({
  task,
  projects,
  handleDecrementPoints,
  handleIncrementPoints,
  handleEdit,
  handleDelete,
}) => {
  const projectTitle =
    projects.find((p) => p._id === task.project)?.title || "N/A";
  const progressValue = (task.dailyPoints / task.totalPoints) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "5px",
          border: "1px solid #BDBDBD",
          boxShadow: "none",
          position: "relative",
        }}
      >
        <Box
          sx={{
            background: "#001D87",
            color: "#FFFFFF",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            fontWeight: 600,
            p: 1,
            textAlign: "center",
          }}
        >
          Project: {projectTitle}
        </Box>
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
            value={progressValue}
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
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(progressValue)}%`}
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
          <Tooltip title={task.title}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {task.title}
            </Typography>
          </Tooltip>
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={task.status}
              color={getChipColor(task.status)}
              size="small"
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
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
            <IconButton size="small" onClick={() => handleDelete(task._id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
