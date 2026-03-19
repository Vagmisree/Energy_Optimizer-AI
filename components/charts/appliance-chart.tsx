"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from "recharts"
import { applianceBreakdown } from "@/lib/energy-data"
import { useState } from "react"

// Vibrant, distinct colors for each appliance
const VIBRANT_COLORS = [
  "#10B981", // Emerald green - AC
  "#8B5CF6", // Vivid purple - Refrigerator
  "#F59E0B", // Amber orange - Water Heater
  "#06B6D4", // Cyan - Washing Machine
  "#EC4899", // Pink - Lighting
  "#EF4444", // Red - TV & Entertainment
  "#6366F1", // Indigo - Others
]

interface ActiveShapeProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: { name: string; usage: number; kWh: number; cost: number }
  percent: number
  value: number
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="hsl(var(--foreground))" className="text-sm font-semibold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} dy={8} textAnchor="middle" fill={fill} className="text-2xl font-bold">
        {value}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 12px ${fill})` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
        opacity={0.4}
      />
    </g>
  )
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; usage: number; kWh: number; cost: number } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-primary/30">
        <p className="font-bold text-foreground text-lg">{data.name}</p>
        <div className="mt-2 space-y-1">
          <p className="text-primary font-bold text-2xl">{data.usage}%</p>
          <p className="text-sm text-muted-foreground">{data.kWh} kWh/month</p>
          <p className="text-sm font-semibold text-emerald-500">Cost: Rs.{data.cost}/mo</p>
        </div>
      </div>
    )
  }
  return null
}

export function ApplianceChart() {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = applianceBreakdown.reduce((sum, item) => sum + item.usage, 0)
  const totalCost = applianceBreakdown.reduce((sum, item) => sum + item.cost, 0)
  
  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Appliance Breakdown</h3>
          <p className="text-sm text-muted-foreground">Energy usage by appliance</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Cost</p>
          <p className="text-lg font-bold text-primary">Rs.{totalCost.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-[260px] flex items-center">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <defs>
              {VIBRANT_COLORS.map((color, index) => (
                <linearGradient key={`gradient-${index}`} id={`colorfulGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.75} />
                </linearGradient>
              ))}
              {VIBRANT_COLORS.map((color, index) => (
                <filter key={`glow-${index}`} id={`glow${index}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              ))}
            </defs>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={applianceBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="usage"
              nameKey="name"
              onMouseEnter={onPieEnter}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {applianceBreakdown.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#colorfulGradient${index % VIBRANT_COLORS.length})`}
                  style={{ 
                    filter: activeIndex === index ? `drop-shadow(0 0 8px ${VIBRANT_COLORS[index % VIBRANT_COLORS.length]})` : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Color Legend Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 pt-3 border-t border-border">
        {applianceBreakdown.map((item, index) => (
          <div 
            key={item.name} 
            className={`flex items-center gap-2 cursor-pointer transition-all duration-200 rounded-lg px-2 py-1 ${
              activeIndex === index ? 'bg-muted/50 scale-105' : 'hover:bg-muted/30'
            }`}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ 
                backgroundColor: VIBRANT_COLORS[index % VIBRANT_COLORS.length],
                boxShadow: activeIndex === index ? `0 0 8px ${VIBRANT_COLORS[index % VIBRANT_COLORS.length]}` : 'none'
              }}
            />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            <span className="text-xs font-bold text-foreground ml-auto">{item.usage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
