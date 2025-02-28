import {
  CheckSquare,
  Home,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { router } from "../routes/Router";
import { getCurrentUser, isAuthenticated, logout } from "../utils/auth-utils";
import Avatar from "./Avatar";

// Constants for reusable values
const LOGO_TEXT = "FT";

// Navigation item configuration
const NAV_ITEMS = {
  home: { icon: Home, label: "Home" },
  tasks: { icon: CheckSquare, label: "Tasks" },
  services: { icon: Settings, label: "Services" },
};

// User menu items configuration
const USER_MENU_ITEMS = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/setting" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Authentication state
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  console.log('Authentication Debug:', {
    authenticated,
    user,
    isAuthenticatedType: typeof isAuthenticated,
    getCurrentUserType: typeof getCurrentUser
  });

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "?";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Filter routes for navbar
  const navbarRoutes = router.filter(
    (route) => route.isNavbar !== false
  );

  // Handle UI interactions
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const isActiveRoute = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get icon component based on route label
  const getNavIcon = (label: string) => {
    const key = label.toLowerCase() as keyof typeof NAV_ITEMS;
    const IconComponent = NAV_ITEMS[key]?.icon;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  // Render nav item
  const renderNavItem = (route: any) => {
    const active = isActiveRoute(route.path);
    return (
      <Link
        key={route.path}
        to={route.path}
        className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-full ${
          active
            ? "bg-stone-600 text-white"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        {getNavIcon(route.label)}
        <span className="hidden sm:inline">{route.label}</span>
      </Link>
    );
  };

  // Logo animation variants
  const logoVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
        repeatDelay: 5,
      },
    },
  };

  // Text gradient animation
  const textVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "linear",
      },
    },
  };

  // Add more debug logs
  useEffect(() => {
    console.log('Navbar Render - Authentication:', {
      authenticated,
      user,
      navbarRoutes
    });
  }, [authenticated, user, navbarRoutes]);

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center z-50">
      <nav className="shadow-lg rounded-full bg-white/95 backdrop-blur-md max-w-3xl px-4 py-2 mx-4 border border-gray-100">
        <div className="flex items-center">
          {/* Animated Logo */}
          <div className="flex-shrink-0 mr-3 overflow-hidden">
            <Link to="/">
              <motion.div 
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-md"
                variants={logoVariants}
                animate="animate"
                whileHover={{ scale: 1 }}
              >
                <motion.span 
                  className="font-extrabold text-transparent text-lg bg-clip-text"
                  variants={textVariants}
                  animate="animate"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff)",
                    backgroundSize: "200% 100%",
                  }}
                >
                  {LOGO_TEXT}
                </motion.span>
              </motion.div>
            </Link>
          </div>

          {/* Navigation Links - Visible on all screen sizes */}
          <div className="flex items-center space-x-1 flex-1">
            {navbarRoutes.map((route) => renderNavItem(route))}
          </div>

          {/* Authentication Links or Avatar Dropdown */}
          {authenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="focus:outline-none ml-2">
                <Avatar
                  fallback={getUserInitials()}
                  className="cursor-pointer hover:ring-2 hover:ring-stone-200 transition-all duration-200"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-lg shadow-lg backdrop-blur-md ring-1 ring-black ring-opacity-5 bg-white/95">
                  <div className="py-1 divide-y divide-gray-100">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {USER_MENU_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link 
                            key={index} 
                            to={item.path} 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
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
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-50"
              >
                <span className="hidden sm:inline">Login</span>
                <User className="w-4 h-4 sm:hidden" />
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-stone-600 hover:bg-stone-700 px-3 py-1.5 rounded-full transition-colors"
              >
                <span className="hidden sm:inline">Register</span>
                <User className="w-4 h-4 sm:hidden" />
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;