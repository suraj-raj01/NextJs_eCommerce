"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../../components/theme-provider";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/ui/app-sidebar";
import Navbar from "../../components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`flex min-h-screen bg-background text-foreground font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 min-h-screen">
            <Navbar />
            {children}
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}
