"use client"

import { AlertTriangle, Lightbulb, CheckCircle, Info, IndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiInsights } from "@/lib/energy-data"

const iconMap = {
  warning: AlertTriangle,
  tip: Lightbulb,
  success: CheckCircle,
  info: Info,
}

const colorMap = {
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: "text-amber-500",
  },
  tip: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    icon: "text-primary",
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: "text-emerald-500",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-500",
  },
}

export function AIInsightsPanel() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
            <p className="text-xs text-muted-foreground">Personalized recommendations</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {aiInsights.map((insight) => {
          const Icon = iconMap[insight.type as keyof typeof iconMap]
          const colors = colorMap[insight.type as keyof typeof colorMap]
          
          return (
            <div
              key={insight.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                colors.bg,
                colors.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5", colors.icon)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-primary">
                    <IndianRupee className="w-3 h-3" />
                    <span className="text-xs font-semibold">Save ₹{insight.savings}/month</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
