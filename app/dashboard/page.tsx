"use client";

import { useEffect } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Please log in to view your dashboard
        </h1>
        <Button onClick={() => (window.location.href = "/auth/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const stats = [
    { label: "Total recordings", value: "24", change: "+5%" },
    { label: "Storage used", value: "68 MB", change: "+12%" },
    { label: "Projects", value: "8", change: "+2%" },
    { label: "Team members", value: "3", change: "0%" },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Created recording",
      name: "Weekly Standup",
      date: "2 hours ago",
    },
    {
      id: 2,
      action: "Shared recording",
      name: "Client Presentation",
      date: "Yesterday",
    },
    {
      id: 3,
      action: "Transcribed recording",
      name: "Product Planning",
      date: "2 days ago",
    },
    {
      id: 4,
      action: "Added notes",
      name: "Team Retrospective",
      date: "3 days ago",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          {/* Sidebar content here */}
          <div className="p-4 font-bold text-lg">Vocalyn</div>
          <div className="space-y-1 px-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/dashboard">Dashboard</a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/recordings">Recordings</a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/projects">Projects</a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/settings">Settings</a>
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 p-8 bg-background">
          {/* User welcome section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.full_name.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your account
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user?.full_name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.subscription_tier} Plan
                </p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback>
                  {user?.full_name ? getInitials(user.full_name) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p
                    className={`text-xs ${
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : stat.change === "0%"
                        ? "text-muted-foreground"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>
                Your plan usage for the current billing period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Storage (500 MB limit)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      136 MB / 500 MB
                    </div>
                  </div>
                  <Progress value={27} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Transcription minutes (300 min limit)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      124 min / 300 min
                    </div>
                  </div>
                  <Progress value={41} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <PieChart className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Subscription Status
                          </p>
                          <p className="text-lg font-bold capitalize">
                            {user?.subscription_status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <BarChart className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Last recording</p>
                          <p className="text-lg font-bold">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/recordings">View all recordings</a>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" asChild>
                      <a href="/recordings/new">New Recording</a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/recordings/import">Import Recording</a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/projects/new">New Project</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>
                    Your recording and transcription usage over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      line: { label: "Line Chart", color: "#007bff" },
                      data: {},
                    }}
                  >
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <LineChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <p>Analytics data visualization will appear here</p>
                      </div>
                    </div>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-muted-foreground">{item.name}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
}
