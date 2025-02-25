import { Heart } from "lucide-react";
import React from "react";

interface FooterProps {
  version: string;
  companyName?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({
  version,
  companyName = "Task Manager",
  year = new Date().getFullYear(),
}) => {
  return (
    <footer className="bg-stone-900 border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-white text-sm">
              &copy; {year} {companyName}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center">
            <span className="text-white text-sm mr-2">
              Version {version}
            </span>
            <div className="h-4 w-px bg-gray-300 mx-3"></div>
            <span className="text-white text-sm flex items-center">
              Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> by
              Development Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
