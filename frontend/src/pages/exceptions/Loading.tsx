import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading dashboard..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 text-stone-500 animate-spin" />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default Loading;
