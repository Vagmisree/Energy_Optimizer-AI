'use client'

import { TrendingUp, TrendingDown, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'

interface MonthlyData {
  month: string
  usage: number
  bill: number
}

interface DataStoryProps {
  currentMonth: MonthlyData
  lastMonth: MonthlyData
  monthlyTrend: MonthlyData[]
}

export function DataStorytellingPanel({ currentMonth, lastMonth, monthlyTrend }: DataStoryProps) {
  const usageDiff = currentMonth.usage - lastMonth.usage
  const billDiff = currentMonth.bill - lastMonth.bill
  const usagePercent = Math.round((usageDiff / lastMonth.usage) * 100)
  const billPercent = Math.round((billDiff / lastMonth.bill) * 100)

  // Generate storytelling narrative
  const generateNarrative = () => {
    const narratives = []

    if (usageDiff > 0) {
      narratives.push(
        `Your energy usage increased by ${Math.abs(usagePercent)}% this month compared to last month. This spike is likely due to increased AC usage during peak summer hours.`
      )
    } else {
      narratives.push(
        `You reduced energy usage by ${Math.abs(usagePercent)}% compared to last month - great progress!`
      )
    }

    if (billDiff > 0) {
      narratives.push(
        `Your bill increased by ₹${Math.abs(billDiff)} (${Math.abs(billPercent)}%). Reducing AC usage by 2 hours daily could save ₹${Math.round(billDiff * 0.6)} per month.`
      )
    } else {
      narratives.push(
        `You saved ₹${Math.abs(billDiff)} this month by optimizing appliance usage during off-peak hours.`
      )
    }

    return narratives
  }

  const narratives = generateNarrative()

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Your Energy Story</h3>
        <p className="text-sm text-muted-foreground mt-2">AI-generated insights about your usage patterns</p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Usage Comparison */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Energy Usage</p>
              <p className="text-2xl font-bold text-foreground">{currentMonth.usage} kWh</p>
            </div>
            {usageDiff !== 0 && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                usageDiff > 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
              }`}>
                {usageDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(usagePercent)}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">vs {lastMonth.usage} kWh last month</p>
        </div>

        {/* Bill Comparison */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Estimated Bill</p>
              <p className="text-2xl font-bold text-foreground">₹{currentMonth.bill}</p>
            </div>
            {billDiff !== 0 && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                billDiff > 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
              }`}>
                {billDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(billPercent)}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">vs ₹{lastMonth.bill} last month</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">6-Month Trend</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Bar dataKey="usage" fill="hsl(var(--chart-1))" name="Usage (kWh)" />
              <Line dataKey="bill" stroke="hsl(var(--chart-4))" type="monotone" name="Bill (₹)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Narrative */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">AI Analysis</h4>
        {narratives.map((narrative, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-foreground">{narrative}</p>
          </div>
        ))}
      </div>

      {/* Action Items */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Recommended Actions
        </h4>
        <ul className="space-y-2">
          <li className="text-sm text-foreground">
            • Run AC for 2 fewer hours daily to save ₹{Math.round(Math.abs(billDiff) * 0.6)}/month
          </li>
          <li className="text-sm text-foreground">
            • Shift washing machine usage to off-peak hours (12 AM - 5 AM)
          </li>
          <li className="text-sm text-foreground">
            • Reduce water heater temperature by 5°C to save ₹100-150/month
          </li>
        </ul>
      </div>
    </div>
  )
}

// User vs Average Comparison
interface UsageComparisonProps {
  userUsage: number
  avgUsage: number
  userBill: number
  avgBill: number
}

export function UsageComparisonPanel({
  userUsage,
  avgUsage,
  userBill,
  avgBill,
}: UsageComparisonProps) {
  const usageDiff = userUsage - avgUsage
  const billDiff = userBill - avgBill
  const isAboveAvg = usageDiff > 0

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Your Usage vs Average</h3>

      {/* Usage Comparison */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-foreground">Energy Usage</span>
          <span className="text-xs text-muted-foreground">
            {isAboveAvg ? '+' : '-'}{Math.abs(usageDiff)} kWh
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground">Your Usage</p>
            <p className="text-lg font-bold text-primary">{userUsage} kWh</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-bold text-foreground">{avgUsage} kWh</p>
          </div>
        </div>
      </div>

      {/* Bill Comparison */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-foreground">Monthly Bill</span>
          <span className={`text-xs font-medium ${billDiff > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {billDiff > 0 ? '+' : '-'}₹{Math.abs(billDiff)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-3 rounded-lg border ${billDiff > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            <p className="text-xs text-muted-foreground">Your Bill</p>
            <p className={`text-lg font-bold ${billDiff > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>₹{userBill}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-bold text-foreground">₹{avgBill}</p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
        <p className="text-sm text-foreground">
          {isAboveAvg
            ? `You're using ${Math.round((usageDiff / avgUsage) * 100)}% more than average. Consider reducing AC and heater usage.`
            : `Great! You're using ${Math.round(Math.abs((usageDiff / avgUsage) * 100))}% less than average.`}
        </p>
      </div>
    </div>
  )
}
