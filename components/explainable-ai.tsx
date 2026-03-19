'use client'

import { AlertCircle, TrendingUp, TrendingDown, Zap, Lightbulb } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PredictionOutput, generateInsights, calculateWhatIfScenarios } from '@/lib/ml-prediction'

interface ExplainableAIPanelProps {
  prediction: PredictionOutput
  baseScenario?: any
}

export function ExplainableAIPanel({ prediction, baseScenario }: ExplainableAIPanelProps) {
  const insights = generateInsights(prediction)
  const breakdown = prediction.breakdown

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Why This Prediction?
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          AI explanation of your predicted bill breakdown
        </p>
      </div>

      {/* Confidence Score */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Prediction Confidence</p>
          <p className="text-2xl font-bold text-primary">{prediction.confidence}%</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs text-muted-foreground mb-1">Best Case</p>
          <p className="text-2xl font-bold text-emerald-500">₹{prediction.bestCase}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-muted-foreground mb-1">Worst Case</p>
          <p className="text-2xl font-bold text-amber-500">₹{prediction.worstCase}</p>
        </div>
      </div>

      {/* Bill Breakdown Visualization */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground text-sm">Bill Breakdown</h4>
        
        {/* Base Charge */}
        {breakdown.baseCharge > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Base Charge</span>
                <span className="text-sm font-medium">₹{breakdown.baseCharge}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/50"
                  style={{ width: `${(breakdown.baseCharge / prediction.expectedCase) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Peak Hour Cost */}
        {breakdown.peakHourCost > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Peak Hours Usage</span>
                <span className="text-sm font-medium">₹{Math.round(breakdown.peakHourCost)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-chart-4"
                  style={{ width: `${(breakdown.peakHourCost / prediction.expectedCase) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Top Appliances */}
        {Object.entries(breakdown.applianceCosts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([appliance, cost]) => (
            <div key={appliance} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    {appliance.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-medium">₹{Math.round(cost)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent"
                    style={{ width: `${(cost / prediction.expectedCase) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* AI Insights */}
      <div className="space-y-2">
        <h4 className="font-medium text-foreground text-sm">Key Insights</h4>
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Zap className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">{insight}</p>
          </div>
        ))}
      </div>

      {/* Additional Charges */}
      {breakdown.additionalCharges > 0 && (
        <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-secondary" />
            <span className="font-medium text-secondary">Additional Charges</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Taxes and surcharges: ₹{Math.round(breakdown.additionalCharges)}
          </p>
        </div>
      )}
    </div>
  )
}

// Comparison component for before/after
interface ComparisonPanelProps {
  current: PredictionOutput
  optimized: PredictionOutput
}

export function ComparisonPanel({ current, optimized }: ComparisonPanelProps) {
  const savings = current.predictedBill - optimized.predictedBill
  const savingsPercent = Math.round((savings / current.predictedBill) * 100)

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Impact of Optimization</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-2">Current Bill</p>
          <p className="text-3xl font-bold text-foreground">₹{current.predictedBill}</p>
          <p className="text-xs text-muted-foreground mt-2">With confidence {current.confidence}%</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <p className="text-xs text-muted-foreground mb-2">After Optimization</p>
          <p className="text-3xl font-bold text-emerald-500">₹{optimized.predictedBill}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500">
            <TrendingDown className="w-3 h-3" />
            Save ₹{savings}/month ({savingsPercent}%)
          </div>
        </div>
      </div>

      {/* Annual Savings */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20">
        <p className="text-sm text-muted-foreground mb-1">Annual Savings</p>
        <p className="text-2xl font-bold text-emerald-500">₹{savings * 12}</p>
        <p className="text-xs text-muted-foreground mt-2">Equivalent to {Math.round((savings * 12) / 100)} units saved</p>
      </div>
    </div>
  )
}
