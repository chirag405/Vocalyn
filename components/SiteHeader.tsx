"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added for user avatar

export default function SiteHeader() {
  const { isAuthenticated, user, signOut, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex flex-1 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary mr-6">
            AI Platform
          </Link>
          
          <div className="flex items-center gap-4">
            {isLoading && !isAuthenticated && ( // Show loader only if not authenticated and loading initial state
              <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
            )}
            
            {!isLoading && isAuthenticated && user && (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, {user.full_name?.split(" ")[0] || user.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} disabled={isLoading} variant="outline" size="sm">
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
              </>
            )}
            
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
