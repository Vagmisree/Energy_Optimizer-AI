"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

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
  
  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 60) return "Good"
    if (s >= 40) return "Fair"
    return "Needs Improvement"
  }
  
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  
  return (
    <div className={cn("glass rounded-2xl p-6", className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-4">Energy Score</h3>
        
        <div className="relative w-32 h-32 mx-auto">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))",
              }}
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold tabular-nums", getScoreColor(animatedScore))}>
              {animatedScore}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        
        <p className={cn("mt-4 font-medium", getScoreColor(score))}>
          {getScoreLabel(score)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Based on your usage patterns
        </p>
      </div>
    </div>
  )
}
