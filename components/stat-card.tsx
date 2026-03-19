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
  return (
    <div
      className={cn(
        "glass glass-hover rounded-2xl p-6 relative overflow-hidden group",
        className
      )}
    >
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl",
          glowColor === "primary" && "bg-primary",
          glowColor === "accent" && "bg-accent",
          glowColor === "secondary" && "bg-secondary"
        )}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              glowColor === "primary" && "bg-primary/10 text-primary",
              glowColor === "accent" && "bg-accent/10 text-accent",
              glowColor === "secondary" && "bg-secondary/10 text-secondary"
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium px-2 py-1 rounded-lg",
                trend.isPositive
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground">
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
