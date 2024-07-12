import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";

const TaskSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Grid container spacing={2} alignItems="center" mb={3}>
      <Grid item>
        <Skeleton variant="rectangular" width={150} height={40} />
      </Grid>
      <Grid item>
        <Skeleton variant="rectangular" width={150} height={40} />
      </Grid>
    </Grid>
    <Grid container spacing={3}>
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default TaskSkeleton;
