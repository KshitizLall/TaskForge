import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Loader2, X, Plus, Edit } from "lucide-react";
import * as Yup from "yup";
import { motion } from "framer-motion";

export interface TaskFormValues {
  title: string;
  description: string;
  projectId: string;
  totalPoints: number;
  dailyPoints: number;
  status: string;
}

interface TaskFormProps {
  initialValues: TaskFormValues;
  isEditing: boolean;
  onSubmit: (values: TaskFormValues, formikHelpers: any) => void;
  onCancel: () => void;
  projects: { _id: string; title: string }[];
}

const taskValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  projectId: Yup.string().required("Project is required"),
  description: Yup.string().max(500, "Description must be less than 500 characters"),
  totalPoints: Yup.number().min(0, "Points cannot be negative").required("Total points is required"),
  dailyPoints: Yup.number().min(0, "Points cannot be negative"),
});

const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  isEditing,
  onSubmit,
  onCancel,
  projects,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="md:w-1/3 md:pl-6 md:mt-0 mt-8"
    >
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">
            {isEditing ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={taskValidationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 text-gray-800"
                  placeholder="Enter task title"
                />
                <ErrorMessage name="title" component="p" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="projectId" className="block text-base font-medium text-gray-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  id="projectId"
                  name="projectId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 text-gray-800"
                  disabled={isEditing}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="projectId" component="p" className="mt-1 text-sm text-red-600" />
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Project cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Enter task description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 text-gray-800"
                />
                <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="totalPoints" className="block text-base font-medium text-gray-700 mb-1">
                    Total Points
                  </label>
                  <Field
                    type="number"
                    id="totalPoints"
                    name="totalPoints"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 text-gray-800"
                  />
                  <ErrorMessage name="totalPoints" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="dailyPoints" className="block text-base font-medium text-gray-700 mb-1">
                    Daily Points
                  </label>
                  <Field
                    type="number"
                    id="dailyPoints"
                    name="dailyPoints"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 text-gray-800"
                  />
                  <ErrorMessage name="dailyPoints" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {isEditing && (
                <div>
                  <label htmlFor="status" className="block text-base font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 text-gray-800"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="On Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Field>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-stone-600 text-white rounded-full hover:bg-stone-700 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[100px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditing ? "Update Task" : "Create Task"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default TaskForm;
