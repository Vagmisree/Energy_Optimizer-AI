'use client'

import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface HourlyData {
  hour: string
  usage: number
  isPeak: boolean
  temperature?: number
}

interface HeatmapProps {
  data: HourlyData[]
}

export function EnergyHeatmap({ data }: HeatmapProps) {
  // Normalize data for color intensity
  const maxUsage = Math.max(...data.map(d => d.usage))
  const minUsage = Math.min(...data.map(d => d.usage))
  const range = maxUsage - minUsage || 1

  const getIntensity = (usage: number) => {
    const normalized = (usage - minUsage) / range
    return Math.round(normalized * 100)
  }

  const getColor = (usage: number, isPeak: boolean) => {
    const intensity = getIntensity(usage)
    if (isPeak) {
      if (intensity > 75) return 'bg-chart-5 text-white'
      if (intensity > 50) return 'bg-orange-500/80 text-white'
      return 'bg-orange-500/40 text-foreground'
    }
    if (intensity > 75) return 'bg-chart-1/80 text-white'
    if (intensity > 50) return 'bg-chart-1/50 text-foreground'
    return 'bg-muted/50 text-foreground'
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Hourly Usage Heatmap</h3>
        <p className="text-sm text-muted-foreground mt-1">Intensity shows energy consumption throughout the day</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500/40" />
          <span className="text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500/80" />
          <span className="text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-chart-5" />
          <span className="text-muted-foreground">High</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-primary/50" />
          <span className="text-muted-foreground">Peak Hours</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-6 gap-2">
        {data.map((item, idx) => {
          const intensity = getIntensity(item.usage)
          return (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer border',
                getColor(item.usage, item.isPeak),
                item.isPeak ? 'border-chart-5' : 'border-transparent'
              )}
              title={`${item.hour}: ${item.usage} kWh`}
            >
              <p className="text-xs font-medium">{item.hour}</p>
              <p className="text-sm font-bold mt-1">{item.usage}</p>
              <p className="text-xs opacity-75 mt-1">{intensity}%</p>
            </div>
          )
        })}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Peak Hour Usage</p>
          <p className="text-lg font-bold text-chart-5">
            {Math.round(data.filter(d => d.isPeak).reduce((a, b) => a + b.usage, 0) / data.filter(d => d.isPeak).length)} kWh
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Off-Peak Average</p>
          <p className="text-lg font-bold text-chart-1">
            {Math.round(data.filter(d => !d.isPeak).reduce((a, b) => a + b.usage, 0) / data.filter(d => !d.isPeak).length)} kWh
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Peak Premium Cost</p>
          <p className="text-lg font-bold text-amber-500">₹{Math.round(
            data.filter(d => d.isPeak).reduce((a, b) => a + b.usage, 0) * 3
          )}</p>
        </div>
      </div>
    </div>
  )
}

// Appliance Efficiency Ranking
interface ApplianceEff {
  name: string
  efficiency: number
  monthlyUsage: number
  monthlyCost: number
  recommendation: string
}

interface ApplianceRankingProps {
  appliances: ApplianceEff[]
}

export function ApplianceEfficiencyRanking({ appliances }: ApplianceRankingProps) {
  const sorted = [...appliances].sort((a, b) => b.efficiency - a.efficiency)

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Appliance Efficiency Ranking</h3>
        <p className="text-sm text-muted-foreground mt-1">How efficiently your appliances are running</p>
      </div>

      <div className="space-y-3">
        {sorted.map((appliance, idx) => (
          <div key={appliance.name} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{appliance.name}</span>
                  <Badge variant="outline" className={appliance.efficiency > 80 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : appliance.efficiency > 60 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30'}>
                    {appliance.efficiency}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {appliance.monthlyUsage} kWh • ₹{appliance.monthlyCost}/month
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${appliance.efficiency > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {appliance.efficiency > 80 ? 'Excellent' : appliance.efficiency > 60 ? 'Good' : 'Poor'}
                </p>
              </div>
            </div>

            {/* Efficiency Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  appliance.efficiency > 80 ? 'bg-emerald-500' : appliance.efficiency > 60 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${appliance.efficiency}%` }}
              />
            </div>

            {/* Recommendation */}
            <p className="text-xs text-muted-foreground">{appliance.recommendation}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mt-4">
        <p className="text-sm font-medium text-foreground mb-2">Overall Efficiency Score</p>
        <p className="text-2xl font-bold text-primary">
          {Math.round(appliances.reduce((a, b) => a + b.efficiency, 0) / appliances.length)}%
        </p>
      </div>
    </div>
  )
}

// Peak vs Off-Peak Analyzer
interface PeakAnalysisProps {
  peakUsage: number
  offPeakUsage: number
  peakRate: number
  offPeakRate: number
}

export function PeakOffPeakAnalyzer({
  peakUsage,
  offPeakUsage,
  peakRate,
  offPeakRate,
}: PeakAnalysisProps) {
  const peakCost = peakUsage * peakRate
  const offPeakCost = offPeakUsage * offPeakRate
  const totalCost = peakCost + offPeakCost
  const peakPercent = Math.round((peakCost / totalCost) * 100)

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Peak vs Off-Peak Analysis</h3>

      {/* Cost Distribution */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Peak Hours (6PM-10PM)</span>
            <span className="text-sm font-bold text-chart-5">₹{Math.round(peakCost)}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-chart-5"
              style={{ width: `${peakPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{peakUsage} kWh at ₹{peakRate}/unit</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Off-Peak Hours</span>
            <span className="text-sm font-bold text-chart-1">₹{Math.round(offPeakCost)}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-chart-1"
              style={{ width: `${100 - peakPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{offPeakUsage} kWh at ₹{offPeakRate}/unit</p>
        </div>
      </div>

      {/* Opportunity */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-emerald-600">Shift Load to Off-Peak</p>
            <p className="text-sm text-muted-foreground mt-1">
              Moving {Math.round(peakUsage * 0.3)} kWh to off-peak could save ₹{Math.round((peakRate - offPeakRate) * peakUsage * 0.3)} monthly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
