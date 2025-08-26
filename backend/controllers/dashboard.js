const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

async function getDashboardOverview(req, res) {
  try {
    const userId = req.user.id; // Updated to match JWT payload

    const projects = await Project.find({ user: userId });

    const tasks = await Task.find({
      project: { $in: projects.map((p) => p._id) },
      user: userId,
      isDeleted: { $ne: true },
    });

    const taskSummary = {
      new: 0,
      "in-progress": 0,
      completed: 0,
    };

    let totalCompletedTasks = 0;
    let totalCompletionTime = 0;
    let upcomingDeadlines = [];

    tasks.forEach((task) => {
      if (task.status === "new") {
        taskSummary.new += 1;
      } else if (task.status === "in-progress") {
        taskSummary["in-progress"] += 1;
      } else if (task.status === "completed") {
        taskSummary.completed += 1;
        totalCompletedTasks += 1;
        if (task.completedAt) {
          totalCompletionTime +=
            new Date(task.completedAt) - new Date(task.createdAt);
        }
      }

      // Check for upcoming deadlines (within 7 days)
      if (task.dueDate) {
        const deadlineDate = new Date(task.dueDate);
        const currentDate = new Date();
        const diffTime = deadlineDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7 && diffDays >= 0 && task.status !== "completed") {
          upcomingDeadlines.push({
            taskId: task._id,
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
            projectName:
              projects.find((p) => p._id.equals(task.project))?.name ||
              "Unknown",
          });
        }
      }
    });

    // Number of tasks per project with project names
    const tasksPerProject = {};
    projects.forEach((project) => {
      const projectName = project.name;
      tasksPerProject[projectName] = tasks.filter((task) =>
        task.project.equals(project._id)
      ).length;
    });

    // Progress per project
    const progressPerProject = {};
    projects.forEach((project) => {
      const projectName = project.name;
      const projectTasks = tasks.filter((task) =>
        task.project.equals(project._id)
      );
      const completedTasks = projectTasks.filter(
        (task) => task.status === "completed"
      ).length;
      progressPerProject[projectName] = {
        total: projectTasks.length,
        completed: completedTasks,
        percentage:
          projectTasks.length > 0
            ? Math.round((completedTasks / projectTasks.length) * 100)
            : 0,
      };
    });

    // Calculate average task completion time in days
    const avgCompletionTime = totalCompletedTasks
      ? Math.round(
          totalCompletionTime / (totalCompletedTasks * 1000 * 60 * 60 * 24)
        )
      : 0;

    // Recent activities from audit trails
    const recentActivities = [];
    tasks.forEach((task) => {
      if (task.auditTrail && task.auditTrail.length > 0) {
        task.auditTrail.slice(-3).forEach((audit) => {
          recentActivities.push({
            taskId: task._id,
            taskTitle: task.title,
            action: audit.action,
            timestamp: audit.timestamp,
            userName: audit.userName,
          });
        });
      }
    });

    // Sort by timestamp and get latest 10
    recentActivities.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const overview = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalCompletedTasks,
      taskSummary,
      tasksPerProject,
      progressPerProject,
      overallProgress: {
        new: taskSummary.new,
        inProgress: taskSummary["in-progress"],
        completed: taskSummary.completed,
        percentage:
          tasks.length > 0
            ? Math.round((taskSummary.completed / tasks.length) * 100)
            : 0,
      },
      upcomingDeadlines: upcomingDeadlines.slice(0, 5), // Limit to 5 most urgent
      avgCompletionTime,
      recentActivities: recentActivities.slice(0, 10),
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
