"use client";

import { useAuth } from "@/contexts/auth-context";
import { AuthPage } from "@/components/auth/auth-page";
import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading TaskForge...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <DashboardHome />;
}
