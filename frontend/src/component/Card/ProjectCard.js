import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { motion } from 'framer-motion';

const ProjectCard = ({
  project,
  handleOpenTasks,
  handleEdit,
  handleDelete,
}) => {
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
          Project: {project.title}
        </Box>
        <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
          <Tooltip title={project.description}>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                flexGrow: 1,
                pr: 9,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              Description: {project.description}
            </Typography>
          </Tooltip>
          <Typography variant="caption" color="text.secondary">
            Created at: {new Date(project.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
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
    </motion.div>
  );
};

export default ProjectCard;
