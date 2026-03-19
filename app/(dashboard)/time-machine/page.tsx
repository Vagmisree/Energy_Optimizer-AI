"use client"

import { useState, useEffect } from "react"
import { Timer, ArrowRight, Sparkles, TrendingDown, IndianRupee, Leaf } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { AnimatedCounter } from "@/components/animated-counter"
import { cn } from "@/lib/utils"

const timelineData = {
  past: {
    label: "6 Months Ago",
    bill: 4200,
    usage: 525,
    co2: 78,
    score: 52,
  },
  current: {
    label: "Current",
    bill: 2850,
    usage: 342,
    co2: 51,
    score: 78,
  },
  optimized: {
    label: "With AI Optimization",
    bill: 1900,
    usage: 238,
    co2: 35,
    score: 92,
  },
  future: {
    label: "6 Months (Projected)",
    bill: 1500,
    usage: 188,
    co2: 28,
    score: 98,
  },
}

type TimelineKey = keyof typeof timelineData

export default function TimeMachinePage() {
  const [sliderValue, setSliderValue] = useState([50])
  const [currentData, setCurrentData] = useState(timelineData.current)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timeout = setTimeout(() => setIsAnimating(false), 500)

    const value = sliderValue[0]
    let key: TimelineKey

    if (value <= 25) {
      key = "past"
    } else if (value <= 50) {
      key = "current"
    } else if (value <= 75) {
      key = "optimized"
    } else {
      key = "future"
    }

    setCurrentData(timelineData[key])
    return () => clearTimeout(timeout)
  }, [sliderValue])

  const getTimelinePosition = (key: TimelineKey) => {
    const positions = { past: 0, current: 33, optimized: 66, future: 100 }
    return positions[key]
  }

  const isActive = (key: TimelineKey) => {
    const value = sliderValue[0]
    if (key === "past") return value <= 25
    if (key === "current") return value > 25 && value <= 50
    if (key === "optimized") return value > 50 && value <= 75
    return value > 75
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
            <Timer className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Energy Time Machine</h1>
            <p className="text-muted-foreground">
              Visualize your energy journey from past to optimized future
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="glass rounded-2xl p-8">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">Timeline Navigator</h3>
          <p className="text-sm text-muted-foreground">
            Slide to see how your energy profile changes over time
          </p>
        </div>

        {/* Timeline Markers */}
        <div className="relative mb-6">
          <div className="absolute inset-x-0 top-4 h-1 bg-border rounded-full" />
          <div
            className="absolute top-4 h-1 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${sliderValue[0]}%` }}
          />
          <div className="relative flex justify-between">
            {(Object.keys(timelineData) as TimelineKey[]).map((key) => (
              <div
                key={key}
                className="flex flex-col items-center"
                style={{ position: "absolute", left: `${getTimelinePosition(key)}%`, transform: "translateX(-50%)" }}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 z-10",
                    isActive(key)
                      ? "bg-primary border-primary glow-sm scale-110"
                      : "bg-background border-border"
                  )}
                >
                  {isActive(key) && (
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-3 text-xs font-medium whitespace-nowrap transition-colors",
                    isActive(key) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {timelineData[key].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 px-4">
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            min={0}
            step={1}
            className="py-4"
          />
        </div>
      </div>

      {/* Stats Display */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500",
          isAnimating && "opacity-50 scale-98"
        )}
      >
        {/* Bill */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <IndianRupee className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Monthly Bill</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              <AnimatedCounter value={currentData.bill} prefix="₹" duration={500} />
            </p>
            {currentData !== timelineData.current && (
              <p className={cn(
                "text-sm mt-2 font-medium",
                currentData.bill < timelineData.current.bill ? "text-emerald-500" : "text-amber-500"
              )}>
                {currentData.bill < timelineData.current.bill ? "↓" : "↑"} ₹{Math.abs(currentData.bill - timelineData.current.bill)} vs current
              </p>
            )}
          </div>
        </div>

        {/* Usage */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Energy Usage</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              <AnimatedCounter value={currentData.usage} suffix=" kWh" duration={500} />
            </p>
            {currentData !== timelineData.current && (
              <p className={cn(
                "text-sm mt-2 font-medium",
                currentData.usage < timelineData.current.usage ? "text-emerald-500" : "text-amber-500"
              )}>
                {currentData.usage < timelineData.current.usage ? "↓" : "↑"} {Math.abs(currentData.usage - timelineData.current.usage)} kWh vs current
              </p>
            )}
          </div>
        </div>

        {/* CO2 */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">CO2 Emissions</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              <AnimatedCounter value={currentData.co2} suffix=" kg" duration={500} />
            </p>
            {currentData !== timelineData.current && (
              <p className={cn(
                "text-sm mt-2 font-medium",
                currentData.co2 < timelineData.current.co2 ? "text-emerald-500" : "text-amber-500"
              )}>
                {currentData.co2 < timelineData.current.co2 ? "↓" : "↑"} {Math.abs(currentData.co2 - timelineData.current.co2)} kg vs current
              </p>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Energy Score</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              <AnimatedCounter value={currentData.score} suffix="/100" duration={500} />
            </p>
            {currentData !== timelineData.current && (
              <p className={cn(
                "text-sm mt-2 font-medium",
                currentData.score > timelineData.current.score ? "text-emerald-500" : "text-amber-500"
              )}>
                {currentData.score > timelineData.current.score ? "↑" : "↓"} {Math.abs(currentData.score - timelineData.current.score)} pts vs current
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Transformation Visual */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">Your Energy Transformation</h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-muted-foreground mb-2">Past (6 months ago)</p>
            <p className="text-2xl font-bold text-amber-500">₹4,200/mo</p>
            <p className="text-xs text-muted-foreground mt-1">525 kWh • Score: 52</p>
          </div>

          <ArrowRight className="w-8 h-8 text-muted-foreground shrink-0" />

          <div className="flex-1 text-center p-6 rounded-xl bg-primary/10 border border-primary/30 glow-sm">
            <p className="text-sm text-muted-foreground mb-2">Current</p>
            <p className="text-2xl font-bold text-primary">₹2,850/mo</p>
            <p className="text-xs text-muted-foreground mt-1">342 kWh • Score: 78</p>
          </div>

          <ArrowRight className="w-8 h-8 text-muted-foreground shrink-0" />

          <div className="flex-1 text-center p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-sm text-muted-foreground mb-2">Optimized Future</p>
            <p className="text-2xl font-bold text-emerald-500">₹1,500/mo</p>
            <p className="text-xs text-muted-foreground mt-1">188 kWh • Score: 98</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Total Potential Savings:</span>{" "}
            ₹2,700/month (64% reduction from 6 months ago)
          </p>
        </div>
      </div>
    </div>
  )
}
