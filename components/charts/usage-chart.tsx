"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
} from "recharts"
import { monthlyData } from "@/lib/energy-data"
import { TrendingUp, TrendingDown, Zap } from "lucide-react"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-4 shadow-lg border border-border min-w-[160px]">
        <p className="font-semibold text-foreground text-lg mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-bold text-foreground">{entry.value} kWh</span>
          </div>
        ))}
        {payload.length === 2 && (
          <div className={`flex items-center gap-1 mt-2 pt-2 border-t border-border text-sm ${
            payload[0].value < payload[1].value ? 'text-emerald-500' : 'text-amber-500'
          }`}>
            {payload[0].value < payload[1].value ? (
              <>
                <TrendingDown className="w-4 h-4" />
                <span>Under prediction</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Over prediction</span>
              </>
            )}
          </div>
        )}
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
  
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Usage vs Prediction</h3>
          <p className="text-sm text-muted-foreground">Monthly energy consumption trends</p>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
            change <= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
            {change <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            {changePercent}%
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={monthlyData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6} />
                <stop offset="50%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.5} />
                <stop offset="50%" stopColor="hsl(var(--chart-2))" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={45}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="usage"
              name="Actual Usage"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              fill="url(#usageGradient)"
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4, stroke: "hsl(var(--background))" }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2, fill: "hsl(var(--background))" }}
            />
            <Area
              type="monotone"
              dataKey="prediction"
              name="AI Prediction"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="url(#predictionGradient)"
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3, stroke: "hsl(var(--background))" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full bg-chart-1" />
          <span className="text-sm text-muted-foreground">Actual Usage</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full bg-chart-2 opacity-70" style={{ borderStyle: 'dashed' }} />
          <span className="text-sm text-muted-foreground">AI Prediction</span>
        </div>
      </div>
    </div>
  )
}
