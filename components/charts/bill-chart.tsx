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
} from "recharts"
import { monthlyData } from "@/lib/energy-data"
import { TrendingDown, TrendingUp } from "lucide-react"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const avg = monthlyData.reduce((sum, d) => sum + d.bill, 0) / monthlyData.length
    const diff = value - avg
    const isAbove = diff > 0
    
    return (
      <div className="glass rounded-xl p-4 shadow-lg border border-border min-w-[140px]">
        <p className="font-semibold text-foreground text-lg">{label}</p>
        <p className="text-2xl font-bold text-primary mt-1">₹{value.toLocaleString()}</p>
        <div className={`flex items-center gap-1 mt-2 text-sm ${isAbove ? 'text-destructive' : 'text-emerald-500'}`}>
          {isAbove ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{isAbove ? '+' : ''}{Math.round(diff)} vs avg</span>
        </div>
      </div>
    )
  }
  return null
}

export function BillChart() {
  const avgBill = Math.round(monthlyData.reduce((sum, d) => sum + d.bill, 0) / monthlyData.length)
  const maxBill = Math.max(...monthlyData.map(d => d.bill))
  const minBill = Math.min(...monthlyData.map(d => d.bill))
  
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monthly Bills</h3>
          <p className="text-sm text-muted-foreground">Electricity bill comparison</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-lg font-bold text-primary">₹{avgBill.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-7))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--chart-7))" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
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
              tickFormatter={(value) => `₹${(value/1000).toFixed(1)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
            <ReferenceLine 
              y={avgBill} 
              stroke="hsl(var(--chart-2))" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ value: 'Avg', position: 'right', fill: 'hsl(var(--chart-2))', fontSize: 11 }}
            />
            <Bar dataKey="bill" radius={[8, 8, 0, 0]} maxBarSize={50}>
              {monthlyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.bill > avgBill * 1.15
                      ? "url(#barGradientRed)"
                      : entry.bill > avgBill
                      ? "url(#barGradientOrange)"
                      : "url(#barGradientGreen)"
                  }
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-1" />
          <span className="text-xs text-muted-foreground">Below avg</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-3" />
          <span className="text-xs text-muted-foreground">At avg</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-7" />
          <span className="text-xs text-muted-foreground">Above avg</span>
        </div>
      </div>
    </div>
  )
}
