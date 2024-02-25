import React, { useState } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-purpleHeart-600 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            className="h-8 mr-2"
            src="https://via.placeholder.com/40"
            alt="Logo"
          />
          <span className="text-white font-bold text-lg">Your Logo</span>
        </div>
        <div className="flex items-center md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex items-center">
          <button
            className="flex items-center text-white"
            onClick={toggleDropdown}
          >
            <span className="mr-2">Username</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://via.placeholder.com/50"
              alt="Avatar"
            />
          </button>
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="origin-top-right absolute right-2 top-12 mt-5 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-purpleHeart-400"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-purpleHeart-400"
            >
              About
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-purpleHeart-400"
            >
              Profile
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-purpleHeart-400"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-purpleHeart-400"
            >
              Logout
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
