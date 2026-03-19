"use client"

import { AlertTriangle, Lightbulb, CheckCircle, Info, IndianRupee, Sparkles, ArrowRight } from "lucide-react"
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
    bg: "bg-gradient-to-br from-amber-500/15 to-orange-500/10",
    border: "border-amber-500/40",
    icon: "text-amber-500",
    glow: "hover:shadow-amber-500/20",
  },
  tip: {
    bg: "bg-gradient-to-br from-primary/15 to-emerald-500/10",
    border: "border-primary/40",
    icon: "text-primary",
    glow: "hover:shadow-primary/20",
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-500/15 to-teal-500/10",
    border: "border-emerald-500/40",
    icon: "text-emerald-500",
    glow: "hover:shadow-emerald-500/20",
  },
  info: {
    bg: "bg-gradient-to-br from-blue-500/15 to-cyan-500/10",
    border: "border-blue-500/40",
    icon: "text-blue-500",
    glow: "hover:shadow-blue-500/20",
  },
}

export function AIInsightsPanel() {
  const totalSavings = aiInsights.reduce((sum, insight) => sum + insight.savings, 0)
  
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
              <p className="text-xs text-muted-foreground">Personalized recommendations</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Potential savings</p>
            <p className="text-lg font-bold text-primary">₹{totalSavings}/mo</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-auto">
        {aiInsights.map((insight, index) => {
          const Icon = iconMap[insight.type as keyof typeof iconMap]
          const colors = colorMap[insight.type as keyof typeof colorMap]
          
          return (
            <div
              key={insight.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group hover:shadow-lg",
                colors.bg,
                colors.border,
                colors.glow
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 p-2 rounded-lg bg-background/50",
                  colors.icon
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground text-sm">{insight.title}</p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      <IndianRupee className="w-3 h-3" />
                      <span className="text-xs font-semibold">Save ₹{insight.savings}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* View all link */}
      <div className="pt-4 mt-auto border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View all insights
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
