"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, IndianRupee, PiggyBank, TrendingDown, ArrowLeft, Lightbulb, CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animated-counter"
import { ExplainableAIPanel, ComparisonPanel } from "@/components/explainable-ai"
import { DataStorytellingPanel, UsageComparisonPanel } from "@/components/data-storytelling"
import { EnergyHeatmap, ApplianceEfficiencyRanking, PeakOffPeakAnalyzer } from "@/components/advanced-analytics"
import { GuidedUserFlow, WeeklyAISummary } from "@/components/guided-flow"
import { FutureRiskPrediction, WeeklyEnergyForecast, RealtimeUsageMonitor } from "@/components/future-risk"
import { predictEnergyBill } from "@/lib/ml-prediction"
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
  const [mlPrediction, setMlPrediction] = useState<any>(null)

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

    // Calculate ML prediction
    const mlResult = predictEnergyBill({
      units: analysisData.units,
      appliances: analysisData.appliances || [],
      peakHours: analysisData.isPeakUsage ? 20 : 8,
      historicalUsage: [340, 335, 345, 350, 360, 355],
    })
    setMlPrediction(mlResult)
  }, [router])

  if (!data || !results || !mlPrediction) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const minSavings = Math.round(results.potentialSavings * 0.7)
  const maxSavings = Math.round(results.potentialSavings * 1.3)

  // Generate mock data for heatmap
  const heatmapData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    usage: Math.sin(i / 24 * Math.PI) * 2 + 2 + Math.random() * 0.5,
    isPeak: i >= 18 && i < 22,
  }))

  const monthlyTrend = [
    { month: 'Apr', usage: 330, bill: 1850 },
    { month: 'May', usage: 345, bill: 1920 },
    { month: 'Jun', usage: data.units, bill: results.estimatedBill },
  ]

  const appliances = [
    { name: 'AC', efficiency: 75, monthlyUsage: 150, monthlyCost: 1200, recommendation: 'Set temperature to 26°C to save 20%' },
    { name: 'Fridge', efficiency: 85, monthlyUsage: 80, monthlyCost: 400, recommendation: 'Already efficient' },
    { name: 'Water Heater', efficiency: 65, monthlyUsage: 100, monthlyCost: 500, recommendation: 'Consider solar option' },
    { name: 'Lighting', efficiency: 90, monthlyUsage: 30, monthlyCost: 150, recommendation: 'Good usage pattern' },
  ]

  const riskAlerts = [
    {
      date: 'Tomorrow',
      riskLevel: 'high' as const,
      message: 'High temperature alert',
      predictedBill: 2200,
      reason: 'Temperature forecast: 38°C, AC usage likely to increase',
      actionable: 'Pre-cool your home at off-peak hours',
    },
    {
      date: 'Weekend',
      riskLevel: 'medium' as const,
      message: 'Usage spike predicted',
      predictedBill: 2100,
      reason: 'Weekends typically see 25% higher usage',
      actionable: 'Schedule AC maintenance',
    },
  ]

  const forecast = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    temperature: 35 + Math.random() * 3,
    usage: 350 + Math.random() * 50,
    bill: 2000 + Math.random() * 300,
    weather: 'Sunny',
  }))

  const weeklySummary = {
    period: 'This week',
    usageChange: -15,
    billChange: -750,
    topInsight: 'Your AC optimization efforts saved 15% this week!',
    recommendations: [
      'Continue shifting loads to off-peak hours',
      'Maintain current temperature settings',
      'Monitor appliance efficiency',
    ],
    achievements: [
      'Reduced peak usage by 15%',
      'Maintained 7-day optimization streak',
      'Saved ₹750 vs previous week',
    ],
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/analyze">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your AI Energy Analysis
          </h1>
          <p className="text-muted-foreground">ML-powered predictions and optimization strategies</p>
        </div>
        <Button size="sm" className="rounded-lg">
          <Download className="w-4 h-4 mr-2" />
          Report
        </Button>
      </div>

      {/* Guided Flow */}
      <GuidedUserFlow currentStep="analyze" />

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
              <AnimatedCounter value={mlPrediction.expectedCase / 8} suffix=" kWh" />
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
              <AnimatedCounter value={mlPrediction.predictedBill} prefix="₹" />
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

      {/* Prediction Confidence */}
      <div className="glass rounded-2xl p-8 border-2 border-primary/30 relative overflow-hidden animate-pulse-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Save ₹{minSavings} - ₹{maxSavings}/month
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            AI Confidence: {mlPrediction.confidence}% • Range: ₹{mlPrediction.bestCase} - ₹{mlPrediction.worstCase}
          </p>
        </div>
      </div>

      {/* Explainable AI */}
      <ExplainableAIPanel prediction={mlPrediction} />

      {/* Data Storytelling */}
      <DataStorytellingPanel
        currentMonth={{ month: 'Jun', usage: data.units, bill: mlPrediction.predictedBill }}
        lastMonth={{ month: 'May', usage: 345, bill: 1920 }}
        monthlyTrend={monthlyTrend}
      />

      {/* Comparison */}
      <ComparisonPanel 
        current={mlPrediction} 
        optimized={{
          ...mlPrediction,
          predictedBill: Math.round(mlPrediction.predictedBill * 0.75),
          bestCase: Math.round(mlPrediction.bestCase * 0.75),
          worstCase: Math.round(mlPrediction.worstCase * 0.75),
        }} 
      />

      {/* Usage vs Average */}
      <UsageComparisonPanel
        userUsage={data.units}
        avgUsage={345}
        userBill={mlPrediction.predictedBill}
        avgBill={1920}
      />

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnergyHeatmap data={heatmapData} />
        <PeakOffPeakAnalyzer
          peakUsage={Math.round(data.units * 0.4)}
          offPeakUsage={Math.round(data.units * 0.6)}
          peakRate={8}
          offPeakRate={5}
        />
      </div>

      <ApplianceEfficiencyRanking appliances={appliances} />

      {/* Future Risk & Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FutureRiskPrediction alerts={riskAlerts} />
        <WeeklyEnergyForecast forecast={forecast} />
      </div>

      {/* Real-time Monitor */}
      <RealtimeUsageMonitor
        currentUsage={2.5}
        targetUsage={3}
        timeRemaining={480}
        trend="stable"
        peakRisk={false}
      />

      {/* Weekly Summary */}
      <WeeklyAISummary data={weeklySummary} />

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
          className="flex-1 h-12 rounded-xl"
        >
          Get AI Recommendations
        </Button>
        <Button
          onClick={() => router.push("/simulator")}
          className="flex-1 h-12 rounded-xl"
          variant="outline"
        >
          Run Simulation
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
