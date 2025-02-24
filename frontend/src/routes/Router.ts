import Register from "../pages/Register";
import Login from "../pages/Login";

// First, let's define what a route element can be
type RouteElement = React.ComponentType<any>;

export interface CustomRoute {
  label: string;
  path: string;
  isNavbar?: boolean;
  element?: RouteElement;
}

export const router: CustomRoute[] = [
  {
    path: "/",
    label: "Home",
    isNavbar: true,
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
    isNavbar: true
  },
  {
    path: "/services",
    label: "Services",
    isNavbar: true
  }
];