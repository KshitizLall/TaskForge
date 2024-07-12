import React from "react";
import { Grid } from "@mui/material";
import TaskCard from "./TaskCard";

const TaskList = ({
  tasks,
  projects,
  handleDecrementPoints,
  handleIncrementPoints,
  handleEdit,
  handleDelete
}) => (
  <Grid container spacing={3}>
    {tasks.map((task) => (
      <Grid item xs={12} sm={6} md={4} key={task._id}>
        <TaskCard
          key={task._id}
          task={task}
          projects={projects}
          handleDecrementPoints={handleDecrementPoints}
          handleIncrementPoints={handleIncrementPoints}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Grid>
    ))}
  </Grid>
);

export default TaskList;
