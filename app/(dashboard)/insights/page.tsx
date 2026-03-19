"use client"

import { TrendingUp, TrendingDown, Zap, Leaf, Target, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { hourlyUsage } from "@/lib/energy-data"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  Cell,
} from "recharts"

const weeklyInsights = [
  {
    day: "Mon",
    usage: 32,
    average: 35,
    savings: 8,
  },
  {
    day: "Tue",
    usage: 38,
    average: 35,
    savings: -5,
  },
  {
    day: "Wed",
    usage: 28,
    average: 35,
    savings: 15,
  },
  {
    day: "Thu",
    usage: 42,
    average: 35,
    savings: -12,
  },
  {
    day: "Fri",
    usage: 35,
    average: 35,
    savings: 0,
  },
  {
    day: "Sat",
    usage: 45,
    average: 35,
    savings: -18,
  },
  {
    day: "Sun",
    usage: 40,
    average: 35,
    savings: -10,
  },
]

const carbonData = [
  { month: "Jan", emissions: 45, saved: 12 },
  { month: "Feb", emissions: 52, saved: 8 },
  { month: "Mar", emissions: 48, saved: 15 },
  { month: "Apr", emissions: 55, saved: 10 },
  { month: "May", emissions: 62, saved: 18 },
  { month: "Jun", emissions: 70, saved: 22 },
]

export default function InsightsPage() {
  const totalSaved = carbonData.reduce((acc, curr) => acc + curr.saved, 0)
  const avgDailyUsage = Math.round(weeklyInsights.reduce((acc, curr) => acc + curr.usage, 0) / 7)
  const peakHours = hourlyUsage.filter((h) => h.isPeak).length
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Energy Insights</h1>
        <p className="text-muted-foreground">
          Deep dive into your energy patterns and environmental impact
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-xl font-bold text-foreground">{avgDailyUsage} kWh</p>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CO2 Saved</p>
              <p className="text-xl font-bold text-foreground">{totalSaved} kg</p>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peak Hours</p>
              <p className="text-xl font-bold text-foreground">{peakHours}h/day</p>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Efficiency</p>
              <p className="text-xl font-bold text-foreground">78%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Usage Pattern */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Hourly Usage Pattern</h3>
            <p className="text-sm text-muted-foreground">Today&apos;s energy consumption by hour</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyUsage} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  interval={3}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`${value} kWh`, "Usage"]}
                />
                <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                  {hourlyUsage.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isPeak ? "hsl(var(--chart-4))" : "hsl(var(--chart-1))"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Off-Peak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-4" />
              <span className="text-muted-foreground">Peak Hours (6PM-10PM)</span>
            </div>
          </div>
        </div>

        {/* Carbon Footprint */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Carbon Footprint</h3>
            <p className="text-sm text-muted-foreground">Monthly CO2 emissions vs savings</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={carbonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="savedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  name="Emissions"
                  stroke="hsl(var(--chart-5))"
                  fill="url(#emissionsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="saved"
                  name="Saved"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#savedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Weekly Performance</h3>
          <p className="text-sm text-muted-foreground">Daily usage compared to your average</p>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weeklyInsights.map((day) => (
            <div
              key={day.day}
              className={cn(
                "p-4 rounded-xl text-center transition-all duration-200 hover:scale-105",
                day.savings > 0
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : day.savings < 0
                  ? "bg-amber-500/10 border border-amber-500/30"
                  : "bg-muted/50 border border-border"
              )}
            >
              <p className="text-sm font-medium text-muted-foreground">{day.day}</p>
              <p className="text-xl font-bold text-foreground mt-1">{day.usage}</p>
              <p className="text-xs text-muted-foreground">kWh</p>
              <div className={cn(
                "flex items-center justify-center gap-1 mt-2 text-xs font-medium",
                day.savings > 0 ? "text-emerald-500" : day.savings < 0 ? "text-amber-500" : "text-muted-foreground"
              )}>
                {day.savings > 0 ? (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    {day.savings}%
                  </>
                ) : day.savings < 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    {Math.abs(day.savings)}%
                  </>
                ) : (
                  "Avg"
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Alerts */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Smart Alerts</h3>
          <p className="text-sm text-muted-foreground">Real-time notifications about your usage</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Usage Spike Detected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your usage increased by 20% compared to yesterday. Check if any appliances are running unnecessarily.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Great Off-Peak Shift!</p>
              <p className="text-sm text-muted-foreground mt-1">
                You moved 35% of your laundry usage to off-peak hours this week. Keep it up!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
            <Zap className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Standby Power Alert</p>
              <p className="text-sm text-muted-foreground mt-1">
                Turn off idle devices to save an estimated ₹150/month on phantom loads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
