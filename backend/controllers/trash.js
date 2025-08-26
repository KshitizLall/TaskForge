const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

// Helper functions to transform data
function transformProject(project) {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    color: project.color,
    status: project.status,
    priority: project.priority,
    dueDate: project.dueDate,
    progress: project.progress,
    tags: project.tags,
    notes: project.notes,
    userId: project.user,
    createdAt: project.createdAt,
    lastUpdated: project.updatedAt,
    isDeleted: project.isDeleted || false,
    deletedAt: project.deletedAt,
    type: "project",
  };
}

function transformTask(task) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    projectId: task.project,
    userId: task.user,
    subtasks: task.subtasks || [],
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    isDeleted: task.isDeleted || false,
    deletedAt: task.deletedAt,
    priority: task.priority,
    dueDate: task.dueDate,
    estimatedMinutes: task.estimatedMinutes,
    actualMinutes: task.actualMinutes,
    progress: task.progress,
    tags: task.tags || [],
    assignee: task.assignee || "",
    lastUpdated: task.updatedAt,
    auditTrail: task.auditTrail || [],
    type: "task",
  };
}

// Get all deleted items (both projects and tasks)
async function getAllDeletedItems(req, res) {
  try {
    const userId = req.user.id;

    // Get deleted projects
    const deletedProjects = await Project.find({
      user: userId,
      isDeleted: true,
    });

    // Get deleted tasks
    const deletedTasks = await Task.find({
      user: userId,
      isDeleted: true,
    }).populate("project", "name");

    // Transform and combine results
    const allDeletedItems = [
      ...deletedProjects.map(transformProject),
      ...deletedTasks.map(transformTask),
    ];

    // Sort by deletion date (most recent first)
    allDeletedItems.sort(
      (a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)
    );

    res.json({
      total: allDeletedItems.length,
      projects: deletedProjects.length,
      tasks: deletedTasks.length,
      items: allDeletedItems,
    });
  } catch (error) {
    console.error("Error fetching deleted items:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Restore an item (project or task)
async function restoreItem(req, res) {
  try {
    const userId = req.user.id;
    const { itemId, itemType } = req.params;

    let restoredItem;

    if (itemType === "project") {
      const project = await Project.findOne({
        _id: itemId,
        user: userId,
        isDeleted: true,
      });

      if (!project) {
        return res.status(404).json({ message: "Deleted project not found" });
      }

      // Restore the project
      project.isDeleted = false;
      project.deletedAt = null;
      await project.save();

      // Restore associated tasks
      await Task.updateMany(
        { project: itemId },
        {
          $unset: { isDeleted: 1, deletedAt: 1 },
        }
      );

      restoredItem = transformProject(project);
    } else if (itemType === "task") {
      const task = await Task.findOne({
        _id: itemId,
        user: userId,
        isDeleted: true,
      });

      if (!task) {
        return res.status(404).json({ message: "Deleted task not found" });
      }

      // Restore the task
      task.isDeleted = false;
      task.deletedAt = null;
      await task.save();

      restoredItem = transformTask(task);
    } else {
      return res.status(400).json({ message: "Invalid item type" });
    }

    res.json({
      message: `${
        itemType.charAt(0).toUpperCase() + itemType.slice(1)
      } restored successfully`,
      item: restoredItem,
    });
  } catch (error) {
    console.error("Error restoring item:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Permanently delete an item (project or task)
async function permanentlyDeleteItem(req, res) {
  try {
    const userId = req.user.id;
    const { itemId, itemType } = req.params;

    if (itemType === "project") {
      const project = await Project.findOneAndDelete({
        _id: itemId,
        user: userId,
        isDeleted: true,
      });

      if (!project) {
        return res.status(404).json({ message: "Deleted project not found" });
      }

      // Permanently delete associated tasks
      await Task.deleteMany({ project: itemId });
    } else if (itemType === "task") {
      const task = await Task.findOneAndDelete({
        _id: itemId,
        user: userId,
        isDeleted: true,
      });

      if (!task) {
        return res.status(404).json({ message: "Deleted task not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid item type" });
    }

    res.json({
      message: `${
        itemType.charAt(0).toUpperCase() + itemType.slice(1)
      } permanently deleted successfully`,
    });
  } catch (error) {
    console.error("Error permanently deleting item:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Empty trash (permanently delete all deleted items)
async function emptyTrash(req, res) {
  try {
    const userId = req.user.id;

    // Count items before deletion
    const deletedProjects = await Project.countDocuments({
      user: userId,
      isDeleted: true,
    });
    const deletedTasks = await Task.countDocuments({
      user: userId,
      isDeleted: true,
    });

    // Permanently delete all projects and their tasks
    const projectIds = await Project.find({
      user: userId,
      isDeleted: true,
    }).select("_id");

    await Project.deleteMany({ user: userId, isDeleted: true });
    await Task.deleteMany({
      project: { $in: projectIds.map((p) => p._id) },
    });

    // Delete standalone tasks
    await Task.deleteMany({ user: userId, isDeleted: true });

    res.json({
      message: "Trash emptied successfully",
      deletedProjects,
      deletedTasks,
      totalDeleted: deletedProjects + deletedTasks,
    });
  } catch (error) {
    console.error("Error emptying trash:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllDeletedItems,
  restoreItem,
  permanentlyDeleteItem,
  emptyTrash,
};
