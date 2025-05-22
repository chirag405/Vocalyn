"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link"; // Import Link for placeholder links
import { Button } from "@/components/ui/button"; // Import Button for placeholder links

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuthStore();

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mr-3"></div>
        Loading dashboard...
      </div>
    );
  }

  // This case should ideally be handled by middleware, redirecting to login.
  // But as a fallback UI:
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">
          Please log in to view your dashboard.
        </h1>
        <Link href="/auth/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  if (user) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to your Dashboard, {user.full_name?.split(" ")[0] || user.email}!
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Here you can manage your AI agents, view your usage, and configure your account.
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder Card 1: Manage Agents */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Manage Agents</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create, configure, and monitor your AI voice agents.
              </p>
              {/* <Link href="/dashboard/agents"> */}
                <Button variant="outline" disabled>View Agents (Coming Soon)</Button>
              {/* </Link> */}
            </div>

            {/* Placeholder Card 2: View Usage */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">View Usage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Track your session minutes, agent interactions, and storage usage.
              </p>
              {/* <Link href="/dashboard/usage"> */}
                <Button variant="outline" disabled>View Usage (Coming Soon)</Button>
              {/* </Link> */}
            </div>

            {/* Placeholder Card 3: Account Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Account Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage your subscription, billing details, and user profile.
              </p>
              {/* <Link href="/dashboard/settings"> */}
                <Button variant="outline" disabled>Go to Settings (Coming Soon)</Button>
              {/* </Link> */}
            </div>
          </div>
        </section>
        
        <section className="mt-12">
           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Explore More
          </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">API & Integrations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Access API keys and explore integration options for your applications.
                </p>
                <Button variant="outline" disabled>Explore APIs (Coming Soon)</Button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Documentation & Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Find guides, tutorials, and get help from our support team.
                </p>
                <Button variant="outline" disabled>Get Support (Coming Soon)</Button>
            </div>
           </div>
        </section>

      </div>
    );
  }

  // Fallback for any other unhandled state, though theoretically covered.
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>An unexpected error occurred. Please try refreshing the page.</p>
    </div>
  );
}
