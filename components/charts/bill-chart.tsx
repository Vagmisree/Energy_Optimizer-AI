"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts"
import { monthlyData } from "@/lib/energy-data"
import { TrendingDown, TrendingUp, Zap } from "lucide-react"

// Vibrant color palette for bars
const MONTH_COLORS = {
  low: "#10B981",      // Emerald green - below average
  medium: "#F59E0B",   // Amber - at average
  high: "#EF4444",     // Red - above average
  summer: "#8B5CF6",   // Purple - peak summer
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    const billValue = payload[0]?.value || 0
    const savingsValue = payload.find(p => p.dataKey === 'savings')?.value || 0
    const avg = monthlyData.reduce((sum, d) => sum + d.bill, 0) / monthlyData.length
    const diff = billValue - avg
    const isAbove = diff > 0
    const monthData = monthlyData.find(d => d.month === label)
    
    return (
      <div className="bg-background/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-primary/30 min-w-[180px]">
        <p className="font-bold text-foreground text-xl">{label}</p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Bill</span>
            <span className="text-xl font-bold text-primary">Rs.{billValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Usage</span>
            <span className="font-semibold text-foreground">{monthData?.usage} kWh</span>
          </div>
          {savingsValue > 0 && (
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-sm text-muted-foreground">Saved</span>
              <span className="font-bold text-emerald-500">Rs.{savingsValue}</span>
            </div>
          )}
          <div className={`flex items-center gap-1 pt-2 text-sm font-medium ${isAbove ? 'text-red-500' : 'text-emerald-500'}`}>
            {isAbove ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isAbove ? '+' : ''}{Math.round(diff)} vs avg</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const getBarColor = (bill: number, avg: number, month: string) => {
  const summerMonths = ['May', 'Jun', 'Jul', 'Aug']
  if (summerMonths.includes(month)) return MONTH_COLORS.summer
  if (bill > avg * 1.1) return MONTH_COLORS.high
  if (bill > avg * 0.95) return MONTH_COLORS.medium
  return MONTH_COLORS.low
}

export function BillChart() {
  const avgBill = Math.round(monthlyData.reduce((sum, d) => sum + d.bill, 0) / monthlyData.length)
  const maxBill = Math.max(...monthlyData.map(d => d.bill))
  const minBill = Math.min(...monthlyData.map(d => d.bill))
  const totalSavings = monthlyData.reduce((sum, d) => sum + d.savings, 0)
  
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monthly Bills</h3>
          <p className="text-sm text-muted-foreground">12-month electricity bill analysis</p>
        </div>
        <div className="text-right space-y-1">
          <div>
            <p className="text-xs text-muted-foreground">Average Bill</p>
            <p className="text-lg font-bold text-primary">Rs.{avgBill.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="gradientAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
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
              tickFormatter={(value) => `${(value/1000).toFixed(1)}k`}
              width={40}
              domain={[0, 'dataMax + 500']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} />
            <ReferenceLine 
              y={avgBill} 
              stroke="#06B6D4"
              strokeDasharray="6 4" 
              strokeWidth={2}
              label={{ 
                value: `Avg Rs.${(avgBill/1000).toFixed(1)}k`, 
                position: 'insideTopRight', 
                fill: '#06B6D4', 
                fontSize: 11,
                fontWeight: 600
              }}
            />
            <Bar dataKey="bill" radius={[6, 6, 0, 0]} maxBarSize={45}>
              {monthlyData.map((entry, index) => {
                const color = getBarColor(entry.bill, avgBill, entry.month)
                let gradientId = 'gradientGreen'
                if (color === MONTH_COLORS.summer) gradientId = 'gradientPurple'
                else if (color === MONTH_COLORS.high) gradientId = 'gradientRed'
                else if (color === MONTH_COLORS.medium) gradientId = 'gradientAmber'
                
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradientId})`}
                    style={{ 
                      filter: `drop-shadow(0 2px 4px ${color}40)`,
                      cursor: 'pointer'
                    }}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with stats */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MONTH_COLORS.low, boxShadow: `0 0 6px ${MONTH_COLORS.low}` }} />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MONTH_COLORS.medium, boxShadow: `0 0 6px ${MONTH_COLORS.medium}` }} />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MONTH_COLORS.high, boxShadow: `0 0 6px ${MONTH_COLORS.high}` }} />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MONTH_COLORS.summer, boxShadow: `0 0 6px ${MONTH_COLORS.summer}` }} />
          <span className="text-xs text-muted-foreground">Summer</span>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Lowest</p>
          <p className="text-sm font-bold text-emerald-500">Rs.{minBill.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Highest</p>
          <p className="text-sm font-bold text-red-500">Rs.{maxBill.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Year Savings</p>
          <p className="text-sm font-bold text-primary">Rs.{totalSavings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
