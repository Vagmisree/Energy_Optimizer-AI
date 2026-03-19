"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Cpu,
  Thermometer,
  Waves,
  Power,
  TrendingDown,
  Shield,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AutopilotAction {
  id: string
  time: string
  action: string
  savings: number
  type: "ac" | "appliance" | "schedule" | "alert"
}

const actionTemplates: Omit<AutopilotAction, "id" | "time">[] = [
  { action: "Shifted washing machine to off-peak hours", savings: 12, type: "schedule" },
  { action: "Reduced AC temperature by 1°C (room at 23°C)", savings: 18, type: "ac" },
  { action: "Turned off standby power for TV system", savings: 5, type: "appliance" },
  { action: "Optimized water heater schedule", savings: 15, type: "schedule" },
  { action: "Detected peak hour - dimmed non-essential lights", savings: 8, type: "alert" },
  { action: "Pre-cooled room before peak pricing starts", savings: 22, type: "ac" },
  { action: "Paused EV charging during peak demand", savings: 30, type: "appliance" },
  { action: "Shifted dishwasher to 11 PM slot", savings: 10, type: "schedule" },
  { action: "Reduced water heater temp by 5°C", savings: 14, type: "ac" },
  { action: "Detected inefficient fridge cycle - alert sent", savings: 6, type: "alert" },
]

function formatCurrentTime(): string {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const ampm = hours >= 12 ? "PM" : "AM"
  const fh = hours % 12 || 12
  return `${fh}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`
}

export function AIAutopilot() {
  const [enabled, setEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [actions, setActions] = useState<AutopilotAction[]>([])
  const [totalSavings, setTotalSavings] = useState(0)
  const [currentPower, setCurrentPower] = useState(2.4)
  const [actionsToday, setActionsToday] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addAction = useCallback(() => {
    const template = actionTemplates[Math.floor(Math.random() * actionTemplates.length)]
    const newAction: AutopilotAction = {
      ...template,
      id: crypto.randomUUID(),
      time: formatCurrentTime(),
    }
    setActions((prev) => [newAction, ...prev].slice(0, 8))
    setTotalSavings((prev) => prev + template.savings)
    setActionsToday((prev) => prev + 1)
  }, [])

  // Simulate AI actions when autopilot is enabled
  useEffect(() => {
    if (!enabled || !mounted) return
    // Add initial action
    addAction()
    const interval = setInterval(() => {
      addAction()
      setCurrentPower((prev) => {
        const delta = (Math.random() - 0.55) * 0.3
        return Math.max(1.2, Math.min(3.8, prev + delta))
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [enabled, mounted, addAction])

  // Fluctuate power even when not in autopilot
  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setCurrentPower((prev) => {
        const delta = (Math.random() - 0.5) * 0.15
        return Math.max(1.5, Math.min(4.0, prev + delta))
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [mounted])

  const getActionIcon = (type: string) => {
    switch (type) {
      case "ac": return <Thermometer className="w-3.5 h-3.5" />
      case "appliance": return <Power className="w-3.5 h-3.5" />
      case "schedule": return <Activity className="w-3.5 h-3.5" />
      case "alert": return <Shield className="w-3.5 h-3.5" />
      default: return <Zap className="w-3.5 h-3.5" />
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case "ac": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
      case "appliance": return "text-amber-400 bg-amber-400/10 border-amber-400/30"
      case "schedule": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
      case "alert": return "text-rose-400 bg-rose-400/10 border-rose-400/30"
      default: return "text-primary bg-primary/10 border-primary/30"
    }
  }

  return (
    <Card className="glass rounded-2xl overflow-hidden">
      {/* Header with Toggle */}
      <div className="p-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
            enabled ? "bg-primary glow" : "bg-muted"
          )}>
            <Cpu className={cn("w-5 h-5 transition-colors", enabled ? "text-primary-foreground" : "text-muted-foreground")} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">AI Autopilot</h3>
            <p className="text-xs text-muted-foreground">Autonomous energy optimization</p>
          </div>
        </div>

        {/* Premium Toggle */}
        <button
          onClick={() => {
            setEnabled(!enabled)
            if (!enabled) {
              setActions([])
              setTotalSavings(0)
              setActionsToday(0)
            }
          }}
          className={cn(
            "relative w-16 h-8 rounded-full transition-all duration-500 border-2",
            enabled
              ? "bg-primary border-primary shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-muted border-border"
          )}
          aria-label="Toggle AI Autopilot"
        >
          <div className={cn(
            "absolute top-0.5 w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center",
            enabled
              ? "left-[calc(100%-1.625rem)] bg-primary-foreground shadow-lg"
              : "left-0.5 bg-muted-foreground/50"
          )}>
            {enabled ? (
              <Zap className="w-3 h-3 text-primary" />
            ) : (
              <Power className="w-3 h-3 text-muted" />
            )}
          </div>
        </button>
      </div>

      {/* Status Bar */}
      <div className="px-5 py-3 flex items-center gap-4 bg-gradient-to-r from-transparent via-primary/5 to-transparent border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            enabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
          )} />
          <span className="text-xs font-medium text-muted-foreground">
            {enabled ? "Active" : "Standby"}
          </span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <TrendingDown className="w-3 h-3 text-primary" />
          <span className="text-xs font-mono font-medium text-foreground" suppressHydrationWarning>
            {mounted ? `${currentPower.toFixed(1)} kW` : "-- kW"}
          </span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-amber-500" />
          <span className="text-xs font-medium text-foreground">{actionsToday} actions</span>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className={cn(
            "text-xs font-mono",
            enabled ? "border-primary/50 text-primary" : "border-border text-muted-foreground"
          )}>
            Saved: {totalSavings} Wh
          </Badge>
        </div>
      </div>

      {/* Live Action Feed */}
      <div className="p-5">
        {!enabled ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <Cpu className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Enable Autopilot to start</p>
            <p className="text-xs text-muted-foreground/70 mt-1">AI will automatically optimize your energy usage</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Live Action Feed</p>
            {actions.map((action, i) => (
              <div
                key={action.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition-all duration-500",
                  i === 0 ? "animate-slide-in" : "",
                  getActionColor(action.type)
                )}
                style={{ opacity: Math.max(0.4, 1 - i * 0.1) }}
              >
                <div className="mt-0.5">{getActionIcon(action.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-snug">{action.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono" suppressHydrationWarning>
                    {action.time}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary shrink-0">
                  -{action.savings} Wh
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
