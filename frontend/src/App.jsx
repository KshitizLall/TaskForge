import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./screen/Dashboard";
import { NotFound } from "./screen/Exceptions/NotFound";
import Login from "./screen/Signin";
import Signup from "./screen/Signup";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
