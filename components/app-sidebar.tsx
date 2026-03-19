"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Bot,
  Clock,
  Timer,
  Gamepad2,
  Trophy,
  FileText,
  Settings,
  Zap,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, section: "main" },
  { name: "Insights", href: "/insights", icon: TrendingUp, section: "main" },
  { name: "Analyze", href: "/analyze", icon: BarChart3, section: "main" },
  { name: "AI Assistant", href: "/assistant", icon: Bot, section: "ai" },
  { name: "Smart Scheduler", href: "/scheduler", icon: Clock, section: "automation" },
  { name: "Time Machine", href: "/time-machine", icon: Timer, section: "automation" },
  { name: "Simulator", href: "/simulator", icon: Gamepad2, section: "automation" },
  { name: "Reports", href: "/reports", icon: FileText, section: "insights" },
  { name: "Achievements", href: "/achievements", icon: Trophy, section: "insights" },
  { name: "Profile", href: "/profile", icon: LayoutDashboard, section: "insights" },
  { name: "Settings", href: "/settings", icon: Settings, section: "system" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-sm group-hover:glow transition-all duration-300">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground text-lg leading-tight">
              Energy Optimizer
            </h1>
            <p className="text-xs text-muted-foreground">AI-Powered Analytics</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full justify-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground glow-sm"
                          : "hover:bg-sidebar-accent text-sidebar-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn("w-5 h-5", isActive && "text-primary-foreground")} />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-sidebar-foreground">Theme</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-lg hover:bg-sidebar-accent"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
