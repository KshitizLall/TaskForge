import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorPageProps {
  screenName: string
  errorMessage: string;
  onRetry: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ screenName, errorMessage, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h2 className="mt-4 text-2xl font-medium text-gray-800">{screenName}</h2>
      <p className="mt-2 text-gray-600 text-lg text-center">{errorMessage}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-6 py-2 bg-stone-600 text-white text-lg rounded-full hover:bg-stone-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
