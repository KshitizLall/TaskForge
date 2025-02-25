import {
  CheckSquare,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { router } from "../routes/Router";
import Avatar from "./Avatar";
import { isAuthenticated, getCurrentUser, logout } from "../utils/auth-utils";

const LOGO_TEXT = "TaskForge.";

// Icon mapping for navigation items
const getNavIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case "home":
      return <Home className="w-4 h-4" />;
    case "tasks":
      return <CheckSquare className="w-4 h-4" />;
    case "services":
      return <Settings className="w-4 h-4" />;
    default:
      return null;
  }
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get authentication status and user info
  const authenticated = isAuthenticated();
  const user = getCurrentUser();
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "?";
    
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Filter routes for navbar
  const navbarRoutes = router.filter(
    (route) => route.isNavbar !== false // Show routes where isNavbar is true or undefined
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-center mt-2 backdrop-blur-md">
      <nav className="shadow-lg rounded-full max-w-3xl w-full px-6 mx-4 backdrop-blur-sm">
        <div className="flex justify-between h-14 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-lg font-bold text-gray-800">
              {LOGO_TEXT}
            </Link>
          </div>

          {/* Navigation Links and Avatar */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navbarRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
                  isActiveRoute(route.path)
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {getNavIcon(route.label)}
                <span>{route.label}</span>
              </Link>
            ))}

            {/* Authentication Links or Avatar Dropdown */}
            {authenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <Avatar
                    fallback={getUserInitials()}
                    className="cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all duration-200"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg backdrop-blur-sm ring-1 ring-black ring-opacity-5 bg-white/90">
                    <div className="py-1 divide-y divide-gray-100">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 p-2"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 mx-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4">
              <div className="flex flex-col space-y-4">
                {navbarRoutes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
                      isActiveRoute(route.path)
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {getNavIcon(route.label)}
                    <span>{route.label}</span>
                  </Link>
                ))}
                
                {authenticated ? (
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar fallback={getUserInitials()} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <button className="w-full text-left flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 p-2 rounded hover:bg-gray-100">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="w-full text-left flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 p-2 rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button className="w-full text-left flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 p-2 rounded hover:bg-gray-100">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 p-2 rounded hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t flex flex-col space-y-2">
                    <Link
                      to="/login"
                      className="w-full text-center text-sm font-medium text-gray-700 hover:text-gray-900 p-2 rounded hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;