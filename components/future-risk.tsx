'use client'

import { AlertTriangle, TrendingUp, Calendar, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface RiskAlert {
  date: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  message: string
  predictedBill: number
  reason: string
  actionable: string
}

interface FutureRiskProps {
  alerts: RiskAlert[]
}

export function FutureRiskPrediction({ alerts }: FutureRiskProps) {
  const getRiskColor = (level: RiskAlert['riskLevel']) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-600'
      case 'high':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-600'
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-600'
      default:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
    }
  }

  const getRiskIcon = (level: RiskAlert['riskLevel']) => {
    switch (level) {
      case 'critical':
      case 'high':
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const sortedAlerts = [...alerts].sort((a, b) => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
  })

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Future Risk Alerts</h3>
        <p className="text-sm text-muted-foreground mt-1">Predictive alerts for the next 7 days</p>
      </div>

      <div className="space-y-3">
        {sortedAlerts.map((alert, idx) => (
          <div key={idx} className={cn('p-4 rounded-xl border', getRiskColor(alert.riskLevel))}>
            <div className="flex items-start gap-3 mb-2">
              <div>{getRiskIcon(alert.riskLevel)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{alert.date}</p>
                  <Badge variant="outline" className={`text-xs ${
                    alert.riskLevel === 'critical' ? 'bg-red-500/20 text-red-600 border-red-500/30' :
                    alert.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-600 border-orange-500/30' :
                    alert.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-600 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                  }`}>
                    {alert.riskLevel.charAt(0).toUpperCase() + alert.riskLevel.slice(1)} Risk
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-1">{alert.message}</p>
                <p className="text-sm opacity-90 mb-2">{alert.reason}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs opacity-75">Predicted Bill: ₹{alert.predictedBill}</p>
                  <p className="text-xs font-medium">{alert.actionable}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Alerts This Week</p>
          <p className="text-xl font-bold text-foreground">{sortedAlerts.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Avg Predicted Bill</p>
          <p className="text-xl font-bold text-foreground">
            ₹{Math.round(sortedAlerts.reduce((a, b) => a + b.predictedBill, 0) / sortedAlerts.length)}
          </p>
        </div>
      </div>
    </div>
  )
}

// Weekly Forecast
interface DayForecast {
  day: string
  temperature: number
  usage: number
  bill: number
  weather: string
}

interface WeeklyForecastProps {
  forecast: DayForecast[]
}

export function WeeklyEnergyForecast({ forecast }: WeeklyForecastProps) {
  const highestUsageDay = forecast.reduce((max, day) => day.usage > max.usage ? day : max)
  const lowestUsageDay = forecast.reduce((min, day) => day.usage < min.usage ? day : min)
  const totalBill = forecast.reduce((sum, day) => sum + day.bill, 0)

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">7-Day Energy Forecast</h3>

      {/* Daily Forecast */}
      <div className="grid grid-cols-7 gap-2">
        {forecast.map((day) => (
          <div key={day.day} className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
            <p className="text-xs font-medium text-muted-foreground mb-2">{day.day}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-foreground">{day.usage}</span>
                <span className="text-xs text-muted-foreground">kWh</span>
              </div>
              <p className="text-xs text-muted-foreground">₹{day.bill}</p>
              <p className="text-xs text-muted-foreground">{day.temperature}°C</p>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast Insights */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-600 font-medium mb-1">Highest Usage</p>
          <p className="text-sm font-bold text-amber-600">{highestUsageDay.day}</p>
          <p className="text-xs text-muted-foreground">{highestUsageDay.usage} kWh</p>
        </div>

        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs text-emerald-600 font-medium mb-1">Lowest Usage</p>
          <p className="text-sm font-bold text-emerald-600">{lowestUsageDay.day}</p>
          <p className="text-xs text-muted-foreground">{lowestUsageDay.usage} kWh</p>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-primary font-medium mb-1">Weekly Bill</p>
          <p className="text-sm font-bold text-primary">₹{totalBill}</p>
          <p className="text-xs text-muted-foreground">{Math.round(totalBill / forecast.length)}/day avg</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
        <p className="text-sm font-medium text-foreground mb-1">Recommended Action</p>
        <p className="text-sm text-muted-foreground">
          {highestUsageDay.temperature > 35
            ? `High temperature expected on ${highestUsageDay.day} (${highestUsageDay.temperature}°C). Set AC to 26°C to reduce usage by 10%.`
            : `Weather looks favorable. Consider heavy appliance loads on ${lowestUsageDay.day} to save on peak rates.`}
        </p>
      </div>
    </div>
  )
}

// Real-time Usage Monitor
interface RealtimeData {
  currentUsage: number
  targetUsage: number
  timeRemaining: number // minutes
  trend: 'increasing' | 'stable' | 'decreasing'
  peakRisk: boolean
}

export function RealtimeUsageMonitor({ currentUsage, targetUsage, timeRemaining, trend, peakRisk }: RealtimeData) {
  const usagePercent = Math.round((currentUsage / targetUsage) * 100)
  const isExceeding = currentUsage > targetUsage

  return (
    <div className={cn(
      'glass rounded-2xl p-6 space-y-4 border-l-4',
      isExceeding ? 'border-l-red-500' : peakRisk ? 'border-l-amber-500' : 'border-l-emerald-500'
    )}>
      <div>
        <h3 className="text-lg font-semibold text-foreground">Real-Time Usage Monitor</h3>
        <p className="text-sm text-muted-foreground mt-1">Live energy consumption tracking</p>
      </div>

      {/* Current Usage */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Current Usage</span>
          <span className={`text-2xl font-bold ${isExceeding ? 'text-red-600' : 'text-foreground'}`}>
            {currentUsage} kW
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-500',
              isExceeding ? 'bg-red-500' : peakRisk ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isExceeding ? `⚠️ Exceeding by ${currentUsage - targetUsage} kW` : `${Math.round(100 - usagePercent)}% below target`}
        </p>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Target</p>
          <p className="text-lg font-bold text-foreground">{targetUsage} kW</p>
        </div>
        <div className={cn('p-3 rounded-lg', trend === 'increasing' ? 'bg-red-500/10' : trend === 'stable' ? 'bg-blue-500/10' : 'bg-emerald-500/10')}>
          <p className="text-xs text-muted-foreground mb-1">Trend</p>
          <p className={`text-lg font-bold ${trend === 'increasing' ? 'text-red-600' : trend === 'stable' ? 'text-blue-600' : 'text-emerald-600'}`}>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Time Left</p>
          <p className="text-lg font-bold text-foreground">{Math.floor(timeRemaining / 60)}h {timeRemaining % 60}m</p>
        </div>
      </div>

      {/* Alert */}
      {isExceeding && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-sm font-medium text-red-600">Usage Alert</p>
          <p className="text-xs text-muted-foreground mt-1">Immediately reduce appliance usage to avoid peak surcharges</p>
        </div>
      )}
    </div>
  )
}
