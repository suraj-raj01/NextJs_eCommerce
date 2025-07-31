"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../../components/theme-provider";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/ui/app-sidebar";
import Navbar from "../../components/Navbar";
import SiteNavbar from "./components/navbar";
import Footer from "./components/footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`flex bg-background text-foreground font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          {/* <AppSidebar /> */}
          <div className="w-full h-auto">
            <SiteNavbar/>
            {children}
            <Footer/>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}
