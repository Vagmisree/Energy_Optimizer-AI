"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ComposedChart,
  Bar,
  Cell,
} from "recharts"
import { monthlyData } from "@/lib/energy-data"
import { TrendingUp, TrendingDown, Zap, Target } from "lucide-react"

// Vibrant colors
const COLORS = {
  actual: "#10B981",      // Emerald green
  prediction: "#8B5CF6",  // Purple
  savings: "#06B6D4",     // Cyan
  overuse: "#F59E0B",     // Amber
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; dataKey: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    const usage = payload.find(p => p.dataKey === 'usage')?.value || 0
    const prediction = payload.find(p => p.dataKey === 'prediction')?.value || 0
    const diff = usage - prediction
    const isUnder = diff < 0
    
    return (
      <div className="bg-background/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-primary/30 min-w-[180px]">
        <p className="font-bold text-foreground text-xl mb-3">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.actual }} />
              <span className="text-sm text-muted-foreground">Actual</span>
            </div>
            <span className="font-bold text-foreground">{usage} kWh</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.prediction }} />
              <span className="text-sm text-muted-foreground">Predicted</span>
            </div>
            <span className="font-bold text-foreground">{prediction} kWh</span>
          </div>
          <div className={`flex items-center gap-2 pt-2 mt-2 border-t border-border ${isUnder ? 'text-emerald-500' : 'text-amber-500'}`}>
            {isUnder ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            <span className="text-sm font-semibold">
              {isUnder ? 'Saved' : 'Over by'} {Math.abs(diff)} kWh
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function UsageChart() {
  const latestUsage = monthlyData[monthlyData.length - 1]?.usage || 0
  const prevUsage = monthlyData[monthlyData.length - 2]?.usage || 0
  const change = latestUsage - prevUsage
  const changePercent = prevUsage ? ((change / prevUsage) * 100).toFixed(1) : 0
  const avgUsage = Math.round(monthlyData.reduce((sum, d) => sum + d.usage, 0) / monthlyData.length)
  const totalUsage = monthlyData.reduce((sum, d) => sum + d.usage, 0)
  
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Usage vs AI Prediction</h3>
          <p className="text-sm text-muted-foreground">12-month energy consumption analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
            change <= 0 ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'
          }`} style={{ boxShadow: change <= 0 ? '0 0 12px rgba(16, 185, 129, 0.3)' : '0 0 12px rgba(245, 158, 11, 0.3)' }}>
            {change <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            {change <= 0 ? '' : '+'}{changePercent}%
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={monthlyData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="usageGradientNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.actual} stopOpacity={0.7} />
                <stop offset="50%" stopColor={COLORS.actual} stopOpacity={0.3} />
                <stop offset="100%" stopColor={COLORS.actual} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="predictionGradientNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.prediction} stopOpacity={0.5} />
                <stop offset="50%" stopColor={COLORS.prediction} stopOpacity={0.2} />
                <stop offset="100%" stopColor={COLORS.prediction} stopOpacity={0.02} />
              </linearGradient>
              <filter id="glowGreen">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 2 }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={40}
              domain={['dataMin - 30', 'dataMax + 30']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="prediction"
              name="AI Prediction"
              stroke={COLORS.prediction}
              strokeWidth={2}
              strokeDasharray="8 4"
              fill="url(#predictionGradientNew)"
              dot={{ fill: COLORS.prediction, strokeWidth: 2, r: 3, stroke: "hsl(var(--background))" }}
            />
            <Area
              type="monotone"
              dataKey="usage"
              name="Actual Usage"
              stroke={COLORS.actual}
              strokeWidth={3}
              fill="url(#usageGradientNew)"
              dot={{ fill: COLORS.actual, strokeWidth: 2, r: 5, stroke: "hsl(var(--background))" }}
              activeDot={{ 
                r: 8, 
                stroke: COLORS.actual, 
                strokeWidth: 3, 
                fill: "hsl(var(--background))",
                style: { filter: `drop-shadow(0 0 8px ${COLORS.actual})` }
              }}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: COLORS.actual, boxShadow: `0 0 8px ${COLORS.actual}` }} />
          <span className="text-sm text-muted-foreground">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full opacity-70" style={{ backgroundColor: COLORS.prediction, boxShadow: `0 0 6px ${COLORS.prediction}` }} />
          <span className="text-sm text-muted-foreground">Prediction</span>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Avg Monthly</p>
          <p className="text-sm font-bold text-foreground">{avgUsage} kWh</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Total Year</p>
          <p className="text-sm font-bold text-primary">{totalUsage.toLocaleString()} kWh</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="text-sm font-bold" style={{ color: COLORS.actual }}>{latestUsage} kWh</p>
        </div>
      </div>
    </div>
  )
}
