"use client"

import { useState } from "react"
import { FileText, Download, Calendar, TrendingDown, TrendingUp, Zap, IndianRupee, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const reportTypes = [
  { id: "weekly", name: "Weekly Report", period: "Mar 10 - Mar 16, 2024" },
  { id: "monthly", name: "Monthly Report", period: "February 2024" },
  { id: "quarterly", name: "Quarterly Report", period: "Q1 2024" },
]

const weeklyData = [
  { day: "Mon", usage: 32, bill: 256, co2: 4.8 },
  { day: "Tue", usage: 38, bill: 304, co2: 5.7 },
  { day: "Wed", usage: 28, bill: 224, co2: 4.2 },
  { day: "Thu", usage: 42, bill: 336, co2: 6.3 },
  { day: "Fri", usage: 35, bill: 280, co2: 5.3 },
  { day: "Sat", usage: 45, bill: 360, co2: 6.8 },
  { day: "Sun", usage: 40, bill: 320, co2: 6.0 },
]

const monthlyComparison = {
  current: { usage: 342, bill: 2850, co2: 51, savings: 450 },
  previous: { usage: 380, bill: 3200, co2: 57, savings: 300 },
}

const topConsumers = [
  { appliance: "Air Conditioner", usage: 137, percent: 40, change: -5 },
  { appliance: "Refrigerator", usage: 62, percent: 18, change: 0 },
  { appliance: "Water Heater", usage: 51, percent: 15, change: -8 },
  { appliance: "Lighting", usage: 41, percent: 12, change: -12 },
  { appliance: "Others", usage: 51, percent: 15, change: -3 },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("weekly")
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDownloading(false)
    // In production, this would trigger an actual PDF download
    alert("Report downloaded successfully!")
  }

  const usageChange = ((monthlyComparison.current.usage - monthlyComparison.previous.usage) / monthlyComparison.previous.usage) * 100
  const billChange = ((monthlyComparison.current.bill - monthlyComparison.previous.bill) / monthlyComparison.previous.bill) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-sm">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Energy Reports</h1>
            <p className="text-muted-foreground">
              Detailed insights and downloadable reports
            </p>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="rounded-xl glow"
        >
          {isDownloading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </>
          )}
        </Button>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-3">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-all duration-200 text-left",
              selectedReport === report.id
                ? "border-primary bg-primary/10 glow-sm"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <Calendar className={cn(
                "w-5 h-5",
                selectedReport === report.id ? "text-primary" : "text-muted-foreground"
              )} />
              <div>
                <p className="font-semibold text-foreground">{report.name}</p>
                <p className="text-sm text-muted-foreground">{report.period}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Usage</p>
              <p className="text-2xl font-bold text-foreground">{monthlyComparison.current.usage} kWh</p>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              usageChange < 0 ? "text-emerald-500" : "text-amber-500"
            )}>
              {usageChange < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {Math.abs(usageChange).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bill</p>
              <p className="text-2xl font-bold text-foreground">₹{monthlyComparison.current.bill}</p>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              billChange < 0 ? "text-emerald-500" : "text-amber-500"
            )}>
              {billChange < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {Math.abs(billChange).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div>
            <p className="text-sm text-muted-foreground">CO2 Emissions</p>
            <p className="text-2xl font-bold text-foreground">{monthlyComparison.current.co2} kg</p>
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div>
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-2xl font-bold text-primary">₹{monthlyComparison.current.savings}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trend */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Daily Usage Trend</h3>
            <p className="text-sm text-muted-foreground">Energy consumption over the week</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportUsageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fill="url(#reportUsageGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bill Trend */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Daily Bill Trend</h3>
            <p className="text-sm text-muted-foreground">Cost breakdown over the week</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportBillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`₹${value}`, "Bill"]}
                />
                <Area
                  type="monotone"
                  dataKey="bill"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fill="url(#reportBillGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Consumers */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Top Energy Consumers</h3>
          <p className="text-sm text-muted-foreground">Breakdown by appliance</p>
        </div>
        <div className="space-y-4">
          {topConsumers.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-foreground">{item.appliance}</div>
              <div className="flex-1">
                <div className="h-4 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
              <div className="w-20 text-right">
                <p className="text-sm font-medium text-foreground">{item.usage} kWh</p>
                <p className="text-xs text-muted-foreground">{item.percent}%</p>
              </div>
              <div className={cn(
                "w-16 text-right text-sm font-medium",
                item.change < 0 ? "text-emerald-500" : item.change > 0 ? "text-amber-500" : "text-muted-foreground"
              )}>
                {item.change < 0 ? "↓" : item.change > 0 ? "↑" : "–"} {Math.abs(item.change)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Summary */}
      <div className="glass rounded-2xl p-6 border-2 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">Great Progress!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your energy usage decreased by 10% compared to last month.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Savings Achieved</p>
              <p className="text-sm text-muted-foreground mt-1">
                You saved ₹450 this month by following AI recommendations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">Eco Impact</p>
              <p className="text-sm text-muted-foreground mt-1">
                You reduced 6kg of CO2 emissions compared to last month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
