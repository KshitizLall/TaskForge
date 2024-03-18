import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dashboard } from "./screen/Dashboard";
import { NotFound } from "./screen/Exceptions/NotFound";
import { Layout } from "./screen/Layout";
import Login from "./screen/Signin";
import Signup from "./screen/Signup";
import { Task } from "./screen/Task";
import { TaskDetails } from "./screen/TaskDetails";
import { Trash } from "./screen/Trash";

export default function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#f3f4f6]">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Task />} />
            <Route path="/completed/:status" element={<Task />} />
            <Route path="/in-progress/:status" element={<Task />} />
            <Route path="/todo/:status" element={<Task />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/*" element={<NotFound />} />
          </Route>

          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}
