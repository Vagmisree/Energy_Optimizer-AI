"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Power,
  Wifi,
  WifiOff,
  ThermometerSun,
  Refrigerator,
  Tv,
  Lightbulb,
  Waves,
  Fan,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Appliance {
  id: string
  name: string
  icon: LucideIcon
  baseWatts: number
  currentWatts: number
  status: "on" | "off" | "standby"
  color: string
}

const initialAppliances: Appliance[] = [
  { id: "ac", name: "Air Conditioner", icon: ThermometerSun, baseWatts: 1400, currentWatts: 1400, status: "on", color: "text-cyan-400" },
  { id: "fridge", name: "Refrigerator", icon: Refrigerator, baseWatts: 150, currentWatts: 150, status: "on", color: "text-blue-400" },
  { id: "tv", name: "TV System", icon: Tv, baseWatts: 120, currentWatts: 120, status: "on", color: "text-purple-400" },
  { id: "lights", name: "Lighting", icon: Lightbulb, baseWatts: 200, currentWatts: 200, status: "on", color: "text-amber-400" },
  { id: "heater", name: "Water Heater", icon: Waves, baseWatts: 2000, currentWatts: 0, status: "off", color: "text-rose-400" },
  { id: "fan", name: "Ceiling Fans", icon: Fan, baseWatts: 75, currentWatts: 75, status: "on", color: "text-emerald-400" },
]

export function LiveEnergyPulse() {
  const [mounted, setMounted] = useState(false)
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances)
  const [pulseData, setPulseData] = useState<number[]>([])
  const [totalWatts, setTotalWatts] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate real-time data updates every 2 seconds
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setAppliances(prev => prev.map(app => {
        if (app.status === "off") return app
        // Fluctuate watts randomly
        const fluctuation = (Math.random() - 0.5) * app.baseWatts * 0.15
        const newWatts = Math.max(app.baseWatts * 0.7, Math.min(app.baseWatts * 1.3, app.currentWatts + fluctuation))

        // Randomly toggle appliances occasionally
        if (Math.random() < 0.02) {
          return {
            ...app,
            status: app.status === "on" ? "standby" : "on",
            currentWatts: app.status === "on" ? app.baseWatts * 0.05 : app.baseWatts,
          }
        }

        return { ...app, currentWatts: Math.round(newWatts) }
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [mounted])

  // Update totals and pulse data
  useEffect(() => {
    const total = appliances.reduce((sum, app) => sum + (app.status !== "off" ? app.currentWatts : 0), 0)
    setTotalWatts(total)
    setPulseData(prev => [...prev.slice(-29), total])
  }, [appliances])

  const maxPulse = Math.max(...pulseData, 3000)

  return (
    <Card className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center relative">
            <Zap className="w-5 h-5 text-emerald-500" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Live Energy Pulse</h3>
            <p className="text-xs text-muted-foreground">Real-time power monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-500" />
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-500">LIVE</Badge>
        </div>
      </div>

      {/* Real-time Waveform */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold font-mono text-foreground" suppressHydrationWarning>
            {mounted ? `${(totalWatts / 1000).toFixed(2)}` : "--"}
          </span>
          <span className="text-sm text-muted-foreground">kW</span>
          <span className="text-xs text-emerald-500 ml-auto font-medium">
            {mounted ? `${((totalWatts / 1000) * 8).toFixed(0)} INR/hr` : ""}
          </span>
        </div>

        {/* Mini Waveform */}
        <div className="h-16 flex items-end gap-[2px] overflow-hidden rounded-lg bg-muted/30 p-1">
          {pulseData.map((value, i) => {
            const height = maxPulse > 0 ? (value / maxPulse) * 100 : 10
            const isLast = i === pulseData.length - 1
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-sm transition-all duration-500 min-w-[3px]",
                  isLast ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-emerald-500/40"
                )}
                style={{ height: `${Math.max(5, height)}%` }}
              />
            )
          })}
          {/* Fill empty slots */}
          {Array.from({ length: Math.max(0, 30 - pulseData.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 rounded-sm bg-muted/30 min-w-[3px]" style={{ height: "5%" }} />
          ))}
        </div>
      </div>

      {/* Appliance Status Grid */}
      <div className="p-5 pt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Appliance Status</p>
        <div className="grid grid-cols-2 gap-2">
          {appliances.map((app) => {
            const Icon = app.icon
            const isActive = app.status === "on"
            const isStandby = app.status === "standby"
            return (
              <div
                key={app.id}
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-300",
                  isActive
                    ? "border-primary/20 bg-primary/5"
                    : isStandby
                    ? "border-amber-500/20 bg-amber-500/5"
                    : "border-border/30 bg-muted/20 opacity-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  isActive ? "bg-primary/10" : isStandby ? "bg-amber-500/10" : "bg-muted/30"
                )}>
                  <Icon className={cn("w-4 h-4", isActive ? app.color : isStandby ? "text-amber-400" : "text-muted-foreground/50")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">{app.name}</p>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isActive ? "bg-emerald-500" : isStandby ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/30"
                    )} />
                    <span className="text-[10px] text-muted-foreground font-mono" suppressHydrationWarning>
                      {isActive ? `${app.currentWatts}W` : isStandby ? "Standby" : "Off"}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
