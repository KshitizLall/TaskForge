import React from "react";
import { Award, Edit, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

interface TaskDetailsProps {
  task: {
    _id: string;
    title: string;
    description: string;
    project: string;
    status: string;
    totalPoints: number;
    dailyPoints: number;
    createdAt: string;
    updatedAt: string;
  };
  getProjectTitle: (projectId: string) => string;
  getStatusInfo: (status: string) => {
    color: string;
    bgColor: string;
    icon: React.FC<any>;
    animation?: string;
  };
  onEdit: (taskId: string) => void;
  onClose: () => void;
  formatDate: (dateString: string) => string;
  onDelete: (taskId: string) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  getProjectTitle,
  getStatusInfo,
  onEdit,
  onClose,
  formatDate,
  onDelete,
}) => {
  const statusInfo = getStatusInfo(task.status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="md:w-1/3 md:pl-6 mt-0"
    >
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800 truncate pr-4">{task.title}</h2>
          <div className="flex space-x-2">
            <button onClick={() => onEdit(task._id)} className="text-stone-600 hover:text-stone-900 p-1">
              <Edit className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor}`}>
              <StatusIcon className={`w-4 h-4 mr-1 ${statusInfo.animation || ""}`} />
              {task.status}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Project</h3>
            <p className="mt-1 text-base text-gray-900">{getProjectTitle(task.project)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-base text-gray-800 whitespace-pre-line">
              {task.description || "No description provided."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Points</h3>
              <div className="mt-1 flex items-center">
                <Award className="h-4 w-4 text-amber-400 mr-1" />
                <span className="text-base text-gray-900">{task.totalPoints}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Daily Points</h3>
              <p className="mt-1 text-base text-gray-900">{task.dailyPoints}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-sm text-gray-600">{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-sm text-gray-600">{formatDate(task.updatedAt)}</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => onDelete(task._id)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-red-700 bg-red-50 hover:bg-red-100"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetails;
