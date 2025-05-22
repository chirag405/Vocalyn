import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/authProvider";
import SiteHeader from "@/components/SiteHeader"; // Import SiteHeader

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Voice Agents Platform",
  description: "Create and manage your AI voice agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for potential theme/server mismatches */}
      <body className={inter.className}>
        <AuthProvider>
          <SiteHeader /> {/* Add SiteHeader here */}
          <main className="container mx-auto px-4 py-8"> {/* Added a main wrapper for content */}
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
