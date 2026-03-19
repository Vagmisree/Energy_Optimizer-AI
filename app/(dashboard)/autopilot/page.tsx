"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Cpu,
  Zap,
  Thermometer,
  Power,
  Activity,
  Shield,
  TrendingDown,
  Lightbulb,
  Waves,
  Fan,
  Tv,
  Refrigerator,
  ThermometerSun,
  Play,
  Square,
  SkipForward,
  Brain,
  Sparkles,
  Leaf,
  CheckCircle2,
  Wifi,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AutopilotAction {
  id: string
  time: string
  action: string
  savings: number
  type: "ac" | "appliance" | "schedule" | "alert"
}

interface Appliance {
  id: string
  name: string
  icon: LucideIcon
  baseWatts: number
  currentWatts: number
  status: "on" | "off" | "standby"
  color: string
}

interface DemoStep {
  id: number
  title: string
  description: string
  icon: LucideIcon
  metric: string
  metricLabel: string
  color: string
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const actionTemplates: Omit<AutopilotAction, "id" | "time">[] = [
  { action: "Shifted washing machine to off-peak hours", savings: 12, type: "schedule" },
  { action: "Reduced AC temperature by 1 deg C (room at 23 deg C)", savings: 18, type: "ac" },
  { action: "Turned off standby power for TV system", savings: 5, type: "appliance" },
  { action: "Optimized water heater schedule", savings: 15, type: "schedule" },
  { action: "Detected peak hour - dimmed non-essential lights", savings: 8, type: "alert" },
  { action: "Pre-cooled room before peak pricing starts", savings: 22, type: "ac" },
  { action: "Paused EV charging during peak demand", savings: 30, type: "appliance" },
  { action: "Shifted dishwasher to 11 PM slot", savings: 10, type: "schedule" },
  { action: "Reduced water heater temp by 5 deg C", savings: 14, type: "ac" },
  { action: "Detected inefficient fridge cycle - alert sent", savings: 6, type: "alert" },
]

const initialAppliances: Appliance[] = [
  { id: "ac", name: "Air Conditioner", icon: ThermometerSun, baseWatts: 1400, currentWatts: 1400, status: "on", color: "text-cyan-400" },
  { id: "fridge", name: "Refrigerator", icon: Refrigerator, baseWatts: 150, currentWatts: 150, status: "on", color: "text-blue-400" },
  { id: "tv", name: "TV System", icon: Tv, baseWatts: 120, currentWatts: 120, status: "on", color: "text-purple-400" },
  { id: "lights", name: "Lighting", icon: Lightbulb, baseWatts: 200, currentWatts: 200, status: "on", color: "text-amber-400" },
  { id: "heater", name: "Water Heater", icon: Waves, baseWatts: 2000, currentWatts: 0, status: "off", color: "text-rose-400" },
  { id: "fan", name: "Ceiling Fans", icon: Fan, baseWatts: 75, currentWatts: 75, status: "on", color: "text-emerald-400" },
]

const demoSteps: DemoStep[] = [
  { id: 1, title: "Scanning Energy Data", description: "AI is analyzing 12 months of consumption patterns across all appliances...", icon: Brain, metric: "342 kWh", metricLabel: "Current Monthly Usage", color: "text-cyan-400" },
  { id: 2, title: "AI Predictions Running", description: "Machine learning model predicting next month's bill with 94% accuracy...", icon: Sparkles, metric: "94.2%", metricLabel: "Prediction Confidence", color: "text-purple-400" },
  { id: 3, title: "Optimizing Schedule", description: "Shifting high-consumption appliances to off-peak hours automatically...", icon: Zap, metric: "38%", metricLabel: "Peak Hour Reduction", color: "text-amber-400" },
  { id: 4, title: "Applying AI Autopilot", description: "Autonomous decisions: AC adjusted, standby eliminated, loads balanced...", icon: TrendingDown, metric: "645 INR", metricLabel: "Monthly Savings", color: "text-emerald-400" },
  { id: 5, title: "Environmental Impact", description: "Carbon footprint reduced by 18.5kg CO2 - equivalent to planting 3 trees...", icon: Leaf, metric: "18.5 kg", metricLabel: "CO2 Reduced", color: "text-green-400" },
  { id: 6, title: "Transformation Complete", description: "Bill reduced from 2,850 to 2,205 INR. Annual savings projected at 7,740 INR!", icon: CheckCircle2, metric: "7,740 INR", metricLabel: "Annual Savings", color: "text-primary" },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatCurrentTime(): string {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const ampm = hours >= 12 ? "PM" : "AM"
  const fh = hours % 12 || 12
  return `${fh}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`
}

function getActionIcon(type: string) {
  switch (type) {
    case "ac": return <Thermometer className="w-3.5 h-3.5" />
    case "appliance": return <Power className="w-3.5 h-3.5" />
    case "schedule": return <Activity className="w-3.5 h-3.5" />
    case "alert": return <Shield className="w-3.5 h-3.5" />
    default: return <Zap className="w-3.5 h-3.5" />
  }
}

function getActionColor(type: string) {
  switch (type) {
    case "ac": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
    case "appliance": return "text-amber-400 bg-amber-400/10 border-amber-400/30"
    case "schedule": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    case "alert": return "text-rose-400 bg-rose-400/10 border-rose-400/30"
    default: return "text-primary bg-primary/10 border-primary/30"
  }
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AutopilotPage() {
  const [mounted, setMounted] = useState(false)

  // Autopilot state
  const [autopilotEnabled, setAutopilotEnabled] = useState(false)
  const [actions, setActions] = useState<AutopilotAction[]>([])
  const [totalSavings, setTotalSavings] = useState(0)
  const [actionsToday, setActionsToday] = useState(0)
  const [currentPower, setCurrentPower] = useState(2.4)

  // Live pulse state
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances)
  const [pulseData, setPulseData] = useState<number[]>([])
  const [totalWatts, setTotalWatts] = useState(0)

  // Demo state
  const [demoPlaying, setDemoPlaying] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [demoProgress, setDemoProgress] = useState(0)
  const [demoCompleted, setDemoCompleted] = useState(false)
  const [savingsCounter, setSavingsCounter] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  // ─── AUTOPILOT LOGIC ─────────────────────────────────────────────────────

  const addAction = useCallback(() => {
    const template = actionTemplates[Math.floor(Math.random() * actionTemplates.length)]
    const newAction: AutopilotAction = {
      ...template,
      id: crypto.randomUUID(),
      time: formatCurrentTime(),
    }
    setActions(prev => [newAction, ...prev].slice(0, 10))
    setTotalSavings(prev => prev + template.savings)
    setActionsToday(prev => prev + 1)
  }, [])

  useEffect(() => {
    if (!autopilotEnabled || !mounted) return
    addAction()
    const interval = setInterval(() => {
      addAction()
      setCurrentPower(prev => {
        const delta = (Math.random() - 0.55) * 0.3
        return Math.max(1.2, Math.min(3.8, prev + delta))
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [autopilotEnabled, mounted, addAction])

  // ─── LIVE PULSE LOGIC ────────────────────────────────────────────────────

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setAppliances(prev => prev.map(app => {
        if (app.status === "off") return app
        const fluctuation = (Math.random() - 0.5) * app.baseWatts * 0.15
        const newWatts = Math.max(app.baseWatts * 0.7, Math.min(app.baseWatts * 1.3, app.currentWatts + fluctuation))
        if (Math.random() < 0.02) {
          return { ...app, status: app.status === "on" ? "standby" as const : "on" as const, currentWatts: app.status === "on" ? app.baseWatts * 0.05 : app.baseWatts }
        }
        return { ...app, currentWatts: Math.round(newWatts) }
      }))
      setCurrentPower(prev => {
        const delta = (Math.random() - 0.5) * 0.15
        return Math.max(1.5, Math.min(4.0, prev + delta))
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    const total = appliances.reduce((sum, app) => sum + (app.status !== "off" ? app.currentWatts : 0), 0)
    setTotalWatts(total)
    setPulseData(prev => [...prev.slice(-39), total])
  }, [appliances])

  // ─── DEMO LOGIC ──────────────────────────────────────────────────────────

  const advanceDemo = useCallback(() => {
    setDemoStep(prev => {
      if (prev >= demoSteps.length - 1) {
        setDemoPlaying(false)
        setDemoCompleted(true)
        return prev
      }
      return prev + 1
    })
    setDemoProgress(0)
  }, [])

  useEffect(() => {
    if (!demoPlaying) return
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) { advanceDemo(); return 0 }
        return prev + 2.5
      })
    }, 100)
    return () => clearInterval(interval)
  }, [demoPlaying, advanceDemo])

  useEffect(() => {
    if (!demoPlaying && !demoCompleted) return
    const target = demoCompleted ? 7740 : Math.round((demoStep / demoSteps.length) * 7740)
    const interval = setInterval(() => {
      setSavingsCounter(prev => prev >= target ? target : prev + Math.ceil((target - prev) / 10))
    }, 50)
    return () => clearInterval(interval)
  }, [demoPlaying, demoStep, demoCompleted])

  const startDemo = () => {
    setDemoPlaying(true)
    setDemoStep(0)
    setDemoProgress(0)
    setDemoCompleted(false)
    setSavingsCounter(0)
  }

  const maxPulse = Math.max(...pulseData, 3000)
  const currentDemoStep = demoSteps[demoStep]
  const DemoIcon = currentDemoStep?.icon || Zap

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
            autopilotEnabled ? "bg-primary glow" : "bg-primary/10"
          )}>
            <Cpu className={cn("w-6 h-6", autopilotEnabled ? "text-primary-foreground" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Autopilot Center</h1>
            <p className="text-muted-foreground">Autonomous energy optimization and real-time monitoring</p>
          </div>
        </div>

        {/* Autopilot Master Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">AI Autopilot</span>
          <button
            onClick={() => {
              setAutopilotEnabled(!autopilotEnabled)
              if (!autopilotEnabled) { setActions([]); setTotalSavings(0); setActionsToday(0) }
            }}
            className={cn(
              "relative w-20 h-10 rounded-full transition-all duration-500 border-2",
              autopilotEnabled
                ? "bg-primary border-primary shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                : "bg-muted border-border"
            )}
            aria-label="Toggle AI Autopilot"
          >
            <div className={cn(
              "absolute top-1 w-7 h-7 rounded-full transition-all duration-500 flex items-center justify-center",
              autopilotEnabled
                ? "left-[calc(100%-2.1rem)] bg-primary-foreground shadow-lg"
                : "left-1 bg-muted-foreground/50"
            )}>
              {autopilotEnabled ? <Zap className="w-3.5 h-3.5 text-primary" /> : <Power className="w-3.5 h-3.5 text-muted" />}
            </div>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-muted-foreground">Status</p>
          </div>
          <p className="text-lg font-bold text-foreground">{autopilotEnabled ? "Active" : "Standby"}</p>
        </Card>
        <Card className="glass rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Current Draw</p>
          <p className="text-lg font-bold font-mono text-foreground" suppressHydrationWarning>
            {mounted ? `${currentPower.toFixed(1)} kW` : "-- kW"}
          </p>
        </Card>
        <Card className="glass rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Actions Today</p>
          <p className="text-lg font-bold text-foreground">{actionsToday}</p>
        </Card>
        <Card className="glass rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Energy Saved</p>
          <p className="text-lg font-bold text-primary">{totalSavings} Wh</p>
        </Card>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Autopilot Actions Feed */}
        <Card className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              AI Actions Feed
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Real-time autonomous decisions</p>
          </div>
          <div className="p-5">
            {!autopilotEnabled ? (
              <div className="text-center py-10">
                <Cpu className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Enable Autopilot to see AI actions</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {actions.map((action, i) => (
                  <div
                    key={action.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-all duration-500",
                      i === 0 ? "animate-slide-in" : "",
                      getActionColor(action.type)
                    )}
                    style={{ opacity: Math.max(0.3, 1 - i * 0.08) }}
                  >
                    <div className="mt-0.5">{getActionIcon(action.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug">{action.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono" suppressHydrationWarning>{action.time}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary shrink-0">-{action.savings} Wh</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Column 2: Live Energy Pulse */}
        <Card className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                Live Energy Pulse
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Real-time power monitoring</p>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-500" />
              <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-500">LIVE</Badge>
            </div>
          </div>

          <div className="p-5">
            {/* Power Reading */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold font-mono text-foreground" suppressHydrationWarning>
                {mounted ? `${(totalWatts / 1000).toFixed(2)}` : "--"}
              </span>
              <span className="text-sm text-muted-foreground">kW</span>
              <span className="text-xs text-emerald-500 ml-auto font-medium" suppressHydrationWarning>
                {mounted ? `${((totalWatts / 1000) * 8).toFixed(0)} INR/hr` : ""}
              </span>
            </div>

            {/* Waveform */}
            <div className="h-20 flex items-end gap-[2px] overflow-hidden rounded-lg bg-muted/30 p-1 mb-4">
              {pulseData.map((value, i) => {
                const height = maxPulse > 0 ? (value / maxPulse) * 100 : 10
                const isLast = i === pulseData.length - 1
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-sm transition-all duration-500 min-w-[2px]",
                      isLast ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-emerald-500/40"
                    )}
                    style={{ height: `${Math.max(5, height)}%` }}
                  />
                )
              })}
              {Array.from({ length: Math.max(0, 40 - pulseData.length) }).map((_, i) => (
                <div key={`e-${i}`} className="flex-1 rounded-sm bg-muted/30 min-w-[2px]" style={{ height: "5%" }} />
              ))}
            </div>

            {/* Appliance Grid */}
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Appliances</p>
            <div className="grid grid-cols-2 gap-2">
              {appliances.map(app => {
                const Icon = app.icon
                const isActive = app.status === "on"
                const isStandby = app.status === "standby"
                return (
                  <div key={app.id} className={cn(
                    "flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300",
                    isActive ? "border-primary/20 bg-primary/5" : isStandby ? "border-amber-500/20 bg-amber-500/5" : "border-border/30 bg-muted/20 opacity-50"
                  )}>
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", isActive ? "bg-primary/10" : isStandby ? "bg-amber-500/10" : "bg-muted/30")}>
                      <Icon className={cn("w-3.5 h-3.5", isActive ? app.color : isStandby ? "text-amber-400" : "text-muted-foreground/50")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-foreground truncate">{app.name}</p>
                      <div className="flex items-center gap-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-500" : isStandby ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/30")} />
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

        {/* Column 3: Demo Mode */}
        <Card className={cn(
          "glass rounded-2xl overflow-hidden transition-all duration-500",
          demoPlaying && "ring-2 ring-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        )}>
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                Demo Mode
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Auto-play AI showcase</p>
            </div>
            {!demoPlaying && !demoCompleted ? (
              <Button onClick={startDemo} size="sm" className="rounded-xl bg-primary hover:bg-primary/90 gap-1.5">
                <Play className="w-3.5 h-3.5" /> Start
              </Button>
            ) : demoPlaying ? (
              <div className="flex gap-2">
                <Button onClick={advanceDemo} size="sm" variant="outline" className="rounded-xl"><SkipForward className="w-3.5 h-3.5" /></Button>
                <Button onClick={() => { setDemoPlaying(false); setDemoProgress(0) }} size="sm" variant="outline" className="rounded-xl text-destructive"><Square className="w-3.5 h-3.5" /></Button>
              </div>
            ) : (
              <Button onClick={startDemo} size="sm" className="rounded-xl bg-primary hover:bg-primary/90 gap-1.5">
                <Play className="w-3.5 h-3.5" /> Replay
              </Button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="px-5 py-3 flex items-center gap-1.5 border-b border-border/30">
            {demoSteps.map((s, i) => (
              <div key={s.id} className={cn(
                "flex-1 h-1.5 rounded-full transition-all duration-500 overflow-hidden",
                i < demoStep ? "bg-primary" : i === demoStep ? "bg-primary/30" : "bg-muted"
              )}>
                {i === demoStep && demoPlaying && (
                  <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${demoProgress}%` }} />
                )}
              </div>
            ))}
          </div>

          <div className="p-5">
            {!demoPlaying && !demoCompleted ? (
              <div className="text-center py-10">
                <Sparkles className="w-10 h-10 text-primary/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Click Start to showcase AI capabilities</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", demoCompleted ? "bg-primary/10" : "bg-primary/10 animate-pulse")}>
                    <DemoIcon className={cn("w-6 h-6", currentDemoStep?.color || "text-primary")} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{currentDemoStep?.title}</h4>
                      <Badge variant="outline" className="text-[10px]">{demoStep + 1}/{demoSteps.length}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{currentDemoStep?.description}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border/30 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-3xl font-bold font-mono text-foreground">{currentDemoStep?.metric}</p>
                    <p className="text-xs text-muted-foreground mt-1">{currentDemoStep?.metricLabel}</p>
                  </div>
                  {demoPlaying && (
                    <div className="w-20">
                      <Progress value={demoProgress} className="h-1.5" />
                    </div>
                  )}
                </div>

                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Projected Annual Savings</p>
                  <p className="text-2xl font-bold font-mono text-primary">{savingsCounter.toLocaleString()} INR</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
