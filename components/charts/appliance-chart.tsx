"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { applianceBreakdown } from "@/lib/energy-data"

const COLORS = [
  "hsl(var(--chart-1))",  /* Emerald */
  "hsl(var(--chart-2))",  /* Purple */
  "hsl(var(--chart-3))",  /* Orange */
  "hsl(var(--chart-4))",  /* Cyan */
  "hsl(var(--chart-5))",  /* Pink */
  "hsl(var(--chart-6))",  /* Yellow */
  "hsl(var(--chart-7))",  /* Coral */
  "hsl(var(--chart-8))",  /* Sky Blue */
]

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { name: string; usage: number } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="glass rounded-xl p-3 shadow-lg border border-border">
        <p className="font-semibold text-foreground">{data.payload.name}</p>
        <p className="text-primary font-bold text-lg">{data.value}%</p>
        <p className="text-xs text-muted-foreground">of total energy</p>
      </div>
    )
  }
  return null
}

export function ApplianceChart() {
  const total = applianceBreakdown.reduce((sum, item) => sum + item.usage, 0)
  
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Appliance Breakdown</h3>
        <p className="text-sm text-muted-foreground">Energy usage by appliance type</p>
      </div>
      
      <div className="flex-1 min-h-[280px] flex items-center">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={applianceBreakdown}
              cx="40%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={3}
              dataKey="usage"
              nameKey="name"
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {applianceBreakdown.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#pieGradient${index % COLORS.length})`}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ paddingLeft: '20px' }}
              formatter={(value, entry) => {
                const item = applianceBreakdown.find(d => d.name === value)
                return (
                  <span className="text-sm">
                    <span className="text-foreground font-medium">{value}</span>
                    <span className="text-muted-foreground ml-2">{item?.usage}%</span>
                  </span>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Mini stats below */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{applianceBreakdown[0]?.name}</p>
          <p className="text-xs text-muted-foreground">Highest Usage</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{total}%</p>
          <p className="text-xs text-muted-foreground">Total Tracked</p>
        </div>
      </div>
    </div>
  )
}
