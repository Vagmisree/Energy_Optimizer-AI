"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Square,
  SkipForward,
  Zap,
  TrendingDown,
  Leaf,
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DemoStep {
  id: number
  title: string
  description: string
  icon: typeof Zap
  metric: string
  metricLabel: string
  color: string
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Scanning Energy Data",
    description: "AI is analyzing 12 months of consumption patterns across all appliances...",
    icon: Brain,
    metric: "342 kWh",
    metricLabel: "Current Monthly Usage",
    color: "text-cyan-400",
  },
  {
    id: 2,
    title: "AI Predictions Running",
    description: "Machine learning model predicting next month's bill with 94% accuracy...",
    icon: Sparkles,
    metric: "94.2%",
    metricLabel: "Prediction Confidence",
    color: "text-purple-400",
  },
  {
    id: 3,
    title: "Optimizing Schedule",
    description: "Shifting high-consumption appliances to off-peak hours automatically...",
    icon: Zap,
    metric: "38%",
    metricLabel: "Peak Hour Reduction",
    color: "text-amber-400",
  },
  {
    id: 4,
    title: "Applying AI Autopilot",
    description: "Autonomous decisions: AC adjusted, standby eliminated, loads balanced...",
    icon: TrendingDown,
    metric: "645",
    metricLabel: "Monthly Savings (INR)",
    color: "text-emerald-400",
  },
  {
    id: 5,
    title: "Environmental Impact",
    description: "Carbon footprint reduced by 18.5kg CO2 - equivalent to planting 3 trees...",
    icon: Leaf,
    metric: "18.5 kg",
    metricLabel: "CO2 Reduced",
    color: "text-green-400",
  },
  {
    id: 6,
    title: "Transformation Complete",
    description: "Bill reduced from 2,850 to 2,205 INR. Annual savings projected at 7,740 INR!",
    icon: CheckCircle2,
    metric: "7,740",
    metricLabel: "Annual Savings (INR)",
    color: "text-primary",
  },
]

export function DemoMode() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [savingsCounter, setSavingsCounter] = useState(0)

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= demoSteps.length - 1) {
        setIsPlaying(false)
        setCompleted(true)
        return prev
      }
      return prev + 1
    })
    setStepProgress(0)
  }, [])

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return
    const progressInterval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) {
          advanceStep()
          return 0
        }
        return prev + 2.5
      })
    }, 100)
    return () => clearInterval(progressInterval)
  }, [isPlaying, advanceStep])

  // Savings counter animation
  useEffect(() => {
    if (!isPlaying && !completed) return
    const targetSavings = completed ? 7740 : Math.round((currentStep / demoSteps.length) * 7740)
    const interval = setInterval(() => {
      setSavingsCounter((prev) => {
        if (prev >= targetSavings) return targetSavings
        return prev + Math.ceil((targetSavings - prev) / 10)
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, completed])

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    setStepProgress(0)
    setCompleted(false)
    setSavingsCounter(0)
  }

  const stopDemo = () => {
    setIsPlaying(false)
    setStepProgress(0)
  }

  const step = demoSteps[currentStep]
  const Icon = step?.icon || Zap

  return (
    <Card className={cn(
      "glass rounded-2xl overflow-hidden transition-all duration-500",
      isPlaying && "ring-2 ring-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
    )}>
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            isPlaying ? "bg-primary glow" : "bg-muted"
          )}>
            <Play className={cn("w-5 h-5", isPlaying ? "text-primary-foreground" : "text-muted-foreground")} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Demo Mode</h3>
            <p className="text-xs text-muted-foreground">Auto-play AI showcase</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isPlaying && !completed ? (
            <Button onClick={startDemo} size="sm" className="rounded-xl bg-primary hover:bg-primary/90 gap-1.5">
              <Play className="w-3.5 h-3.5" />
              Start Demo
            </Button>
          ) : isPlaying ? (
            <div className="flex gap-2">
              <Button onClick={advanceStep} size="sm" variant="outline" className="rounded-xl gap-1.5">
                <SkipForward className="w-3.5 h-3.5" />
                Skip
              </Button>
              <Button onClick={stopDemo} size="sm" variant="outline" className="rounded-xl gap-1.5 text-destructive border-destructive/30">
                <Square className="w-3.5 h-3.5" />
                Stop
              </Button>
            </div>
          ) : (
            <Button onClick={startDemo} size="sm" className="rounded-xl bg-primary hover:bg-primary/90 gap-1.5">
              <Play className="w-3.5 h-3.5" />
              Replay
            </Button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-5 py-3 flex items-center gap-1.5 border-b border-border/30">
        {demoSteps.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-all duration-500",
              i < currentStep
                ? "bg-primary"
                : i === currentStep
                ? "bg-primary/50"
                : "bg-muted"
            )}
          >
            {i === currentStep && isPlaying && (
              <div
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${stepProgress}%` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Display */}
      <div className="p-5">
        {!isPlaying && !completed ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Ready to showcase AI capabilities</p>
            <p className="text-xs text-muted-foreground mt-1">Click Start Demo to begin the automated walkthrough</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step Info */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
                completed ? "bg-primary/10" : "bg-primary/10 animate-pulse"
              )}>
                <Icon className={cn("w-6 h-6", step?.color || "text-primary")} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{step?.title}</h4>
                  <Badge variant="outline" className="text-[10px]">
                    Step {currentStep + 1}/{demoSteps.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{step?.description}</p>
              </div>
            </div>

            {/* Metric Display */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex-1">
                <p className="text-3xl font-bold font-mono text-foreground">{step?.metric}</p>
                <p className="text-xs text-muted-foreground mt-1">{step?.metricLabel}</p>
              </div>
              {isPlaying && (
                <div className="w-20">
                  <Progress value={stepProgress} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">{Math.round(stepProgress)}%</p>
                </div>
              )}
            </div>

            {/* Savings Counter */}
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Projected Annual Savings</p>
              <p className="text-2xl font-bold font-mono text-primary">
                {savingsCounter.toLocaleString()} INR
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
