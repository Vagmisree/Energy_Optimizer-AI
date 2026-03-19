"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedCounter } from "./animated-counter"

interface StatCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  glowColor?: string
}

export function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  icon: Icon,
  trend,
  className,
  glowColor = "primary",
}: StatCardProps) {
  const getGlowStyles = () => {
    switch (glowColor) {
      case "primary":
        return {
          bg: "bg-gradient-to-br from-primary/15 to-emerald-500/10",
          icon: "bg-gradient-to-br from-primary/20 to-emerald-500/15 text-primary",
          glow: "bg-primary",
          border: "border-primary/20 hover:border-primary/40",
        }
      case "accent":
        return {
          bg: "bg-gradient-to-br from-accent/15 to-lime-500/10",
          icon: "bg-gradient-to-br from-accent/20 to-lime-500/15 text-accent",
          glow: "bg-accent",
          border: "border-accent/20 hover:border-accent/40",
        }
      case "secondary":
        return {
          bg: "bg-gradient-to-br from-secondary/15 to-purple-500/10",
          icon: "bg-gradient-to-br from-secondary/20 to-purple-500/15 text-secondary",
          glow: "bg-secondary",
          border: "border-secondary/20 hover:border-secondary/40",
        }
      default:
        return {
          bg: "bg-gradient-to-br from-primary/15 to-emerald-500/10",
          icon: "bg-gradient-to-br from-primary/20 to-emerald-500/15 text-primary",
          glow: "bg-primary",
          border: "border-primary/20 hover:border-primary/40",
        }
    }
  }
  
  const styles = getGlowStyles()
  
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border",
        styles.border,
        className
      )}
    >
      {/* Background gradient */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", styles.bg)} />
      
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-3xl",
          styles.glow
        )}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              styles.icon
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full",
                trend.isPositive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              )}
            >
              <span className="text-xs">{trend.isPositive ? "+" : ""}{trend.value}%</span>
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          </p>
        </div>
      </div>
    </div>
  )
}
