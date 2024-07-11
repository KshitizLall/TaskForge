const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the 'User' model
      required: true,
    },
    status: {
      type: String,
      enum: ["Not Started", "On Progress", "Completed"],
      default: "Not Started",
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    dailyPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.methods.calculatePendingPoints = function () {
  return this.totalPoints - this.dailyPoints;
};

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
