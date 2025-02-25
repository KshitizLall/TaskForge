import Register from "../pages/Register";
import Login from "../pages/Login";
// You'll need to create/import these components
import Home from "../pages/Home";
import Tasks from "../pages/Task";

// First, let's define what a route element can be
type RouteElement = React.ComponentType<any>;

export interface CustomRoute {
  label: string;
  path: string;
  isNavbar?: boolean;
  element?: RouteElement;
  protected?: boolean; // Add this property to indicate if route is protected
}

export const router: CustomRoute[] = [
  {
    path: "/",
    label: "Home",
    isNavbar: true,
    element: Home,
    protected: true // Home page is protected
  },
  {
    path: "/register",
    label: "Register",
    isNavbar: false,
    element: Register
  },
  {
    path: "/login",
    label: "Login",
    isNavbar: false,
    element: Login
  },
  {
    path: "/tasks",
    label: "Tasks",
    isNavbar: true,
    element: Tasks,
    protected: true // Tasks page is protected
  },
];