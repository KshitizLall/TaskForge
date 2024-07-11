const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

async function getDashboardOverview(req, res) {
  try {
    const userId = req.user.userId;

    const projects = await Project.find({ user: userId });

    const tasks = await Task.find({
      project: { $in: projects.map((p) => p._id) },
      user: userId,
    });

    const taskSummary = {
      notStarted: 0,
      onProgress: 0,
      completed: 0,
    };

    let totalCompletedTasks = 0;
    let totalCompletionTime = 0;
    let upcomingDeadlines = [];

    tasks.forEach((task) => {
      if (task.status === "Not Started") {
        taskSummary.notStarted += 1;
      } else if (task.status === "On Progress") {
        taskSummary.onProgress += 1;
      } else if (task.status === "Completed") {
        taskSummary.completed += 1;
        totalCompletedTasks += 1;
        totalCompletionTime +=
          new Date(task.updatedAt) - new Date(task.createdAt);
      }

      // Check for upcoming deadlines (within 7 days)
      const deadlineDate = new Date(task.deadline);
      const currentDate = new Date();
      const diffTime = Math.abs(deadlineDate - currentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7 && task.status !== "Completed") {
        upcomingDeadlines.push({
          taskId: task._id,
          title: task.title,
          deadline: task.deadline,
        });
      }
    });

    // Number of tasks per project with project names
    const tasksPerProject = {};
    projects.forEach((project) => {
      const projectName = project.title;
      tasksPerProject[projectName] = tasks.filter((task) =>
        task.project.equals(project._id)
      ).length;
    });

    // Number of pending points per project with project names
    const pendingPointsPerProject = {};
    projects.forEach((project) => {
      const projectName = project.title;
      pendingPointsPerProject[projectName] = tasks
        .filter((task) => task.project.equals(project._id))
        .reduce((acc, task) => acc + task.calculatePendingPoints(), 0);
    });

    // Calculate average task completion time
    const avgCompletionTime = totalCompletedTasks
      ? totalCompletionTime / totalCompletedTasks
      : 0;

    // Recent activities
    const recentActivities = tasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
      .map((task) => ({
        taskId: task._id,
        title: task.title,
        status: task.status,
        updatedAt: task.updatedAt,
      }));

    const overview = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalCompletedTasks,
      taskSummary,
      tasksPerProject,
      pendingPointsPerProject,
      overallProgress: {
        notStarted: taskSummary.notStarted,
        onProgress: taskSummary.onProgress,
        completed: taskSummary.completed,
      },
      upcomingDeadlines,
      avgCompletionTime,
      recentActivities,
    };

    res.status(200).json(overview);
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getDashboardOverview,
};
