"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, IndianRupee, PiggyBank, TrendingDown, ArrowLeft, Lightbulb, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/animated-counter"
import { calculateSavings } from "@/lib/energy-data"
import { cn } from "@/lib/utils"

interface AnalysisData {
  units: number
  appliances: string[]
  usageHours: number
  isPeakUsage: boolean
  location: string
}

const savingsTips = [
  {
    title: "Reduce AC by 2°C",
    description: "Raising AC temperature saves up to 15% energy",
    savings: "₹300-450/month",
    impact: "high",
  },
  {
    title: "Switch to LED",
    description: "LED bulbs use 75% less energy than incandescent",
    savings: "₹200-300/month",
    impact: "medium",
  },
  {
    title: "Off-Peak Laundry",
    description: "Run washing machine during off-peak hours",
    savings: "₹150-250/month",
    impact: "medium",
  },
  {
    title: "Smart Power Strips",
    description: "Eliminate phantom loads from standby devices",
    savings: "₹100-150/month",
    impact: "low",
  },
]

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalysisData | null>(null)
  const [results, setResults] = useState<{
    predictedUsage: number
    estimatedBill: number
    potentialSavings: number
  } | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("energyAnalysis")
    if (!stored) {
      router.push("/analyze")
      return
    }

    const analysisData: AnalysisData = JSON.parse(stored)
    setData(analysisData)

    const calculatedResults = calculateSavings(
      analysisData.units,
      analysisData.appliances,
      analysisData.usageHours,
      analysisData.isPeakUsage
    )
    setResults(calculatedResults)
  }, [router])

  if (!data || !results) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const minSavings = Math.round(results.potentialSavings * 0.7)
  const maxSavings = Math.round(results.potentialSavings * 1.3)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/analyze">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
          <p className="text-muted-foreground">AI-powered predictions based on your usage</p>
        </div>
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Predicted Usage */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Predicted Usage</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              <AnimatedCounter value={results.predictedUsage} suffix=" kWh" />
            </p>
          </div>
        </div>

        {/* Estimated Bill */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <IndianRupee className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Estimated Bill</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              <AnimatedCounter value={results.estimatedBill} prefix="₹" />
            </p>
          </div>
        </div>

        {/* Potential Savings */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <PiggyBank className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Potential Savings</p>
            <p className="text-3xl font-bold text-primary mt-1">
              <AnimatedCounter value={results.potentialSavings} prefix="₹" suffix="/mo" />
            </p>
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      <div className="glass rounded-2xl p-8 border-2 border-primary/30 relative overflow-hidden animate-pulse-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            You Can Save ₹{minSavings} - ₹{maxSavings}/month
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            By following our AI recommendations, you can significantly reduce your electricity bills
            while maintaining comfort.
          </p>
        </div>
      </div>

      {/* Savings Tips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Recommended Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsTips.map((tip, index) => (
            <div
              key={index}
              className="glass glass-hover rounded-xl p-5 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  tip.impact === "high" && "bg-emerald-500/10",
                  tip.impact === "medium" && "bg-primary/10",
                  tip.impact === "low" && "bg-muted"
                )}>
                  <CheckCircle className={cn(
                    "w-5 h-5",
                    tip.impact === "high" && "text-emerald-500",
                    tip.impact === "medium" && "text-primary",
                    tip.impact === "low" && "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                  <p className="text-sm font-semibold text-primary mt-2">{tip.savings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push("/assistant")}
          className="flex-1 h-12 rounded-xl glow"
        >
          Get AI Recommendations
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/analyze")}
          className="flex-1 h-12 rounded-xl"
        >
          Analyze Again
        </Button>
      </div>
    </div>
  )
}
