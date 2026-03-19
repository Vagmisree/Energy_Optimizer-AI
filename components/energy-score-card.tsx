"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, Zap, Leaf, Target } from "lucide-react"

interface EnergyScoreCardProps {
  score: number
  className?: string
}

export function EnergyScoreCard({ score, className }: EnergyScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - start
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      
      setAnimatedScore(Math.round(easeOut * score))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [score])
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-500"
    if (s >= 60) return "text-primary"
    if (s >= 40) return "text-amber-500"
    return "text-destructive"
  }
  
  const getScoreGradient = (s: number) => {
    if (s >= 80) return "from-emerald-500 to-teal-400"
    if (s >= 60) return "from-primary to-accent"
    if (s >= 40) return "from-amber-500 to-orange-400"
    return "from-red-500 to-rose-400"
  }
  
  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 60) return "Good"
    if (s >= 40) return "Fair"
    return "Needs Improvement"
  }
  
  const circumference = 2 * Math.PI * 50
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  
  const metrics = [
    { icon: Zap, label: "Efficiency", value: "78%", color: "text-primary" },
    { icon: Leaf, label: "Eco Score", value: "85%", color: "text-emerald-500" },
    { icon: TrendingUp, label: "Trend", value: "+5%", color: "text-cyan-500" },
  ]
  
  return (
    <div className={cn("glass rounded-2xl p-6 flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Energy Score</h3>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-36 h-36">
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-30 bg-gradient-to-br",
            getScoreGradient(score)
          )} />
          
          {/* Background circle */}
          <svg className="w-36 h-36 transform -rotate-90 relative z-10">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <circle
              cx="72"
              cy="72"
              r="50"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
              opacity={0.3}
            />
            {/* Progress circle */}
            <circle
              cx="72"
              cy="72"
              r="50"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.6))",
              }}
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className={cn("text-5xl font-bold tabular-nums", getScoreColor(animatedScore))}>
              {animatedScore}
            </span>
            <span className="text-sm text-muted-foreground font-medium">/100</span>
          </div>
        </div>
        
        <div className={cn(
          "mt-4 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r",
          getScoreGradient(score),
          "text-white"
        )}>
          {getScoreLabel(score)}
        </div>
      </div>
      
      {/* Mini metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="text-center">
              <Icon className={cn("w-4 h-4 mx-auto mb-1", metric.color)} />
              <p className="text-sm font-bold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
