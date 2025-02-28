import React from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteConfirmDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ onCancel, onConfirm }) => {
  return (
    <div className="modal modal-open">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="modal-box relative"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium">Delete Task</h3>
          <p className="mt-2">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
        </div>
        <div className="modal-action flex justify-center space-x-3">
          <button onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmDialog;
