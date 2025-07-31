'use client'
import type { Metadata } from "next";
import "../app/globals.css";
import { SidebarTrigger } from "../components/ui/sidebar"
import { Button } from "../components/ui/button"
import {
    User,
    Bell,
    Settings,
    Search,
    ChevronDown,
    LogOut,
    UserCircle,
    Moon,
    Sun,
    Monitor
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link";

export const metadata: Metadata = {
    title: "SaaS Dashboard",
    description: "Modern SaaS Dashboard with Navigation",
};

// Theme Toggle Component
function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Sun className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Navbar Component
export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 sm:h-16 items-center px-2 sm:px-4 lg:px-2 sm:gap-2">
                {/* Left side - Sidebar trigger and search */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <SidebarTrigger className="h-8 w-8 flex-shrink-0" />

                    {/* Mobile Search Button - Only shown on very small screens */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 flex-shrink-0 xs:hidden"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* Right side - Actions and user menu */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 relative flex-shrink-0">
                        <Bell className="h-4 w-4" />
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs flex items-center justify-center"
                        >
                            <span className="hidden sm:inline">5</span>
                            <span className="sm:hidden">•</span>
                        </Badge>
                    </Button>

                    {/* Settings - Hidden on mobile, shown on sm+ */}
                    <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hidden sm:flex flex-shrink-0">
                        <Settings className="h-4 w-4" />
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 sm:h-9 gap-1 sm:gap-2 px-1 sm:px-3 flex-shrink-0">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </div>

                                    {/* User info - Hidden on mobile, shown on md+ */}
                                    <div className="hidden md:block text-left min-w-0">
                                        <p className="text-sm font-medium truncate">John Doe</p>
                                        <p className="text-xs text-muted-foreground truncate">Vendor</p>
                                    </div>

                                    {/* Dropdown arrow - Hidden on very small screens */}
                                    <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block flex-shrink-0" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 sm:w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">John Doe</p>
                                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <UserCircle className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                <LogOut className="mr-2 h-4 w-4" />
                                <Link href='/'>Log out</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
